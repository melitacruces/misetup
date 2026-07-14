import React from 'react';
import { Trash2, X, Check, Loader2 } from 'lucide-react';

export default function EquipmentCard({
  item,
  index = 0,
  isEditing,
  isEditorMode,
  editingItem,
  startEditing,
  cancelEditing,
  saveEditing,
  handleDeleteItem,
  handleDraftChange,
  activeTab,
  isPending
}) {

  const renderFeaturesList = (descText) => {
    if (!descText) return null;
    const features = descText.replace(/\.+$/, '').split(/\.\s+|\n+/).map(str => str.trim()).filter(str => str.length > 0);
    return (
      <ul className="list-disc list-outside ml-4 flex flex-col gap-1.5 marker:text-brand">
        {features.map((feature, index) => (
          <li key={index} className="text-[11px] sm:text-xs text-gray-300 leading-snug font-sans">
            {feature}.
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      onClick={() => {
        if (isEditorMode && !isEditing) startEditing(activeTab, item);
      }}
      className={`relative flex flex-col rounded-md transition-all duration-300 group h-full
        ${isEditing
          ? 'bg-surface border border-brand shadow-[0_0_30px_-8px_rgba(157,0,255,0.5)]'
          : `bg-black border border-white/10 text-white hover:border-brand hover:shadow-[0_0_28px_-6px_rgba(157,0,255,0.45)] ${isEditorMode ? 'cursor-pointer' : ''}`}
      `}
    >
      {isEditing ? (
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-line">
            <span className="text-xs text-brand font-bold truncate mr-2">{"editing"}</span>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}
                disabled={isPending}
                className="p-1.5 bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 rounded transition-colors flex items-center justify-center cursor-pointer"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); cancelEditing(); }}
                disabled={isPending}
                className="p-1.5 bg-white text-black hover:bg-gray-200 disabled:opacity-50 rounded transition-colors flex items-center justify-center cursor-pointer"
                title="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); saveEditing(); }}
                disabled={isPending}
                className="p-1.5 bg-brand text-white hover:bg-brand/80 disabled:opacity-50 rounded transition-colors flex items-center justify-center cursor-pointer"
                title="Guardar"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500">type</label>
              <input
                value={editingItem.draft.type}
                onChange={(e) => handleDraftChange('type', e.target.value)}
                className="bg-black border border-line-strong rounded px-2 py-1.5 text-xs outline-none focus:border-brand transition-colors w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500">brand</label>
              <input
                value={editingItem.draft.brand}
                onChange={(e) => handleDraftChange('brand', e.target.value)}
                className="bg-black border border-line-strong rounded px-2 py-1.5 text-xs outline-none focus:border-brand transition-colors w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500">model</label>
              <input
                value={editingItem.draft.model}
                onChange={(e) => handleDraftChange('model', e.target.value)}
                className="bg-black border border-line-strong rounded px-2 py-1.5 text-xs outline-none focus:border-brand transition-colors w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500">oficial_url</label>
              <input
                value={editingItem.draft.website_url || ''}
                onChange={(e) => handleDraftChange('website_url', e.target.value)}
                className="bg-black border border-line-strong rounded px-2 py-1.5 text-xs outline-none focus:border-brand transition-colors w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500">icono (fontawesome)</label>
              <input
                value={editingItem.draft.icon_name || ''}
                onChange={(e) => handleDraftChange('icon_name', e.target.value)}
                className="bg-black border border-line-strong rounded px-2 py-1.5 text-xs outline-none focus:border-brand transition-colors w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500">features</label>
              <textarea
                value={editingItem.draft.description}
                onChange={(e) => handleDraftChange('description', e.target.value)}
                className="bg-black border border-line-strong rounded px-2 py-1.5 text-xs outline-none focus:border-brand transition-colors min-h-[80px] resize-none w-full font-sans"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 flex flex-col h-full relative">
          <div className="flex items-center gap-3 pb-4 border-b border-line">
            <div className="w-8 h-8 shrink-0 rounded-md bg-brand flex items-center justify-center text-white shadow-[0_0_14px_-2px_rgba(157,0,255,0.6)]">
              <i className={`${item.icon_name} text-[14px] leading-none`} />
            </div>
            <h3 className="text-sm sm:text-base font-bold tracking-tight text-brand lowercase flex items-center break-words m-0">
              {item.type.replace(/\s+/g, '_')}
            </h3>
            {item.website_url && (
              <a
                href={item.website_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="ms-auto p-1.5 sm:p-2 bg-transparent border border-brand text-brand hover:bg-brand hover:text-white rounded-md transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                title="Web"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-[12px] sm:text-[14px] leading-none" />
              </a>
            )}
          </div>

          <div className="flex flex-row gap-4 pt-4 flex-1">
            <div className="flex flex-col gap-4 w-1/2 shrink-0 pr-4 border-r border-line">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-bold uppercase">brand</span>
                <span className="text-sm font-bold text-white uppercase break-words">{item.brand}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-bold uppercase">model</span>
                <span className="text-sm font-bold text-gray-300 uppercase break-words">{item.model}</span>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              {renderFeaturesList(item.description)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
