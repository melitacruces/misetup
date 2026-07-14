'use server';

import { createClient } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export async function getEquipment() {
  const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL });
  await client.connect();
  try {
    const { rows } = await client.sql`SELECT * FROM equipment ORDER BY position ASC, created_at ASC`;
    return rows;
  } catch (error) {
    console.error('Failed to fetch equipment:', error);
    throw new Error('Failed to fetch equipment.');
  } finally {
    await client.end();
  }
}

export async function addEquipment(item) {
  const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL });
  await client.connect();
  try {
    const { rows } = await client.sql`
      INSERT INTO equipment (category, type, brand, model, description, icon_name, website_url, position)
      VALUES (${item.category}, ${item.type}, ${item.brand}, ${item.model}, ${item.description}, ${item.icon_name || 'fa-solid fa-box'}, ${item.website_url || null}, ${item.position || 0})
      RETURNING *;
    `;
    revalidatePath('/');
    return { success: true, item: rows[0] };
  } catch (error) {
    console.error('Failed to add equipment:', error);
    throw new Error('Failed to add equipment.');
  } finally {
    await client.end();
  }
}

export async function updateEquipment(id, item) {
  const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL });
  await client.connect();
  try {
    const { rows } = await client.sql`
      UPDATE equipment
      SET type = ${item.type}, brand = ${item.brand}, model = ${item.model}, description = ${item.description}, icon_name = ${item.icon_name}, website_url = ${item.website_url || null}, position = ${item.position || 0}
      WHERE id = ${id}
      RETURNING *;
    `;
    revalidatePath('/');
    return { success: true, item: rows[0] };
  } catch (error) {
    console.error('Failed to update equipment:', error);
    throw new Error('Failed to update equipment.');
  } finally {
    await client.end();
  }
}

export async function deleteEquipment(id) {
  const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL });
  await client.connect();
  try {
    await client.sql`DELETE FROM equipment WHERE id = ${id}`;
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete equipment:', error);
    throw new Error('Failed to delete equipment.');
  } finally {
    await client.end();
  }
}

export async function verifyPassword(password) {
  return password === process.env.EDITOR_PASSWORD;
}

const DEFAULT_SECTIONS = [
  { slug: 'core', title: 'core', icon_name: 'fa-solid fa-server', position: 0 },
  { slug: 'desk', title: 'desk', icon_name: 'fa-solid fa-computer-mouse', position: 1 },
  { slug: 'studio', title: 'studio', icon_name: 'fa-solid fa-headphones', position: 2 },
  { slug: 'mobile', title: 'mobile', icon_name: 'fa-solid fa-briefcase', position: 3 },
];

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
}

async function ensureSectionsTable(client) {
  await client.sql`
    CREATE TABLE IF NOT EXISTS sections (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(50) NOT NULL UNIQUE,
      title VARCHAR(100) NOT NULL,
      icon_name VARCHAR(100) DEFAULT 'fa-solid fa-folder',
      position INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  const { rows } = await client.sql`SELECT COUNT(*)::int AS count FROM sections`;
  if (rows[0].count === 0) {
    for (const s of DEFAULT_SECTIONS) {
      await client.sql`
        INSERT INTO sections (slug, title, icon_name, position)
        VALUES (${s.slug}, ${s.title}, ${s.icon_name}, ${s.position})
        ON CONFLICT (slug) DO NOTHING;
      `;
    }
  }
}

export async function getSections() {
  const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL });
  await client.connect();
  try {
    await ensureSectionsTable(client);
    const { rows } = await client.sql`SELECT * FROM sections ORDER BY position ASC, created_at ASC`;
    return rows;
  } catch (error) {
    console.error('Failed to fetch sections:', error);
    throw new Error('Failed to fetch sections.');
  } finally {
    await client.end();
  }
}

export async function addSection({ title, icon_name }) {
  const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL });
  await client.connect();
  try {
    await ensureSectionsTable(client);
    const slug = slugify(title);
    if (!slug) return { success: false, error: 'Nombre de sección inválido.' };
    const displayTitle = slug;
    const { rows: posRows } = await client.sql`SELECT COALESCE(MAX(position), -1) + 1 AS next FROM sections`;
    const nextPos = posRows[0].next;
    const { rows } = await client.sql`
      INSERT INTO sections (slug, title, icon_name, position)
      VALUES (${slug}, ${displayTitle}, ${icon_name || 'fa-solid fa-folder'}, ${nextPos})
      ON CONFLICT (slug) DO NOTHING
      RETURNING *;
    `;
    if (rows.length === 0) return { success: false, error: 'Ya existe una sección con ese nombre.' };
    revalidatePath('/');
    return { success: true, section: rows[0] };
  } catch (error) {
    console.error('Failed to add section:', error);
    return { success: false, error: 'No se pudo crear la sección.' };
  } finally {
    await client.end();
  }
}

export async function deleteSection(id) {
  const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL });
  await client.connect();
  try {
    const { rows: secRows } = await client.sql`SELECT slug FROM sections WHERE id = ${id}`;
    if (secRows.length === 0) return { success: false, error: 'La sección no existe.' };
    const slug = secRows[0].slug;
    const { rows: cntRows } = await client.sql`SELECT COUNT(*)::int AS count FROM equipment WHERE category = ${slug}`;
    if (cntRows[0].count > 0) return { success: false, error: 'Solo puedes eliminar secciones vacías.' };
    await client.sql`DELETE FROM sections WHERE id = ${id}`;
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete section:', error);
    return { success: false, error: 'No se pudo eliminar la sección.' };
  } finally {
    await client.end();
  }
}

export async function reorderSections(orderedIds) {
  const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL });
  await client.connect();
  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await client.sql`UPDATE sections SET position = ${i} WHERE id = ${orderedIds[i]}`;
    }
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to reorder sections:', error);
    return { success: false, error: 'No se pudo reordenar.' };
  } finally {
    await client.end();
  }
}

export async function updateSection(id, { title, icon_name }) {
  const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL });
  await client.connect();
  try {
    const displayTitle = title.trim();
    if (!displayTitle) return { success: false, error: 'Título inválido.' };
    const { rows } = await client.sql`
      UPDATE sections
      SET title = ${displayTitle}, icon_name = ${icon_name}
      WHERE id = ${id}
      RETURNING *;
    `;
    revalidatePath('/');
    return { success: true, section: rows[0] };
  } catch (error) {
    console.error('Failed to update section:', error);
    return { success: false, error: 'No se pudo actualizar la sección.' };
  } finally {
    await client.end();
  }
}

export async function reorderEquipment(orderedIds) {
  const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL });
  await client.connect();
  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await client.sql`UPDATE equipment SET position = ${i} WHERE id = ${orderedIds[i]}`;
    }
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to reorder equipment:', error);
    return { success: false, error: 'No se pudo reordenar el equipo.' };
  } finally {
    await client.end();
  }
}
