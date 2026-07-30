'use client';

import { useMemo, useState } from 'react';
import {
  CalendarClock,
  Check,
  CircleDollarSign,
  GitCompareArrows,
  Plus,
  Target,
  X,
} from 'lucide-react';
import {
  formatMoney,
  normalizeEquipmentItem,
  normalizeProfile,
  PRIORITIES,
} from '@/lib/setupData';

const PRIORITY_STYLES = {
  1: 'border-red-500/30 bg-red-500/10 text-red-400',
  2: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  3: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
};

const PRIORITY_LABEL = {
  1: 'alta',
  2: 'media',
  3: 'baja',
};

export default function UpgradePlanner({
  items,
  profile,
  isEditorMode,
  isPending,
  onEdit,
  onAdd,
  onSaveProfile,
}) {
  const normalizedProfile = normalizeProfile(profile);
  const wishlist = useMemo(
    () =>
      items
        .map(normalizeEquipmentItem)
        .filter(item => item.status === 'wishlist')
        .sort((left, right) => {
          if (left.wishlist_priority !== right.wishlist_priority) {
            return left.wishlist_priority - right.wishlist_priority;
          }
          if (left.planned_for && right.planned_for) {
            return left.planned_for.localeCompare(right.planned_for);
          }
          return left.roadmap_position - right.roadmap_position;
        }),
    [items]
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState(normalizedProfile.wishlist_budget);
  const displayPrices = normalizedProfile.show_prices || isEditorMode;

  const plannedTotal = wishlist
    .filter(item => item.currency === normalizedProfile.default_currency)
    .reduce((total, item) => total + Number(item.target_price || 0), 0);
  const budget = Number(normalizedProfile.wishlist_budget || 0);
  const budgetProgress = budget > 0 ? Math.min(100, (plannedTotal / budget) * 100) : 0;
  const remaining = budget - plannedTotal;
  const selectedItems = wishlist.filter(item => selectedIds.includes(item.id));

  const toggleComparison = id => {
    setSelectedIds(previous => {
      if (previous.includes(id)) return previous.filter(itemId => itemId !== id);
      if (previous.length >= 3) return [...previous.slice(1), id];
      return [...previous, id];
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <section className="grid gap-4 sm:gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-brand/25 bg-panel p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                upgrade planner
              </p>
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                roadmap de mejoras
              </h1>
              <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-gray-400">
                Prioriza compras, valida compatibilidad y compara alternativas
                antes de incorporarlas al setup.
              </p>
            </div>
            {isEditorMode && (
              <button
                type="button"
                onClick={onAdd}
                className="flex min-h-11 items-center gap-2 rounded-lg bg-brand px-4 text-xs font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                nuevo upgrade
              </button>
            )}
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-gray-400">planificado</span>
              <span className={remaining >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {!displayPrices
                  ? 'costes privados'
                  : budget > 0
                  ? `${formatMoney(plannedTotal, normalizedProfile.default_currency)} / ${formatMoney(budget, normalizedProfile.default_currency)}`
                  : formatMoney(plannedTotal, normalizedProfile.default_currency)}
              </span>
            </div>
            <div className="mt-3 h-3.5 overflow-hidden rounded-lg bg-black">
              <div
                className={`h-full rounded-lg transition-all ${
                  remaining >= 0 ? 'bg-brand' : 'bg-red-500'
                }`}
                style={{ width: `${displayPrices && budget > 0 ? budgetProgress : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-line bg-panel p-6 sm:p-7">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  presupuesto
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {displayPrices
                    ? formatMoney(budget, normalizedProfile.default_currency)
                    : 'privado'}
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand sm:h-12 sm:w-12">
                <CircleDollarSign className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
            </div>

            {displayPrices && budget > 0 && (
              <div className="mt-6 border-t border-line/60 pt-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      planificado
                    </p>
                    <p className="mt-1.5 text-base font-semibold text-gray-200 sm:text-lg">
                      {formatMoney(plannedTotal, normalizedProfile.default_currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      {remaining >= 0 ? 'disponible' : 'excedido'}
                    </p>
                    <p
                      className={`mt-1.5 text-base font-semibold sm:text-lg ${
                        remaining >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {formatMoney(Math.abs(remaining), normalizedProfile.default_currency)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isEditorMode && (
            <div className="mt-6 pt-2">
              {editingBudget ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={budgetDraft}
                    onChange={event => setBudgetDraft(event.target.value)}
                    className="min-h-11 min-w-0 flex-1 rounded-lg border border-line bg-black px-3 text-xs text-white outline-none focus:border-brand"
                    aria-label="Presupuesto de wishlist"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const success = await onSaveProfile({
                        ...normalizedProfile,
                        wishlist_budget: budgetDraft,
                      });
                      if (success) setEditingBudget(false);
                    }}
                    disabled={isPending}
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand text-white disabled:opacity-40"
                    aria-label="Guardar presupuesto"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBudget(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-line text-gray-400"
                    aria-label="Cancelar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setBudgetDraft(budget);
                    setEditingBudget(true);
                  }}
                  className="min-h-11 w-full rounded-lg border border-line bg-black/40 text-xs font-semibold text-gray-300 transition-colors hover:border-brand hover:bg-brand/10 hover:text-brand"
                >
                  ajustar presupuesto
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white">prioridades</h2>
            <p className="mt-1 text-xs text-gray-400">
              selecciona hasta tres elementos para compararlos
            </p>
          </div>
          <span className="text-xs text-gray-400">
            {wishlist.length} upgrades
          </span>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {wishlist.map((item, index) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <article
                  key={item.id}
                  className={`relative flex min-h-64 flex-col rounded-lg border bg-panel p-5 transition-colors ${
                    isSelected ? 'border-brand' : 'border-line hover:border-brand/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                        <i className={item.icon_name || 'fa-solid fa-box'} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs uppercase text-gray-400">
                          paso {String(index + 1).padStart(2, '0')} · {item.category}
                        </p>
                        <h3 className="mt-1 text-sm font-bold text-white">
                          {item.brand} {item.model || item.type}
                        </h3>
                      </div>
                    </div>
                    <span
                      className={`rounded-lg border px-2.5 py-1 text-xs font-bold uppercase ${
                        PRIORITY_STYLES[item.wishlist_priority]
                      }`}
                    >
                      {PRIORITY_LABEL[item.wishlist_priority]}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 border-y border-line py-4">
                    <div>
                      <p className="text-xs uppercase text-gray-400">objetivo</p>
                      <p className="mt-1 text-xs font-bold text-white">
                        {displayPrices
                          ? formatMoney(item.target_price, item.currency)
                          : 'privado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-400">fecha</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-300">
                        <CalendarClock className="h-3.5 w-3.5 text-brand" />
                        {item.planned_for || 'por definir'}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 flex-1 font-sans text-xs leading-relaxed text-gray-300">
                    {item.compatibility_notes || 'Compatibilidad pendiente de documentar.'}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleComparison(item.id)}
                      className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border text-xs transition-colors ${
                        isSelected
                          ? 'border-brand bg-brand/10 text-brand'
                          : 'border-line text-gray-400 hover:border-brand'
                      }`}
                    >
                      <GitCompareArrows className="h-3.5 w-3.5" />
                      {isSelected ? 'seleccionado' : 'comparar'}
                    </button>
                    {isEditorMode && (
                      <button
                        type="button"
                        onClick={() => onEdit(item.category, item)}
                        className="min-h-10 rounded-lg bg-white px-3 text-xs font-bold text-black"
                      >
                        editar
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-line bg-panel/50 text-center">
            <Target className="h-6 w-6 text-gray-500" />
            <p className="mt-3 text-xs text-gray-400">roadmap vacío</p>
            <p className="mt-1 text-xs text-gray-400">
              cambia un elemento a wishlist o crea tu primer upgrade
            </p>
          </div>
        )}
      </section>

      {selectedItems.length > 0 && (
        <section className="overflow-hidden rounded-lg border border-brand/30 bg-panel">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2">
              <GitCompareArrows className="h-4 w-4 text-brand" />
              <h2 className="text-sm font-bold text-white">
                Comparador ({selectedItems.length}/3)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-gray-400 hover:text-white"
            >
              limpiar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-xs">
              <thead className="bg-black text-xs uppercase text-gray-400">
                <tr>
                  <th className="px-4 py-3">opción</th>
                  <th className="px-4 py-3">prioridad</th>
                  <th className="px-4 py-3">precio</th>
                  <th className="px-4 py-3">fecha</th>
                  <th className="px-4 py-3">compatibilidad</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map(item => (
                  <tr key={item.id} className="border-t border-line text-gray-300">
                    <td className="px-4 py-4 font-bold text-white">
                      {item.brand} {item.model || item.type}
                    </td>
                    <td className="px-4 py-4">
                      {PRIORITIES.find(option => option.value === item.wishlist_priority)?.label}
                    </td>
                    <td className="px-4 py-4">
                      {displayPrices
                        ? formatMoney(item.target_price, item.currency)
                        : 'privado'}
                    </td>
                    <td className="px-4 py-4">{item.planned_for || '—'}</td>
                    <td className="max-w-xs px-4 py-4 font-sans text-xs leading-relaxed text-gray-300">
                      {item.compatibility_notes || 'Pendiente'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
