'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Layers3,
  Pencil,
  Plus,
  Route,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import DatePicker from '@/components/ui/DatePicker';
import {
  formatMoney,
  normalizeEquipmentItem,
  normalizeEvent,
  normalizeProfile,
} from '@/lib/setupData';

const EVENT_TYPE_OPTIONS = [
  { value: 'note', label: 'nota' },
  { value: 'purchased', label: 'compra' },
  { value: 'upgraded', label: 'upgrade' },
  { value: 'planned', label: 'plan' },
];

const fieldClass =
  'min-h-11 w-full rounded-lg border border-line-strong bg-black px-3 text-sm text-white outline-none focus:border-brand';
const OVERVIEW_RENDER_DATE = Date.now();
const WARRANTY_LIMIT =
  OVERVIEW_RENDER_DATE + 1000 * 60 * 60 * 24 * 180;

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="rounded-lg border border-line bg-panel p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {label}
        </span>
        <Icon className="h-4 w-4 text-brand" />
      </div>
      <p className="mt-4 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{detail}</p>
    </article>
  );
}

export default function SetupOverview({
  items,
  sections,
  profile,
  events,
  isEditorMode,
  isPending,
  onOpenSection,
  onSaveProfile,
  onAddEvent,
  onDeleteEvent,
  preview,
  guideProgress,
  onOpenGuide,
}) {
  const normalizedProfile = normalizeProfile(profile);
  const normalizedItems = useMemo(
    () => items.map(normalizeEquipmentItem),
    [items]
  );
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(normalizedProfile);
  const [addingEvent, setAddingEvent] = useState(false);
  const [eventDraft, setEventDraft] = useState({
    event_type: 'note',
    title: '',
    description: '',
    occurred_on: new Date().toISOString().slice(0, 10),
    amount: '',
    currency: normalizedProfile.default_currency,
    is_public: true,
  });
  const displayPrices = normalizedProfile.show_prices || isEditorMode;
  const guideCompleted = Object.values(guideProgress || {}).filter(Boolean).length;

  const activeItems = normalizedItems.filter(item => item.status === 'active');
  const wishlistItems = normalizedItems.filter(item => item.status === 'wishlist');
  const softwareCount = activeItems.filter(item => item.item_kind === 'software').length;
  const activeInvestment = activeItems
    .filter(item => item.currency === normalizedProfile.default_currency)
    .reduce((total, item) => total + Number(item.purchase_price || 0), 0);
  const wishlistInvestment = wishlistItems
    .filter(item => item.currency === normalizedProfile.default_currency)
    .reduce((total, item) => total + Number(item.target_price || 0), 0);
  const warrantyAlerts = activeItems
    .filter(item => {
      const date = new Date(item.warranty_until).getTime();
      return (
        item.warranty_until &&
        date >= OVERVIEW_RENDER_DATE &&
        date <= WARRANTY_LIMIT
      );
    })
    .sort((a, b) => a.warranty_until.localeCompare(b.warranty_until));

  const sortedEvents = events
    .map(normalizeEvent)
    .sort((a, b) => String(b.occurred_on).localeCompare(String(a.occurred_on)));

  const startProfileEdit = () => {
    setProfileDraft(normalizedProfile);
    setEditingProfile(true);
  };

  const submitEvent = async () => {
    if (!eventDraft.title.trim()) return;
    const success = await onAddEvent(eventDraft);
    if (success) {
      setAddingEvent(false);
      setEventDraft(previous => ({
        ...previous,
        title: '',
        description: '',
        amount: '',
      }));
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <section
        onClick={isEditorMode && !editingProfile ? startProfileEdit : undefined}
        onKeyDown={
          isEditorMode && !editingProfile
            ? event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  startProfileEdit();
                }
              }
            : undefined
        }
        role={isEditorMode && !editingProfile ? 'button' : undefined}
        tabIndex={isEditorMode && !editingProfile ? 0 : undefined}
        aria-label={
          isEditorMode && !editingProfile ? 'Editar presentación del setup' : undefined
        }
        className={`relative overflow-hidden rounded-lg border bg-panel p-6 sm:p-8 transition-colors ${
          isEditorMode && !editingProfile
            ? 'group/card cursor-pointer border-brand/40 hover:border-brand'
            : 'border-brand/25'
        }`}
      >
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
        <div
          className={`relative ${
            preview && !editingProfile ? 'lg:min-h-[205px] lg:pr-[22rem]' : ''
          }`}
        >
          <div className="flex h-6 items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
              setup profile
            </p>
            {isEditorMode && !editingProfile && (
              <span className="flex h-5 items-center gap-1.5 rounded-lg border border-brand/30 bg-brand/10 px-2.5 text-xs font-bold uppercase tracking-wider text-brand transition-colors group-hover/card:bg-brand group-hover/card:text-white">
                <Pencil className="h-3 w-3" />
                editar
              </span>
            )}
          </div>
          {editingProfile ? (
            <div className="mt-5 grid gap-3">
              <input
                value={profileDraft.title}
                onChange={event =>
                  setProfileDraft(previous => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
                className={fieldClass}
                aria-label="Nombre del setup"
              />
              <input
                value={profileDraft.tagline || ''}
                onChange={event =>
                  setProfileDraft(previous => ({
                    ...previous,
                    tagline: event.target.value,
                  }))
                }
                className={fieldClass}
                aria-label="Frase del setup"
              />
              <textarea
                value={profileDraft.description || ''}
                onChange={event =>
                  setProfileDraft(previous => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                className={`${fieldClass} min-h-24 py-3 font-sans`}
                aria-label="Descripción del setup"
              />
              <label className="flex min-h-11 items-center gap-3 rounded-lg border border-line px-3 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={profileDraft.show_prices !== false}
                  onChange={event =>
                    setProfileDraft(previous => ({
                      ...previous,
                      show_prices: event.target.checked,
                    }))
                  }
                />
                mostrar precios en el inventario
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="min-h-11 rounded-lg border border-line px-4 text-xs text-gray-300"
                >
                  cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const success = await onSaveProfile(profileDraft);
                    if (success) setEditingProfile(false);
                  }}
                  disabled={isPending || !profileDraft.title.trim()}
                  className="min-h-11 rounded-lg bg-brand px-4 text-xs font-bold text-white disabled:opacity-40"
                >
                  guardar presentación
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-4">
                <h1 className="brand-title text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  {normalizedProfile.title}
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:text-lg">
                  {normalizedProfile.tagline}
                </p>
              </div>
              <p className="mt-5 font-sans text-sm leading-relaxed text-gray-400">
                {normalizedProfile.description}
              </p>
              {preview && (
                <span className="mt-5 inline-flex rounded-lg border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                  sandbox local · no guarda datos reales
                </span>
              )}
            </>
          )}

          {preview && !editingProfile && (
            <button
              type="button"
              onClick={event => {
                event.stopPropagation();
                onOpenGuide();
              }}
              className="group relative mt-6 w-full overflow-hidden rounded-lg border border-brand/35 bg-black/65 p-4 text-left transition-colors hover:border-brand hover:bg-brand/10 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:flex lg:w-80"
              aria-label="Abrir modo guiado de la preview"
            >
              <div className="pointer-events-none absolute -right-8 -top-9 h-28 w-28 rounded-full bg-brand/25 blur-2xl transition-transform duration-500 group-hover:scale-125" />
              <div className="relative lg:flex lg:flex-1 lg:flex-col">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand/40 bg-brand/15 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Route className="h-5 w-5" />
                  </span>
                  <span className="rounded-lg border border-line bg-black/60 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                    preview
                  </span>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-brand">
                  empieza aqui
                </p>
                <h2 className="mt-1 text-base font-bold text-white">modo guiado</h2>
                <p className="mt-2 font-sans text-xs leading-relaxed text-gray-400">
                  Recorre la demo, edita el setup y prueba cada herramienta sin tocar datos reales.
                </p>
                <div className="mt-3 flex items-center justify-between text-xs font-bold lg:mt-auto">
                  <span className="text-gray-400">
                    {guideCompleted}/4 retos completados
                  </span>
                  <span className="flex items-center gap-1 text-brand transition-transform group-hover:translate-x-0.5">
                    explorar <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        <MetricCard
          icon={Activity}
          label="activos"
          value={activeItems.length}
          detail={`${sections.length} secciones`}
        />
        <MetricCard
          icon={CircleDollarSign}
          label="inversión conocida"
          value={
            displayPrices
              ? formatMoney(activeInvestment, normalizedProfile.default_currency)
              : 'privada'
          }
          detail={`en ${normalizedProfile.default_currency}`}
        />
        <MetricCard
          icon={Layers3}
          label="stack software"
          value={softwareCount}
          detail="herramientas registradas"
        />
        <MetricCard
          icon={CalendarDays}
          label="roadmap"
          value={wishlistItems.length}
          detail={
            displayPrices
              ? formatMoney(wishlistInvestment, normalizedProfile.default_currency)
              : 'upgrades planificados'
          }
        />
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">secciones</h2>
              <p className="mt-1 text-xs text-gray-400">
                distribución del setup activo
              </p>
            </div>
            <Layers3 className="h-4 w-4 text-brand" />
          </div>
          <div className="space-y-2">
            {sections.map(section => {
              const sectionItems = activeItems.filter(
                item => item.category === section.slug
              );
              const sectionTotal = sectionItems
                .filter(item => item.currency === normalizedProfile.default_currency)
                .reduce((total, item) => total + Number(item.purchase_price || 0), 0);
              return (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => onOpenSection(section.slug)}
                  className="flex min-h-14 w-full items-center gap-3 rounded-lg border border-line bg-black px-3 text-left transition-colors hover:border-brand/60"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <i className={section.icon_name || 'fa-solid fa-folder'} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold lowercase text-white">
                      {section.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {sectionItems.length} elementos
                      {displayPrices && sectionTotal > 0
                        ? ` · ${formatMoney(sectionTotal, normalizedProfile.default_currency)}`
                        : ''}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">garantías</h2>
              <p className="mt-1 text-xs text-gray-400">
                vencimientos durante los próximos seis meses
              </p>
            </div>
            <ShieldCheck className="h-4 w-4 text-brand" />
          </div>
          {warrantyAlerts.length > 0 ? (
            <div className="space-y-2">
              {warrantyAlerts.map(item => (
                <div
                  key={item.id}
                  className="flex min-h-14 items-center justify-between gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3"
                >
                  <div>
                    <p className="text-xs font-bold text-white">
                      {item.brand} {item.model}
                    </p>
                    <p className="mt-1 text-xs text-amber-400">
                      vence {item.warranty_until}
                    </p>
                  </div>
                  <span className="text-xs uppercase text-gray-400">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-36 items-center justify-center rounded-lg border border-dashed border-line text-center text-xs text-gray-400">
              sin vencimientos próximos
            </div>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-panel p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white">evolución del setup</h2>
            <p className="mt-1 text-xs text-gray-400">
              adquisiciones, decisiones y próximos hitos
            </p>
          </div>
          {isEditorMode && (
            <button
              type="button"
              onClick={() => setAddingEvent(previous => !previous)}
              className="flex min-h-10 items-center gap-2 rounded-lg border border-brand/40 px-3 text-xs text-brand"
            >
              <Plus className="h-3.5 w-3.5" />
              evento
            </button>
          )}
        </div>

        {addingEvent && (
          <div className="mb-5 grid gap-3 rounded-lg border border-brand/25 bg-brand/5 p-4 sm:grid-cols-2">
            <input
              value={eventDraft.title}
              onChange={event =>
                setEventDraft(previous => ({ ...previous, title: event.target.value }))
              }
              placeholder="Título del hito"
              className={fieldClass}
            />
            <DatePicker
              value={eventDraft.occurred_on}
              onChange={val =>
                setEventDraft(previous => ({
                  ...previous,
                  occurred_on: val,
                }))
              }
              ariaLabel="Fecha del evento"
            />
            <CustomSelect
              options={EVENT_TYPE_OPTIONS}
              value={eventDraft.event_type}
              onChange={val =>
                setEventDraft(previous => ({
                  ...previous,
                  event_type: val,
                }))
              }
              ariaLabel="Tipo de hito"
            />
            <input
              type="number"
              min="0"
              value={eventDraft.amount}
              onChange={event =>
                setEventDraft(previous => ({ ...previous, amount: event.target.value }))
              }
              placeholder="Importe opcional"
              className={fieldClass}
            />
            <textarea
              value={eventDraft.description}
              onChange={event =>
                setEventDraft(previous => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
              placeholder="Qué cambió y por qué"
              className={`${fieldClass} min-h-20 py-3 font-sans sm:col-span-2`}
            />
            <div className="flex gap-2 sm:col-span-2">
              <button
                type="button"
                onClick={() => setAddingEvent(false)}
                className="min-h-10 rounded-lg border border-line px-3 text-xs text-gray-300"
              >
                cancelar
              </button>
              <button
                type="button"
                onClick={submitEvent}
                disabled={isPending || !eventDraft.title.trim()}
                className="min-h-10 rounded-lg bg-brand px-3 text-xs font-bold text-white disabled:opacity-40"
              >
                añadir al timeline
              </button>
            </div>
          </div>
        )}

        <div className="relative space-y-1 before:absolute before:bottom-4 before:left-[5px] before:top-4 before:w-px before:bg-line">
          {sortedEvents.length > 0 ? (
            sortedEvents.slice(0, 10).map(event => (
              <article
                key={event.id}
                className="relative flex gap-4 rounded-lg px-0 py-3 pl-6"
              >
                <span className="absolute left-0 top-5 h-[11px] w-[11px] rounded-full border-2 border-brand bg-black" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-xs font-bold text-white">{event.title}</h3>
                    <time className="text-xs text-gray-400">
                      {event.occurred_on}
                    </time>
                  </div>
                  {event.description && (
                    <p className="mt-1 font-sans text-xs leading-relaxed text-gray-300">
                      {event.description}
                    </p>
                  )}
                  {displayPrices && event.amount !== null && (
                    <p className="mt-1 text-xs text-brand font-semibold">
                      {formatMoney(event.amount, event.currency)}
                    </p>
                  )}
                </div>
                {isEditorMode && (
                  <button
                    type="button"
                    onClick={() => onDeleteEvent(event.id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    aria-label={`Eliminar evento ${event.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </article>
            ))
          ) : (
            <p className="py-8 text-center text-xs text-gray-400">
              el timeline comenzará con tu próximo cambio
            </p>
          )}
        </div>
      </section>

    </div>
  );
}
