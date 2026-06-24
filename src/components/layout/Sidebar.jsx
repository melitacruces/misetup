import React, { useState } from 'react';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';

export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  CATEGORIES,
  sections = [],
  items = [],
  activeTab,
  setActiveTab,
  cancelEditing,
  totalItems,
  isPending,
  isEditorMode,
  handleAddSection,
  handleDeleteSection,
  handleReorderSections,
  handleUpdateSection
}) {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionIcon, setNewSectionIcon] = useState('fa-solid fa-folder');
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');
  const [editSectionIcon, setEditSectionIcon] = useState('');

  React.useEffect(() => {
    if (!isEditorMode) {
      setEditingSectionId(null);
      setIsAddingSection(false);
    }
  }, [isEditorMode]);

  const submitNewSection = () => {
    if (newSectionTitle.trim()) {
      handleAddSection(newSectionTitle.trim(), newSectionIcon);
      setNewSectionTitle('');
      setIsAddingSection(false);
    }
  };

  const handleDragStart = (e, index) => {
    if (!isEditorMode) return;
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    if (!isEditorMode) return;
    e.preventDefault();
    if (dragOverIdx !== index) setDragOverIdx(index);
  };

  const handleDrop = (e, targetIdx) => {
    if (!isEditorMode || draggedIdx === null) return;
    e.preventDefault();
    setDragOverIdx(null);
    if (draggedIdx !== targetIdx) {
      const newOrderedIds = [...sections].map(s => s.id);
      const [movedItem] = newOrderedIds.splice(draggedIdx, 1);
      newOrderedIds.splice(targetIdx, 0, movedItem);
      handleReorderSections(newOrderedIds);
    }
    setDraggedIdx(null);
  };

  return (
    <>
      {}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {}
      <aside className={`
        w-64 bg-panel border-r border-line flex flex-col fixed h-full z-30 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-line shrink-0">
          <div className="flex items-center gap-2">
            <img src="/images/d.svg" alt="d" className="w-7 h-7" />
            <h1 className="text-xl font-bold tracking-tighter flex items-center text-white">
              MiSetup
            </h1>
          </div>
          <button
            className="lg:hidden p-2 -mr-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded cursor-pointer transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-6 flex flex-col overflow-y-auto -my-0.5">
          {sections.map((section, idx) => {
            const key = section.slug;
            const cat = CATEGORIES[key];
            if (!cat) return null;
            const itemCount = items.filter(i => i.category === key).length;
            
            if (editingSectionId === section.id) {
              return (
                <div key={`edit-${section.id}`} className="mt-1 flex flex-col gap-2 p-3 bg-brand/10 rounded border border-brand/30">
                  <input
                    type="text"
                    placeholder="Nombre (ej: desk)"
                    className="w-full bg-black/50 border border-brand/30 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand"
                    value={editSectionTitle}
                    onChange={e => setEditSectionTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Icono (ej: fa-solid fa-folder)"
                    className="w-full bg-black/50 border border-brand/30 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand"
                    value={editSectionIcon}
                    onChange={e => setEditSectionIcon(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-1">
                    <button
                      className="text-xs text-gray-400 hover:text-white px-2 py-1 cursor-pointer"
                      onClick={() => setEditingSectionId(null)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="text-xs bg-brand text-white px-3 py-1 rounded hover:bg-brand/80 cursor-pointer"
                      onClick={() => {
                        if (editSectionTitle.trim()) {
                          handleUpdateSection(section.id, editSectionTitle.trim(), editSectionIcon);
                          setEditingSectionId(null);
                        }
                      }}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={`view-${section.id}`}
                draggable={isEditorMode && !editingSectionId}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={() => { setDraggedIdx(null); setDragOverIdx(null); }}
                className={`relative py-0.5 flex items-center group gap-1 rounded transition-all duration-200 focus:outline-none ${
                  draggedIdx === idx ? 'opacity-80 z-20' : ''
                }`}
              >
                {}
                {dragOverIdx === idx && draggedIdx !== idx && (
                  <div className={`absolute -left-2 -right-2 h-[2px] bg-brand z-50 pointer-events-none shadow-[0_0_8px_#9d00ff] ${draggedIdx < idx ? '-bottom-[1px]' : '-top-[1px]'}`} />
                )}

                <button
                  onClick={() => {
                    cancelEditing();
                    setIsMobileMenuOpen(false);

                    if (activeTab === key) {
                      if (isEditorMode) {
                        setEditingSectionId(section.id);
                        setEditSectionTitle(section.title);
                        setEditSectionIcon(section.icon_name || '');
                      }
                    } else {
                      setActiveTab(key);
                    }
                  }}
                  className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded transition-all duration-200 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0
                    ${activeTab === key
                      ? 'bg-white text-black shadow-[0_0_18px_-6px_rgba(255,255,255,0.5)]'
                      : 'text-gray-400 hover:text-brand hover:bg-brand/10'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`shrink-0 transition-colors ${activeTab === key ? 'text-brand' : ''}`}>
                      {cat.icon}
                    </span>
                    <span className="font-semibold text-xs">{cat.title}</span>
                  </div>
                  <span className={`text-[10px] tabular-nums ${activeTab === key ? 'text-brand font-bold' : 'text-gray-600'}`}>
                    [{itemCount}]
                  </span>
                </button>

                {isEditorMode && itemCount === 0 && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1.5 text-gray-500 hover:text-red-500 rounded cursor-pointer"
                      title="Eliminar sección vacía"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {isEditorMode && !isAddingSection && (
            <button
              onClick={() => setIsAddingSection(true)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded transition-all duration-200 cursor-pointer text-brand/70 hover:text-brand bg-transparent hover:bg-brand/10 border border-dashed border-brand/30 hover:border-brand mt-1"
            >
              <div className="flex items-center gap-2.5">
                <span className="shrink-0 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </span>
                <span className="font-semibold text-xs">new</span>
              </div>
            </button>
          )}

          {isEditorMode && isAddingSection && (
            <div className="mt-2 flex flex-col gap-2 p-3 bg-brand/10 rounded border border-brand/30">
              <input
                type="text"
                placeholder="Nombre (ej: desk)"
                className="w-full bg-black/50 border border-brand/30 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand"
                value={newSectionTitle}
                onChange={e => setNewSectionTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Icono (ej: fa-solid fa-folder)"
                className="w-full bg-black/50 border border-brand/30 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand"
                value={newSectionIcon}
                onChange={e => setNewSectionIcon(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-1">
                <button
                  className="text-xs text-gray-400 hover:text-white px-2 py-1 cursor-pointer"
                  onClick={() => setIsAddingSection(false)}
                >
                  Cancelar
                </button>
                <button
                  className="text-xs bg-brand text-white px-3 py-1 rounded hover:bg-brand/80 cursor-pointer"
                  onClick={submitNewSection}
                >
                  Guardar
                </button>
              </div>
            </div>
          )}
        </nav>

        <div className="p-6 border-t border-line bg-black shrink-0">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-gray-500 break-all">items = {totalItems};</span>
            <span className="text-[10px] text-gray-500 flex items-center gap-1.5">
              status:
              {isPending ? (
                <span className="text-yellow-500 flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" /> syncing
                </span>
              ) : (
                <span className="text-green-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                  operational
                </span>
              )}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
