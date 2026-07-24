'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  BookOpenCheck,
  LayoutDashboard,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

const VIEW_LINKS = [
  { id: 'overview', label: 'overview', icon: LayoutDashboard },
  { id: 'planner', label: 'planner', icon: BookOpenCheck },
];

export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  CATEGORIES,
  sections = [],
  items = [],
  activeTab,
  setActiveTab,
  activeView,
  setActiveView,
  cancelEditing,
  wishlistCount,
  isPending,
  isEditorMode,
  handleAddSection,
  handleDeleteSection,
  handleReorderSections,
  handleUpdateSection,
}) {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionIcon, setNewSectionIcon] = useState('fa-solid fa-folder');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');
  const [editSectionIcon, setEditSectionIcon] = useState('');

  useEffect(() => {
    if (!isEditorMode) {
      setEditingSectionId(null);
      setIsAddingSection(false);
    }
  }, [isEditorMode]);

  const navigateView = view => {
    cancelEditing();
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const submitNewSection = async () => {
    if (!newSectionTitle.trim()) return;
    const success = await handleAddSection(
      newSectionTitle.trim(),
      newSectionIcon
    );
    if (success) {
      setNewSectionTitle('');
      setIsAddingSection(false);
    }
  };

  const handleDrop = (event, targetIndex) => {
    if (!isEditorMode || draggedIndex === null) return;
    event.preventDefault();
    setDragOverIndex(null);
    if (draggedIndex !== targetIndex) {
      const orderedIds = sections.map(section => section.id);
      const [moved] = orderedIds.splice(draggedIndex, 1);
      orderedIds.splice(targetIndex, 0, moved);
      handleReorderSections(orderedIds);
    }
    setDraggedIndex(null);
  };

  return (
    <>
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Cerrar navegación"
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed z-40 flex h-full w-64 flex-col border-r border-line bg-panel transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
          <button
            type="button"
            onClick={() => navigateView('overview')}
            className="flex items-center gap-2"
          >
            <Image
              src="/images/d.svg"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7"
              priority
            />
            <span className="text-xl font-bold tracking-tighter text-white">
              MiSetup
            </span>
          </button>
          <button
            type="button"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-brand/10 hover:text-brand lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Cerrar navegación"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
            vistas
          </p>
          <div className="mt-2 space-y-1">
            {VIEW_LINKS.map(view => {
              const Icon = view.icon;
              const active = activeView === view.id;
              const count =
                view.id === 'planner' ? wishlistCount : sections.length;
              return (
                <button
                  type="button"
                  key={view.id}
                  onClick={() => navigateView(view.id)}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-xs font-bold transition-colors ${
                    active
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:bg-brand/10 hover:text-brand'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-brand' : ''}`} />
                  <span className="flex-1">{view.label}</span>
                  <span
                    className={`text-xs font-semibold ${
                      active ? 'text-brand' : 'text-gray-400'
                    }`}
                  >
                    [{count}]
                  </span>
                </button>
              );
            })}
          </div>

          <div className="my-5 h-0.5 bg-line" />
          <p className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
            secciones
          </p>

          <div className="mt-2 space-y-1">
            {sections.map((section, index) => {
              const key = section.slug;
              const category = CATEGORIES[key];
              if (!category) return null;
              const itemCount = items.filter(item => item.category === key).length;
              const active =
                activeView === 'inventory' && activeTab === key;

              if (editingSectionId === section.id) {
                return (
                  <div
                    key={`edit-${section.id}`}
                    className="space-y-2 rounded-lg border border-brand/30 bg-brand/10 p-3"
                  >
                    <input
                      value={editSectionTitle}
                      onChange={event => setEditSectionTitle(event.target.value)}
                      placeholder="Nombre"
                      className="min-h-10 w-full rounded-lg border border-brand/30 bg-black px-2 text-xs text-white outline-none focus:border-brand"
                    />
                    <input
                      value={editSectionIcon}
                      onChange={event => setEditSectionIcon(event.target.value)}
                      placeholder="fa-solid fa-folder"
                      className="min-h-10 w-full rounded-lg border border-brand/30 bg-black px-2 text-xs text-white outline-none focus:border-brand"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingSectionId(null)}
                        className="min-h-9 px-2 text-xs text-gray-400"
                      >
                        cancelar
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const success = await handleUpdateSection(
                            section.id,
                            editSectionTitle,
                            editSectionIcon
                          );
                          if (success) setEditingSectionId(null);
                        }}
                        disabled={!editSectionTitle.trim() || isPending}
                        className="min-h-9 rounded-lg bg-brand px-3 text-xs font-bold text-white disabled:opacity-40"
                      >
                        guardar
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={section.id}
                  draggable={isEditorMode && !isPending}
                  onDragStart={event => {
                    if (!isEditorMode) return;
                    setDraggedIndex(index);
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={event => {
                    if (!isEditorMode) return;
                    event.preventDefault();
                    setDragOverIndex(index);
                  }}
                  onDrop={event => handleDrop(event, index)}
                  onDragEnd={() => {
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                  }}
                  className={`group relative flex items-center gap-1 rounded-lg ${
                    dragOverIndex === index && draggedIndex !== index
                      ? 'ring-1 ring-brand'
                      : ''
                  } ${draggedIndex === index ? 'opacity-50' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      cancelEditing();
                      setActiveView('inventory');
                      setActiveTab(key);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex min-h-11 flex-1 items-center gap-3 rounded-lg px-3 text-left text-xs transition-colors ${
                      active
                        ? 'bg-white font-bold text-black'
                        : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-300'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center ${
                        active ? 'text-brand' : ''
                      }`}
                    >
                      {category.icon}
                    </span>
                    <span className="min-w-0 flex-1 truncate lowercase">{category.title}</span>
                    <span
                      className={`text-xs ${
                        active ? 'text-brand font-semibold' : 'text-gray-400'
                      }`}
                    >
                      [{itemCount}]
                    </span>
                  </button>
                  {isEditorMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSectionId(section.id);
                        setEditSectionTitle(section.title);
                        setEditSectionIcon(section.icon_name || '');
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 opacity-100 transition-colors hover:bg-brand/10 hover:text-brand sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                      aria-label={`Editar sección ${section.title}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {isEditorMode && itemCount === 0 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(section.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 opacity-100 transition-colors hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label={`Eliminar sección ${section.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {isEditorMode && !isAddingSection && (
            <button
              type="button"
              data-guide="add-section"
              onClick={() => setIsAddingSection(true)}
              className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-lg border border-dashed border-brand/30 px-3 text-xs text-brand/70 transition-colors hover:border-brand hover:bg-brand/10 hover:text-brand"
            >
              <Plus className="h-4 w-4" />
              nueva sección
            </button>
          )}

          {isEditorMode && isAddingSection && (
            <div className="mt-2 space-y-2 rounded-lg border border-brand/30 bg-brand/10 p-3">
              <input
                value={newSectionTitle}
                onChange={event => setNewSectionTitle(event.target.value)}
                placeholder="Nombre de sección"
                className="min-h-10 w-full rounded-lg border border-brand/30 bg-black px-2 text-xs text-white outline-none focus:border-brand"
                autoFocus
              />
              <input
                value={newSectionIcon}
                onChange={event => setNewSectionIcon(event.target.value)}
                placeholder="fa-solid fa-folder"
                className="min-h-10 w-full rounded-lg border border-brand/30 bg-black px-2 text-xs text-white outline-none focus:border-brand"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingSection(false)}
                  className="min-h-9 px-2 text-xs text-gray-400"
                >
                  cancelar
                </button>
                <button
                  type="button"
                  onClick={submitNewSection}
                  disabled={isPending || !newSectionTitle.trim()}
                  className="min-h-9 rounded-lg bg-brand px-3 text-xs font-bold text-white disabled:opacity-40"
                >
                  guardar
                </button>
              </div>
            </div>
          )}
        </nav>

        <div className="shrink-0 border-t border-line bg-black p-4">
          <div className="flex items-center gap-2 px-2 text-xs text-gray-400">
            {isPending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
                sincronizando
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                operational
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
