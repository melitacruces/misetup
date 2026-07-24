import { useState } from 'react';
import {
  CalendarClock,
  EyeOff,
  FileText,
  ImageOff,
  Tag,
} from 'lucide-react';
import {
  formatMoney,
  isSafeExternalUrl,
  normalizeEquipmentItem,
} from '@/lib/setupData';

const STATUS_STYLES = {
  active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  wishlist: 'border-brand/40 bg-brand/10 text-brand',
};

const STATUS_LABELS = {
  active: 'activo',
  wishlist: 'wishlist',
};

const CARD_RENDER_DATE = Date.now();
const WARRANTY_ALERT_LIMIT = CARD_RENDER_DATE + 1000 * 60 * 60 * 24 * 90;

export default function EquipmentCard({
  item,
  isEditorMode,
  startEditing,
  showPrices = true,
}) {
  const [imgError, setImgError] = useState(false);
  const normalized = normalizeEquipmentItem(item);
  const displayPrice =
    normalized.status === 'wishlist'
      ? normalized.target_price
      : normalized.purchase_price;
  const primaryPhoto = (normalized.photo_urls || []).find(isSafeExternalUrl);
  const hasWarrantyAlert =
    normalized.warranty_until &&
    new Date(normalized.warranty_until).getTime() <
      WARRANTY_ALERT_LIMIT &&
    new Date(normalized.warranty_until).getTime() >= CARD_RENDER_DATE;

  const openEditor = () => {
    if (isEditorMode) startEditing(normalized.category, normalized);
  };

  return (
    <article
      onClick={openEditor}
      onKeyDown={event => {
        if (isEditorMode && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          openEditor();
        }
      }}
      role={isEditorMode ? 'button' : undefined}
      tabIndex={isEditorMode ? 0 : undefined}
      aria-label={isEditorMode ? `Editar ${normalized.type}` : undefined}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border bg-black text-white transition-colors ${
        isEditorMode
          ? 'cursor-pointer border-white/10 hover:border-brand focus-visible:border-brand'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start gap-3 border-b border-line pb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white shadow-[0_0_14px_-2px_rgba(157,0,255,0.6)]">
            <i className={`${normalized.icon_name || 'fa-solid fa-box'} text-sm`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-sm font-bold lowercase tracking-tight text-brand sm:text-base">
                {String(normalized.type || 'sin tipo').replace(/[_\s]+/g, ' ')}
              </h3>
              {normalized.is_public === false && isEditorMode && (
                <span title="Oculto para visitantes">
                  <EyeOff className="h-3.5 w-3.5 text-amber-400" />
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs uppercase text-gray-400">
              {normalized.item_kind}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {normalized.planned_for && (
              <span className="flex items-center gap-1.5 rounded-lg border border-brand/40 bg-brand/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                <CalendarClock className="h-3.5 w-3.5" />
                {normalized.planned_for}
              </span>
            )}
            {hasWarrantyAlert && (
              <span className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
                garantía por vencer
              </span>
            )}
            <span
              className={`rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                STATUS_STYLES[normalized.status] || STATUS_STYLES.active
              }`}
            >
              {STATUS_LABELS[normalized.status] || normalized.status}
            </span>
          </div>
        </div>

        <div className="py-4">
          <div className="flex items-start gap-4">
            {/* Contenedor de Imagen Cuadrada Permanente */}
            <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] shadow-md transition-colors group-hover:border-brand/40 sm:w-32">
              {primaryPhoto && !imgError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={primaryPhoto}
                  alt={`Vista de ${normalized.brand || normalized.type} ${normalized.model || ''}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center text-gray-500">
                  <ImageOff className="h-6 w-6 opacity-60" />
                  <span className="mt-1 text-[11px] font-medium tracking-tight text-gray-400">
                    sin imagen
                  </span>
                </div>
              )}
            </div>

            {/* Elementos de texto posicionados a la derecha */}
            <div className="min-w-0 flex-1 space-y-2.5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">marca</p>
                <p
                  className={`truncate text-sm font-bold uppercase ${
                    normalized.brand ? 'text-white' : 'font-normal italic text-gray-500 lowercase'
                  }`}
                >
                  {normalized.brand || 'vacío'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">modelo</p>
                <p
                  className={`truncate text-xs font-bold uppercase ${
                    normalized.model ? 'text-gray-300' : 'font-normal italic text-gray-500 lowercase'
                  }`}
                >
                  {normalized.model || 'vacío'}
                </p>
              </div>
              {showPrices && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {normalized.status === 'wishlist' ? 'objetivo' : 'inversión'}
                  </p>
                  <p
                    className={`text-sm font-bold ${
                      displayPrice !== null ? 'text-white' : 'font-normal italic text-gray-500 lowercase'
                    }`}
                  >
                    {displayPrice !== null
                      ? formatMoney(displayPrice, normalized.currency)
                      : 'vacío'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {normalized.description && (
          <p className="border-t border-line pt-3 font-sans text-xs leading-relaxed text-gray-400">
            {normalized.description}
          </p>
        )}

        <div className="mt-auto pt-3">
          {normalized.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag className="mr-0.5 h-3.5 w-3.5 text-gray-400" />
              {normalized.tags.slice(0, 4).map(tag => (
                <span
                  key={tag}
                  className="rounded-lg border border-line bg-white/[0.04] px-2 py-0.5 text-xs text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {(isSafeExternalUrl(normalized.website_url) ||
            normalized.manual_urls.some(isSafeExternalUrl)) && (
            <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
              {isSafeExternalUrl(normalized.website_url) && (
                <a
                  href={normalized.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={event => event.stopPropagation()}
                  className="flex min-h-9 items-center gap-2 rounded-lg border border-brand/40 px-2.5 text-xs text-brand hover:bg-brand/10"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                  sitio
                </a>
              )}
              {normalized.manual_urls.find(isSafeExternalUrl) && (
                <a
                  href={normalized.manual_urls.find(isSafeExternalUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={event => event.stopPropagation()}
                  className="flex min-h-9 items-center gap-2 rounded-lg border border-line px-2.5 text-xs text-gray-400 hover:border-brand hover:text-brand"
                >
                  <FileText className="h-3.5 w-3.5" />
                  manual
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
