'use server';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Client, neonConfig, types } from '@neondatabase/serverless';
import ws from 'ws';
import {
  DEFAULT_PROFILE,
  normalizeProfile,
  normalizeProfileTitle,
} from '@/lib/setupData';
import {
  PREVIEW_EQUIPMENT,
  PREVIEW_EVENTS,
  PREVIEW_PROFILE,
  PREVIEW_SECTIONS,
} from '@/lib/previewData';

neonConfig.webSocketConstructor = ws;
types.setTypeParser(types.builtins.DATE, value => value);

const EDITOR_COOKIE = 'misetup_editor';
const SESSION_MESSAGE = 'misetup-editor-session-v1';
const EDITOR_SESSION_MAX_AGE = 60 * 60 * 12;

function isDatabaseMode() {
  return process.env.MISETUP_MODE === 'database';
}

function getConnectionString() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    throw new Error('Falta configurar la conexión a PostgreSQL.');
  }

  return connectionString;
}

function createSqlTag(connection) {
  return (strings, ...values) => {
    let text = strings[0];
    for (let index = 0; index < values.length; index += 1) {
      text += `$${index + 1}${strings[index + 1]}`;
    }
    return connection.query(text, values);
  };
}

async function withClient(callback, { readOnly = false } = {}) {
  const connection = new Client({ connectionString: getConnectionString() });
  let connected = false;
  let transactionStarted = false;

  try {
    await connection.connect();
    connected = true;
    if (readOnly) {
      await connection.query('BEGIN TRANSACTION READ ONLY');
      transactionStarted = true;
    }

    const client = {
      sql: createSqlTag(connection),
      query: (text, values) => connection.query(text, values),
    };
    const result = await callback(client);

    if (transactionStarted) await connection.query('COMMIT');
    return result;
  } catch (error) {
    if (transactionStarted) {
      try {
        await connection.query('ROLLBACK');
      } catch {
        // La conexión puede haberse cerrado antes de poder revertir la lectura.
      }
    }
    throw error;
  } finally {
    if (connected) {
      try {
        await connection.end();
      } catch (error) {
        console.error('Failed to close Neon client:', error);
      }
    }
  }
}

function expectedSessionToken() {
  const password = process.env.EDITOR_PASSWORD;
  if (!password) return null;
  return createHmac('sha256', password).update(SESSION_MESSAGE).digest('hex');
}

