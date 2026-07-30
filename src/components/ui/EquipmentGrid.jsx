'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, GripVertical, Inbox } from 'lucide-react';
import EquipmentCard from '@/components/ui/EquipmentCard';

export default function EquipmentGrid({
  activeItems,
  isEditorMode,
  startEditing,
  handleReorderItems,
  isPending,
  showPrices,
  canReorder = true,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const moveItem = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= activeItems.length) return;
    const orderedIds = activeItems.map(item => item.id);
    const [moved] = orderedIds.splice(index, 1);
    orderedIds.splice(target, 0, moved);
    handleReorderItems(orderedIds);
  };

  const handleDrop = (event, targetIndex) => {
    if (!isEditorMode || !canReorder || draggedIndex === null) return;
    event.preventDefault();
    setDragOverIndex(null);
    if (draggedIndex !== targetIndex) {
      const orderedIds = activeItems.map(item => item.id);
      const [moved] = orderedIds.splice(draggedIndex, 1);
      orderedIds.splice(targetIndex, 0, moved);
      handleReorderItems(orderedIds);
    }
    setDraggedIndex(null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {activeItems.map((item, index) => (
          <div
            key={item.id}
            draggable={isEditorMode && canReorder && !isPending}
            onDragStart={event => {
              if (!isEditorMode || !canReorder || isPending) return;
              setDraggedIndex(index);
              event.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={event => {
              if (!isEditorMode || !canReorder || isPending) return;
              event.preventDefault();
              setDragOverIndex(index);
            }}
            onDrop={event => handleDrop(event, index)}
            onDragEnd={() => {
              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
            className={`group/reorder relative h-full rounded-lg ${
              draggedIndex === index ? 'opacity-60' : ''
            } ${
              dragOverIndex === index && draggedIndex !== index
                ? 'ring-2 ring-brand ring-offset-2 ring-offset-black'
                : ''
            }`}
          >
            {isEditorMode && canReorder && (
              <div className="absolute right-4 bottom-4 z-10 flex h-9 items-center gap-1 rounded-lg border border-line bg-black/90 px-1 opacity-100 sm:bottom-5 sm:right-5 sm:opacity-0 sm:transition-opacity sm:group-hover/reorder:opacity-100 sm:group-focus-within/reorder:opacity-100">
                <GripVertical className="mx-0.5 h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation();
                    moveItem(index, -1);
                  }}
                  disabled={index === 0 || isPending}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-25"
                  aria-label={`Mover ${item.type} antes`}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation();
                    moveItem(index, 1);
                  }}
                  disabled={index === activeItems.length - 1 || isPending}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-25"
                  aria-label={`Mover ${item.type} después`}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <EquipmentCard
              item={item}
              isEditorMode={isEditorMode}
              startEditing={startEditing}
              showPrices={showPrices}
            />
          </div>
        ))}

        {activeItems.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-surface/40 py-20 text-gray-500 animate-fade-in">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-line text-gray-400">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="text-xs text-gray-400">/sin_resultados</p>
            <p className="text-xs text-gray-400">
              ajusta los filtros o crea un nuevo elemento
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
