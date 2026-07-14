import React, { useState } from 'react';
import { Inbox } from 'lucide-react';
import EquipmentCard from './EquipmentCard';

export default function EquipmentGrid({
  activeItems,
  editingItem,
  isEditorMode,
  startEditing,
  cancelEditing,
  saveEditing,
  handleDeleteItem,
  handleDraftChange,
  handleReorderItems,
  activeTab,
  isPending
}) {
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const handleDragStart = (e, index) => {
    if (!isEditorMode || editingItem) return;
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    if (!isEditorMode || editingItem) return;
    e.preventDefault();
    if (dragOverIdx !== index) setDragOverIdx(index);
  };

  const handleDrop = (e, targetIdx) => {
    if (!isEditorMode || editingItem || draggedIdx === null) return;
    e.preventDefault();
    setDragOverIdx(null);
    if (draggedIdx !== targetIdx) {
      const newOrderedIds = [...activeItems].map(i => i.id);
      const [movedItem] = newOrderedIds.splice(draggedIdx, 1);
      newOrderedIds.splice(targetIdx, 0, movedItem);
      handleReorderItems(newOrderedIds);
    }
    setDraggedIdx(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-stretch -m-2 lg:-m-3">
        {activeItems.map((item, index) => (
          <div
            key={item.id}
            draggable={isEditorMode && !editingItem}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={() => { setDraggedIdx(null); setDragOverIdx(null); }}
            className={`relative h-full p-2 lg:p-3 transition-all duration-200 rounded-md ${
              draggedIdx === index ? 'opacity-80 z-20' : ''
            }`}
          >
            {dragOverIdx === index && draggedIdx !== index && (
              <div className={`absolute top-2 lg:top-3 bottom-2 lg:bottom-3 w-[2px] bg-brand z-50 pointer-events-none shadow-[0_0_10px_#9d00ff] ${draggedIdx < index ? '-right-[1px]' : '-left-[1px]'}`} />
            )}

            <EquipmentCard
              item={item}
              index={index}
              isEditing={editingItem?.id === item.id}
              isEditorMode={isEditorMode}
              editingItem={editingItem}
              startEditing={startEditing}
              cancelEditing={cancelEditing}
              saveEditing={saveEditing}
              handleDeleteItem={handleDeleteItem}
              handleDraftChange={handleDraftChange}
              activeTab={activeTab}
              isPending={isPending}
            />
          </div>
        ))}

        {activeItems.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3 text-gray-500 border border-dashed border-line rounded-md bg-surface/40 animate-fade-in">
            <div className="w-11 h-11 rounded-md border border-line flex items-center justify-center text-gray-600">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-mono text-gray-400">/empty</p>
            <p className="text-[11px] text-gray-600">sin equipos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
