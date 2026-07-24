'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Save, Trash2, X } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import DatePicker from '@/components/ui/DatePicker';
import {
  ITEM_KINDS,
  ITEM_STATUS,
  PRIORITIES,
  parseListInput,
} from '@/lib/setupData';

const fieldClass =
  'w-full rounded-lg border border-line-strong bg-black px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-brand';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400';

export default function EquipmentEditor({
  editingItem,
  sections,
  isPending,
  onCancel,
  onSave,
  onDelete,
}) {
  const [draft, setDraft] = useState(editingItem?.draft || null);
  const cancelRef = useRef(onCancel);
  const pendingRef = useRef(isPending);
  const isOpen = Boolean(editingItem);

  useEffect(() => {
    cancelRef.current = onCancel;
    pendingRef.current = isPending;
  }, [onCancel, isPending]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = event => {
      if (event.key === 'Escape' && !pendingRef.current) cancelRef.current();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!editingItem || !draft) return null;
  const isWishlist = draft.status === 'wishlist';

  const updateDraft = (field, value) => {
    setDraft(previous => ({ ...previous, [field]: value }));
  };

  const setArrayField = (field, value) => {
    updateDraft(field, parseListInput(value));
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        aria-label="Cerrar editor"
        className="absolute inset-0 cursor-default bg-black/80 animate-fade-in"
        onClick={() => !isPending && onCancel()}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="equipment-editor-title"
        tabIndex={-1}
        className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-line-strong bg-panel shadow-[-12px_0_32px_rgba(0,0,0,0.45)] animate-slide-in"
      >
        <header className="flex min-h-20 items-center justify-between gap-4 border-b border-line px-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
              {editingItem.isNew ? 'nuevo elemento' : 'editar elemento'}
            </p>
            <h2 id="equipment-editor-title" className="truncate text-lg font-bold lowercase text-white">
              {draft.type || 'sin nombre'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line text-gray-400 transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-7 overflow-y-auto px-4 py-6 sm:px-6">
          <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <legend className="col-span-full mb-3 text-xs font-bold text-white">
              identidad
            </legend>

            <label>
              <span className={labelClass}>tipo *</span>
              <input
                autoFocus
                value={draft.type || ''}
                onChange={event => updateDraft('type', event.target.value)}
                placeholder="monitor, editor de código..."
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>sección</span>
              <CustomSelect
                options={sections.map(section => ({
                  value: section.slug,
                  label: section.title,
                }))}
                value={draft.category}
                onChange={value => updateDraft('category', value)}
                label="sección"
              />
            </label>
            <label>
              <span className={labelClass}>marca</span>
              <input
                value={draft.brand || ''}
                onChange={event => updateDraft('brand', event.target.value)}
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>modelo</span>
              <input
                value={draft.model || ''}
                onChange={event => updateDraft('model', event.target.value)}
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>clase</span>
              <CustomSelect
                options={ITEM_KINDS}
                value={draft.item_kind}
                onChange={value => updateDraft('item_kind', value)}
                label="clase"
              />
            </label>
            <label>
              <span className={labelClass}>estado</span>
              <CustomSelect
                options={ITEM_STATUS}
                value={draft.status}
                onChange={value => updateDraft('status', value)}
                label="estado"
              />
            </label>
            <label className="sm:col-span-2">
              <span className={labelClass}>etiquetas</span>
              <input
                value={(draft.tags || []).join(', ')}
                onChange={event => setArrayField('tags', event.target.value)}
                placeholder="diseño, audio, productividad"
                className={fieldClass}
              />
            </label>
            <label className="sm:col-span-2">
              <span className={labelClass}>descripción</span>
              <textarea
                value={draft.description || ''}
                onChange={event => updateDraft('description', event.target.value)}
                className={`${fieldClass} min-h-24 resize-y font-sans`}
              />
            </label>
          </fieldset>

          <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <legend className="col-span-full mb-3 text-xs font-bold text-white">
              {isWishlist ? 'plan de upgrade' : 'compra y ciclo de vida'}
            </legend>

            {isWishlist ? (
              <>
                <label>
                  <span className={labelClass}>precio objetivo</span>
                  <input
                    type="number"
                    min="0"
                    value={draft.target_price ?? ''}
                    onChange={event => updateDraft('target_price', event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label>
                  <span className={labelClass}>prioridad</span>
                  <CustomSelect
                    options={PRIORITIES}
                    value={draft.wishlist_priority}
                    onChange={value => updateDraft('wishlist_priority', Number(value))}
                    label="prioridad"
                  />
                </label>
                <label>
                  <span className={labelClass}>fecha objetivo</span>
                  <DatePicker
                    value={draft.planned_for || ''}
                    onChange={val => updateDraft('planned_for', val)}
                    ariaLabel="fecha objetivo"
                  />
                </label>
                <label>
                  <span className={labelClass}>moneda</span>
                  <input
                    maxLength={3}
                    value={draft.currency || ''}
                    onChange={event => updateDraft('currency', event.target.value.toUpperCase())}
                    className={fieldClass}
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>compatibilidad y dependencias</span>
                  <textarea
                    value={draft.compatibility_notes || ''}
                    onChange={event =>
                      updateDraft('compatibility_notes', event.target.value)
                    }
                    placeholder="Qué reemplaza, requisitos, dudas por validar..."
                    className={`${fieldClass} min-h-24 resize-y font-sans`}
                  />
                </label>
              </>
            ) : (
              <>
                <label>
                  <span className={labelClass}>precio de compra</span>
                  <input
                    type="number"
                    min="0"
                    value={draft.purchase_price ?? ''}
                    onChange={event => updateDraft('purchase_price', event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label>
                  <span className={labelClass}>moneda</span>
                  <input
                    maxLength={3}
                    value={draft.currency || ''}
                    onChange={event => updateDraft('currency', event.target.value.toUpperCase())}
                    className={fieldClass}
                  />
                </label>
                <label>
                  <span className={labelClass}>fecha de compra</span>
                  <DatePicker
                    value={draft.purchase_date || ''}
                    onChange={val => updateDraft('purchase_date', val)}
                    ariaLabel="fecha de compra"
                  />
                </label>
                <label>
                  <span className={labelClass}>garantía hasta</span>
                  <DatePicker
                    value={draft.warranty_until || ''}
                    onChange={val => updateDraft('warranty_until', val)}
                    ariaLabel="garantía hasta"
                  />
                </label>
              </>
            )}
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-xs font-bold text-white">
              notas privadas
            </legend>
            <textarea
              value={draft.private_notes || ''}
              onChange={event => updateDraft('private_notes', event.target.value)}
              placeholder="Seriales, mantenimiento, recordatorios internos..."
              className={`${fieldClass} min-h-28 resize-y border-amber-500/30 font-sans focus:border-amber-400`}
            />
            <p className="mt-2 text-xs leading-relaxed text-gray-400">
              Solo se cargan después de abrir una sesión de editor.
            </p>
          </fieldset>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-line bg-black/80 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="flex min-h-11 items-center gap-2 rounded-lg border border-red-500/30 px-3 text-xs text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">eliminar</span>
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="min-h-11 rounded-lg border border-line px-4 text-xs text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50"
            >
              cancelar
            </button>
            <button
              type="button"
              onClick={() => onSave(draft)}
              disabled={isPending || !String(draft.type || '').trim()}
              className="flex min-h-11 items-center gap-2 rounded-lg bg-brand px-4 text-xs font-bold text-white transition-opacity hover:opacity-85 disabled:opacity-40"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              guardar
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