function safeEqual(left, right) {
  if (!left || !right) return false;
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function requireDatabaseMode() {
  if (!isDatabaseMode()) {
    throw new Error('La preview pública es de solo lectura.');
  }
}

async function requireEditorSession() {
  requireDatabaseMode();
  const expected = expectedSessionToken();
  const cookieStore = await cookies();
  if (!expected || !safeEqual(cookieStore.get(EDITOR_COOKIE)?.value, expected)) {
    throw new Error('Tu sesión de editor no es válida.');
  }
}

export async function startEditorSession(password) {
  requireDatabaseMode();
  const expected = expectedSessionToken();
  const candidate = createHmac('sha256', String(password || ''))
    .update(SESSION_MESSAGE)
    .digest('hex');

  if (!expected || !safeEqual(candidate, expected)) {
    return { success: false, error: 'La clave de editor no es correcta.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(EDITOR_COOKIE, expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: EDITOR_SESSION_MAX_AGE,
  });
  return { success: true };
}

export async function endEditorSession() {
  const cookieStore = await cookies();
  cookieStore.delete(EDITOR_COOKIE);
  return { success: true };
}

function cleanText(value, maxLength, fallback = '') {
  return String(value ?? fallback).trim().slice(0, maxLength);
}

function cleanNullableText(value, maxLength) {
  const result = cleanText(value, maxLength);
  return result || null;
}

function cleanUrl(value) {
  if (!value) return null;
  const text = String(value).trim();
  if (!text) return null;
  if (text.startsWith('/') || text.startsWith('data:image/')) {
    return text.slice(0, 5000000);
  }
  try {
    const url = new URL(text);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

function cleanUrlArray(value) {
  const source = Array.isArray(value) ? value : String(value || '').split(',');
  return source.map(cleanUrl).filter(Boolean).slice(0, 8);
}

function cleanTags(value) {
  const source = Array.isArray(value) ? value : String(value || '').split(',');
  return [...new Set(
    source
      .map(tag => cleanText(tag, 30).toLowerCase())
      .filter(Boolean)
  )].slice(0, 12);
}

function cleanMoney(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function cleanDate(value) {
  if (!value) return null;
  const text = String(value).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

function cleanEquipmentId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function cleanEquipment(item) {
  const type = cleanText(item.type, 100);
  if (!type) throw new Error('El tipo del elemento es obligatorio.');

  const status = item.status === 'wishlist' ? 'wishlist' : 'active';
  const itemKind = ['hardware', 'software', 'service'].includes(item.item_kind)
    ? item.item_kind
    : 'hardware';
  const priority = Number(item.wishlist_priority);

  return {
    category: cleanText(item.category, 50, 'core'),
    type,
    brand: cleanNullableText(item.brand, 100),
    model: cleanNullableText(item.model, 255),
    description: cleanNullableText(item.description, 3000),
    icon_name: cleanText(item.icon_name, 100, 'fa-solid fa-box'),
    website_url: cleanUrl(item.website_url),
    position: Number.isInteger(Number(item.position)) ? Number(item.position) : 0,
    item_kind: itemKind,
    status,
    is_public: item.is_public !== false,
    tags: cleanTags(item.tags),
    purchase_price: cleanMoney(item.purchase_price),
    target_price: cleanMoney(item.target_price),
    currency: cleanText(item.currency, 3, 'CLP').toUpperCase(),
    purchase_date: cleanDate(item.purchase_date),
    warranty_until: cleanDate(item.warranty_until),
    private_notes: cleanNullableText(item.private_notes, 5000),
    choice_reason: cleanNullableText(item.choice_reason, 2000),
    manual_urls: cleanUrlArray(item.manual_urls),
    photo_urls: cleanUrlArray(item.photo_urls),
    wishlist_priority: [1, 2, 3].includes(priority) ? priority : 2,
    planned_for: cleanDate(item.planned_for),
    roadmap_position: Number.isInteger(Number(item.roadmap_position))
      ? Number(item.roadmap_position)
      : 0,
    compatibility_notes: cleanNullableText(item.compatibility_notes, 3000),
  };
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
}

async function fetchSetupData(client, editor) {
  const { rows: profileRows } =
    await client.sql`SELECT * FROM setup_profile WHERE id = 1`;
  const profile = normalizeProfile(profileRows[0] || DEFAULT_PROFILE);

  const equipmentResult = editor
    ? await client.sql`
        SELECT * FROM equipment
        ORDER BY position ASC, created_at ASC
      `
    : await client.sql`
        SELECT
          id, category, type, brand, model, description, icon_name, website_url,
          position, created_at, item_kind, status, is_public, tags,
          CASE WHEN ${profile.show_prices} THEN purchase_price ELSE NULL END AS purchase_price,
          CASE WHEN ${profile.show_prices} THEN target_price ELSE NULL END AS target_price,
          currency, purchase_date, warranty_until, NULL::TEXT AS private_notes,
          choice_reason, manual_urls, photo_urls, wishlist_priority, planned_for,
          roadmap_position, compatibility_notes, updated_at
        FROM equipment
        WHERE is_public = TRUE
        ORDER BY position ASC, created_at ASC
      `;

  const [sectionsResult, eventsResult] = await Promise.all([
    client.sql`SELECT * FROM sections ORDER BY position ASC, created_at ASC`,
    editor
      ? client.sql`
          SELECT * FROM setup_events
          ORDER BY occurred_on DESC, created_at DESC
        `
      : client.sql`
          SELECT
            id, equipment_id, event_type, title, description, occurred_on,
            CASE WHEN ${profile.show_prices} THEN amount ELSE NULL END AS amount,
            currency, is_public, created_at
          FROM setup_events
          WHERE is_public = TRUE
          ORDER BY occurred_on DESC, created_at DESC
        `,
  ]);

  return {
    items: equipmentResult.rows,
    sections: sectionsResult.rows,
    profile,
    events: eventsResult.rows,
  };
}

export async function getSetupData() {
  if (isDatabaseMode()) {
    return withClient(client => fetchSetupData(client, false));
  }

  try {
    return await withClient(client => fetchSetupData(client, false), {
      readOnly: true,
    });
  } catch (error) {
    console.warn(
      'PostgreSQL read error, returning the bundled preview dataset:',
      error?.message
    );
    return {
      items: PREVIEW_EQUIPMENT,
      sections: PREVIEW_SECTIONS,
      profile: PREVIEW_PROFILE,
      events: PREVIEW_EVENTS,
    };
  }
}

export async function getEditorSetupData() {
  await requireEditorSession();
  return withClient(client => fetchSetupData(client, true));
}

async function write(callback) {
  await requireEditorSession();
  try {
    const result = await withClient(callback);
    revalidatePath('/');
    return result;
  } catch (error) {
    console.error('Database write failed:', error);
    return { success: false, error: 'No se pudo guardar el cambio.' };
  }
}

export async function addEquipment(item) {
  const input = cleanEquipment(item);
  return write(async client => {
    await client.sql`BEGIN`;
    try {
      const { rows } = await client.sql`
        INSERT INTO equipment (
          category, type, brand, model, description, icon_name, website_url, position,
          item_kind, status, is_public, tags, purchase_price, target_price, currency,
          purchase_date, warranty_until, private_notes, choice_reason, manual_urls,
          photo_urls, wishlist_priority, planned_for, roadmap_position, compatibility_notes
        ) VALUES (
          ${input.category}, ${input.type}, ${input.brand}, ${input.model}, ${input.description},
          ${input.icon_name}, ${input.website_url}, ${input.position}, ${input.item_kind},
          ${input.status}, ${input.is_public}, ${input.tags}, ${input.purchase_price},
          ${input.target_price}, ${input.currency}, ${input.purchase_date}, ${input.warranty_until},
          ${input.private_notes}, ${input.choice_reason}, ${input.manual_urls}, ${input.photo_urls},
          ${input.wishlist_priority}, ${input.planned_for}, ${input.roadmap_position},
          ${input.compatibility_notes}
        ) RETURNING *
      `;
      const itemLabel = [input.brand, input.model || input.type]
        .filter(Boolean)
        .join(' ');
      const { rows: eventRows } = await client.sql`
        INSERT INTO setup_events (
          equipment_id, event_type, title, occurred_on, amount, currency, is_public
        ) VALUES (
          ${rows[0].id},
          ${input.status === 'wishlist' ? 'planned' : 'added'},
          ${input.status === 'wishlist' ? `Upgrade planificado: ${itemLabel}` : `Nuevo en el setup: ${itemLabel}`},
          ${input.planned_for || input.purchase_date || new Date().toISOString().slice(0, 10)},
          ${input.status === 'wishlist' ? input.target_price : input.purchase_price},
          ${input.currency},
          ${input.is_public}
        ) RETURNING *
      `;
      await client.sql`COMMIT`;
      return { success: true, item: rows[0], event: eventRows[0] };
    } catch (error) {
      await client.sql`ROLLBACK`;
      throw error;
    }
  });
}

export async function updateEquipment(id, item) {
  const equipmentId = cleanEquipmentId(id);
  if (!equipmentId) return { success: false, error: 'Elemento inválido.' };
  const input = cleanEquipment(item);
  return write(async client => {
    const { rows } = await client.sql`
      UPDATE equipment SET
        category = ${input.category}, type = ${input.type}, brand = ${input.brand},
        model = ${input.model}, description = ${input.description}, icon_name = ${input.icon_name},
        website_url = ${input.website_url}, position = ${input.position},
        item_kind = ${input.item_kind}, status = ${input.status}, is_public = ${input.is_public},
        tags = ${input.tags}, purchase_price = ${input.purchase_price},
        target_price = ${input.target_price}, currency = ${input.currency},
        purchase_date = ${input.purchase_date}, warranty_until = ${input.warranty_until},
        private_notes = ${input.private_notes}, choice_reason = ${input.choice_reason},
        manual_urls = ${input.manual_urls}, photo_urls = ${input.photo_urls},
        wishlist_priority = ${input.wishlist_priority}, planned_for = ${input.planned_for},
        roadmap_position = ${input.roadmap_position}, compatibility_notes = ${input.compatibility_notes},
        updated_at = NOW()
      WHERE id = ${equipmentId}
      RETURNING *
    `;
    if (!rows[0]) return { success: false, error: 'El elemento ya no existe.' };
    return { success: true, item: rows[0] };
  });
}

export async function deleteEquipment(id) {
  const equipmentId = cleanEquipmentId(id);
  if (!equipmentId) return { success: false, error: 'Elemento inválido.' };
  return write(async client => {
    const { rowCount } = await client.sql`DELETE FROM equipment WHERE id = ${equipmentId}`;
    return rowCount
      ? { success: true }
      : { success: false, error: 'El elemento ya no existe.' };
  });
}

export async function updateSetupProfile(profile) {
  const input = {
    title: normalizeProfileTitle(cleanText(profile.title, 120, DEFAULT_PROFILE.title)),
    tagline: cleanNullableText(profile.tagline, 240),
    description: cleanNullableText(profile.description, 2000),
    default_currency: cleanText(profile.default_currency, 3, 'CLP').toUpperCase(),
    wishlist_budget: cleanMoney(profile.wishlist_budget) || 0,
    show_prices: profile.show_prices !== false,
  };
  return write(async client => {
    const { rows } = await client.sql`
      UPDATE setup_profile SET
        title = ${input.title}, tagline = ${input.tagline}, description = ${input.description},
        default_currency = ${input.default_currency}, wishlist_budget = ${input.wishlist_budget},
        show_prices = ${input.show_prices}, updated_at = NOW()
      WHERE id = 1
      RETURNING *
    `;
    return { success: true, profile: rows[0] };
  });
}

export async function addSetupEvent(event) {
  const input = {
    event_type: ['added', 'purchased', 'upgraded', 'planned', 'note'].includes(event.event_type)
      ? event.event_type
      : 'note',
    title: cleanText(event.title, 160),
    description: cleanNullableText(event.description, 2000),
    occurred_on: cleanDate(event.occurred_on) || new Date().toISOString().slice(0, 10),
    amount: cleanMoney(event.amount),
    currency: cleanText(event.currency, 3, 'CLP').toUpperCase(),
    is_public: event.is_public !== false,
  };
  if (!input.title) return { success: false, error: 'El título del evento es obligatorio.' };
  return write(async client => {
    const { rows } = await client.sql`
      INSERT INTO setup_events (
        event_type, title, description, occurred_on, amount, currency, is_public
      ) VALUES (
        ${input.event_type}, ${input.title}, ${input.description}, ${input.occurred_on},
        ${input.amount}, ${input.currency}, ${input.is_public}
      ) RETURNING *
    `;
    return { success: true, event: rows[0] };
  });
}

export async function deleteSetupEvent(id) {
  const eventId = Number(id);
  if (!Number.isInteger(eventId)) return { success: false, error: 'Evento inválido.' };
  return write(async client => {
    await client.sql`DELETE FROM setup_events WHERE id = ${eventId}`;
    return { success: true };
  });
}

export async function addSection({ title, icon_name }) {
  const slug = slugify(title);
  if (!slug) return { success: false, error: 'Nombre de sección inválido.' };
  return write(async client => {
    const { rows: positionRows } =
      await client.sql`SELECT COALESCE(MAX(position), -1) + 1 AS next FROM sections`;
    const { rows } = await client.sql`
      INSERT INTO sections (slug, title, icon_name, position)
      VALUES (
        ${slug}, ${cleanText(title, 100, slug)},
        ${cleanText(icon_name, 100, 'fa-solid fa-folder')}, ${positionRows[0].next}
      ) ON CONFLICT (slug) DO NOTHING
      RETURNING *
    `;
    return rows[0]
      ? { success: true, section: rows[0] }
      : { success: false, error: 'Ya existe una sección con ese nombre.' };
  });
}

export async function deleteSection(id) {
  const sectionId = Number(id);
  if (!Number.isInteger(sectionId)) return { success: false, error: 'Sección inválida.' };
  return write(async client => {
    const { rows: sectionRows } =
      await client.sql`SELECT slug FROM sections WHERE id = ${sectionId}`;
    if (!sectionRows[0]) return { success: false, error: 'La sección no existe.' };
    const { rows: countRows } = await client.sql`
      SELECT COUNT(*)::int AS count FROM equipment WHERE category = ${sectionRows[0].slug}
    `;
    if (countRows[0].count > 0) {
      return { success: false, error: 'Solo puedes eliminar secciones vacías.' };
    }
    await client.sql`DELETE FROM sections WHERE id = ${sectionId}`;
    return { success: true };
  });
}

export async function updateSection(id, { title, icon_name }) {
  const sectionId = Number(id);
  const displayTitle = cleanText(title, 100);
  if (!Number.isInteger(sectionId) || !displayTitle) {
    return { success: false, error: 'Título inválido.' };
  }
  return write(async client => {
    const { rows } = await client.sql`
      UPDATE sections SET
        title = ${displayTitle},
        icon_name = ${cleanText(icon_name, 100, 'fa-solid fa-folder')}
      WHERE id = ${sectionId}
      RETURNING *
    `;
    return rows[0]
      ? { success: true, section: rows[0] }
      : { success: false, error: 'La sección no existe.' };
  });
}

export async function reorderSections(orderedIds) {
  if (!orderedIds.every(id => Number.isInteger(Number(id)))) {
    return { success: false, error: 'Sección inválida.' };
  }
  return write(async client => {
    await client.sql`BEGIN`;
    try {
      for (let index = 0; index < orderedIds.length; index += 1) {
        await client.sql`UPDATE sections SET position = ${index} WHERE id = ${Number(orderedIds[index])}`;
      }
      await client.sql`COMMIT`;
      return { success: true };
    } catch (error) {
      await client.sql`ROLLBACK`;
      throw error;
    }
  });
}

export async function reorderEquipment(orderedIds) {
  const equipmentIds = orderedIds.map(cleanEquipmentId);
  if (equipmentIds.some(id => id === null)) {
    return { success: false, error: 'Elemento inválido.' };
  }
  return write(async client => {
    await client.sql`BEGIN`;
    try {
      for (let index = 0; index < equipmentIds.length; index += 1) {
        await client.sql`
          UPDATE equipment
          SET position = ${index}, roadmap_position = ${index}, updated_at = NOW()
          WHERE id = ${equipmentIds[index]}
        `;
      }
      await client.sql`COMMIT`;
      return { success: true };
    } catch (error) {
      await client.sql`ROLLBACK`;
      throw error;
    }
  });
}
