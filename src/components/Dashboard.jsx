'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { addEquipment, updateEquipment, deleteEquipment, verifyPassword } from '../lib/actions';

import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import AdminAuthModal from './ui/AdminAuthModal';
import EquipmentGrid from './ui/EquipmentGrid';

function createClientId() {
  return Date.now();
}

export default function Dashboard({ initialData, initialSections = [], demo = false }) {
  const [items, setItems] = useState(initialData);
  const [sections, setSections] = useState(initialSections);

  useEffect(() => {
    setItems(initialData);
    setSections(initialSections);
  }, [initialData, initialSections]);

  const [activeTab, setActiveTab] = useState(initialSections[0]?.slug || 'core');
  const [editingItem, setEditingItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [isEditorMode, setIsEditorMode] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !demo) {
      const savedMode = localStorage.getItem('dhreian_editor_mode');
      if (savedMode === 'true') {
        setIsEditorMode(true);
      }
    }
  }, [demo]);

  useEffect(() => {
    if (sections.length > 0 && !sections.find(s => s.slug === activeTab)) {
      setActiveTab(sections[0].slug);
    }
  }, [sections, activeTab]);

  const CATEGORIES = sections.reduce((acc, s) => {
    acc[s.slug] = { 
      title: s.title, 
      icon: <i className={s.icon_name || 'fa-solid fa-folder'}></i>, 
      defaultIcon: s.icon_name || 'fa-solid fa-folder'
    };
    return acc;
  }, {});

  const totalItems = items.length;

  const handleEditorLogin = async (e) => {
    if (e) e.preventDefault();
    if (demo) {
      setIsEditorMode(true);
      setShowPasswordPrompt(false);
      return;
    }
    
    setIsVerifying(true);
    setPasswordError('');
    try {
      const isValid = await verifyPassword(passwordInput);
      if (isValid) {
        setIsEditorMode(true);
        localStorage.setItem('dhreian_editor_mode', 'true');
        setShowPasswordPrompt(false);
        setPasswordInput('');
      } else {
        setPasswordError('Acceso denegado. Clave incorrecta.');
      }
    } catch (err) {
      setPasswordError('Error de servidor.');
    } finally {
      setIsVerifying(false);
    }
  };

  const logoutEditor = () => {
    setIsEditorMode(false);
    setEditingItem(null);
    if (!demo) localStorage.removeItem('dhreian_editor_mode');
  };

  const handleAddItem = async () => {
    if (!isEditorMode) return;
    const newItem = {
      id: demo ? createClientId() : undefined,
      category: activeTab,
      type: "",
      brand: "",
      model: "",
      description: "",
      icon_name: CATEGORIES[activeTab]?.defaultIcon || 'fa-solid fa-box',
      website_url: "",
      position: 0
    };

    if (demo) {
      setItems(prev => [...prev, newItem]);
      startEditing(activeTab, newItem);
      return;
    }

    setItems(prev => [...prev, newItem]);
    startEditing(activeTab, newItem);

    startTransition(async () => {
      try {
        const { addEquipment } = await import('../lib/actions');
        await addEquipment(newItem);
      } catch (e) {
        console.error(e);
      }
    });
  };

  const handleDeleteItem = (id) => {
    if (!isEditorMode) return;

    if (demo) {
      setItems(prev => prev.filter(i => i.id !== id));
      setEditingItem(null);
      return;
    }

    setItems(prev => prev.filter(i => i.id !== id));
    setEditingItem(null);

    startTransition(async () => {
      try {
        const { deleteEquipment } = await import('../lib/actions');
        await deleteEquipment(id);
      } catch (e) {
        console.error(e);
        alert("Error al intentar eliminar: " + e.message);
      }
    });
  };

  const startEditing = (category, item) => {
    if (!isEditorMode) return;
    setEditingItem({ category, id: item.id, draft: { ...item } });
  };

  const cancelEditing = () => setEditingItem(null);

  const handleDraftChange = (field, value) => {
    setEditingItem(prev => ({
      ...prev,
      draft: { ...prev.draft, [field]: value }
    }));
  };

  const saveEditing = () => {
    if (!isEditorMode) return;

    if (demo) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? editingItem.draft : i));
      setEditingItem(null);
      return;
    }

    const currentDraft = editingItem.draft;
    const currentId = editingItem.id;
    setItems(prev => prev.map(i => i.id === currentId ? currentDraft : i));
    setEditingItem(null);

    startTransition(async () => {
      try {
        const { updateEquipment } = await import('../lib/actions');
        await updateEquipment(currentId, currentDraft);
      } catch (e) {
        console.error(e);
        alert("Error al intentar guardar: " + e.message);
      }
    });
  };

  const handleAddSection = async (title, icon_name) => {
    if (!isEditorMode) return;
    const slug = String(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    if (!slug || sections.some(s => s.slug === slug)) return;
    const newSec = { id: createClientId(), slug, title: title.trim(), icon_name: icon_name || 'fa-solid fa-folder', position: sections.length };

    if (demo) {
      setSections(prev => [...prev, newSec]);
      return;
    }

    setSections(prev => [...prev, newSec]);

    startTransition(async () => {
      const { addSection } = await import('../lib/actions');
      const res = await addSection({ title, icon_name });
      if (res && !res.success) {
        alert(res.error);
      }
    });
  };

  const handleDeleteSection = async (id) => {
    if (!isEditorMode) return;
    
    const sec = sections.find(s => s.id === id);
    if (sec && items.some(i => i.category === sec.slug)) {
      alert("Solo puedes eliminar secciones vacías.");
      return;
    }

    if (demo) {
      setSections(prev => prev.filter(s => s.id !== id));
      return;
    }

    setSections(prev => prev.filter(s => s.id !== id));

    startTransition(async () => {
      const { deleteSection } = await import('../lib/actions');
      const res = await deleteSection(id);
      if (res && !res.success) {
        alert(res.error);
      }
    });
  };

  const handleReorderSections = async (orderedIds) => {
    if (!isEditorMode) return;

    if (demo) {
      setSections(prev => {
        const sorted = [...prev].sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id));
        return sorted.map((s, i) => ({ ...s, position: i }));
      });
      return;
    }

    setSections(prev => {
      const sorted = [...prev].sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id));
      return sorted.map((s, i) => ({ ...s, position: i }));
    });

    startTransition(async () => {
      const { reorderSections } = await import('../lib/actions');
      const res = await reorderSections(orderedIds);
      if (res && !res.success) {
        alert(res.error);
      }
    });
  };

  const handleUpdateSection = async (id, title, icon_name) => {
    if (!isEditorMode) return;
    if (demo) {
      setSections(prev => prev.map(s => s.id === id ? { ...s, title, icon_name } : s));
      return;
    }

    setSections(prev => prev.map(s => s.id === id ? { ...s, title, icon_name } : s));

    startTransition(async () => {
      const { updateSection } = await import('../lib/actions');
      const res = await updateSection(id, { title, icon_name });
      if (res && !res.success) {
        alert(res.error);
      }
    });
  };

  const handleReorderItems = async (orderedIds) => {
    if (!isEditorMode) return;
    if (demo) {
      setItems(prev => {
        const otherItems = prev.filter(i => i.category !== activeTab);
        const activeItems = prev.filter(i => i.category === activeTab);
        activeItems.sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id));
        activeItems.forEach((item, index) => item.position = index);
        return [...otherItems, ...activeItems];
      });
      return;
    }

    setItems(prev => {
      const otherItems = prev.filter(i => i.category !== activeTab);
      const activeItems = prev.filter(i => i.category === activeTab);
      activeItems.sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id));
      activeItems.forEach((item, index) => item.position = index);
      return [...otherItems, ...activeItems];
    });

    startTransition(async () => {
      const { reorderEquipment } = await import('../lib/actions');
      const res = await reorderEquipment(orderedIds);
      if (res && !res.success) {
        alert(res.error);
      }
    });
  };

  const activeItems = items.filter(item => item.category === activeTab);

  return (
    <div
      className="flex min-h-screen bg-[#000000] text-white font-mono selection:bg-brand/40 relative"
      style={{ backgroundImage: 'radial-gradient(72% 55% at 50% -8%, rgba(157,0,255,0.12), transparent 72%)' }}
    >
      {showPasswordPrompt && (
        <AdminAuthModal
          handleEditorLogin={handleEditorLogin}
          passwordInput={passwordInput}
          setPasswordInput={setPasswordInput}
          passwordError={passwordError}
          setPasswordError={setPasswordError}
          setShowPasswordPrompt={setShowPasswordPrompt}
          isVerifying={isVerifying}
        />
      )}

      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        CATEGORIES={CATEGORIES}
        sections={sections}
        items={items}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cancelEditing={cancelEditing}
        totalItems={totalItems}
        isPending={isPending}
        isEditorMode={isEditorMode}
        handleAddSection={handleAddSection}
        handleDeleteSection={handleDeleteSection}
        handleReorderSections={handleReorderSections}
        handleUpdateSection={handleUpdateSection}
      />

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full">
        <Header
          CATEGORIES={CATEGORIES}
          activeTab={activeTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isEditorMode={isEditorMode}
          setShowPasswordPrompt={setShowPasswordPrompt}
          handleEditorLogin={handleEditorLogin}
          logoutEditor={logoutEditor}
          handleAddItem={handleAddItem}
          isPending={isPending}
          demo={demo}
        />

        {demo && !isEditorMode && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 lg:p-5 bg-brand/10 border border-brand/30 rounded-lg text-white/80 shadow-[0_0_25px_-5px_rgba(157,0,255,0.2)]">
            <h3 className="font-bold text-brand mb-2 flex items-center gap-2 text-sm sm:text-base">
              <i className="fa-solid fa-rocket"></i> Bienvenido a Setup Manager
            </h3>
            <p className="text-xs sm:text-sm mb-3 leading-relaxed">
              Esta plataforma interactiva está diseñada para organizar, visualizar y gestionar colecciones de hardware, software y herramientas digitales. Es ideal para creadores de contenido, profesionales o equipos de trabajo que necesiten mantener un inventario estructurado de su ecosistema tecnológico.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/60 pt-3 border-t border-brand/20">
              <i className="fa-solid fa-flask text-brand/60"></i>
              <span>¿Quieres probar las funciones interactivas? Haz clic en <strong>editor</strong> arriba a la derecha.</span>
            </div>
          </div>
        )}

        {demo && isEditorMode && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 lg:p-5 bg-brand/10 border border-brand/30 rounded-lg text-white/80 shadow-[0_0_25px_-5px_rgba(157,0,255,0.2)]">
            <h3 className="font-bold text-brand mb-3 flex items-center gap-2 text-sm sm:text-base">
              <i className="fa-solid fa-circle-info"></i> Guía Rápida del Modo Editor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1">
                <strong className="text-white flex items-center gap-1.5"><i className="fa-solid fa-pen-to-square text-brand"></i> Editar</strong>
                <p>Haz clic en cualquier tarjeta, o en la sección activa de la barra lateral, para modificar su contenido de inmediato.</p>
              </div>
              <div className="flex flex-col gap-1">
                <strong className="text-white flex items-center gap-1.5"><i className="fa-solid fa-arrows-up-down-left-right text-brand"></i> Reordenar</strong>
                <p>Arrastra y suelta tarjetas, o elementos de la barra lateral, para organizarlos. El nuevo orden se guarda automáticamente.</p>
              </div>
              <div className="flex flex-col gap-1">
                <strong className="text-white flex items-center gap-1.5"><i className="fa-solid fa-plus text-brand"></i> Añadir</strong>
                <p>Usa el botón &quot;new&quot; de la cabecera para agregar un equipo, o el que está al final de la barra lateral para crear una sección.</p>
              </div>
            </div>
          </div>
        )}

        <EquipmentGrid
          key={activeTab}
          activeItems={activeItems}
          editingItem={editingItem}
          isEditorMode={isEditorMode}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          saveEditing={saveEditing}
          handleDeleteItem={handleDeleteItem}
          handleDraftChange={handleDraftChange}
          handleReorderItems={handleReorderItems}
          activeTab={activeTab}
          isPending={isPending}
        />
      </main>

      {isPending && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-black/60 border border-brand/30 backdrop-blur-md rounded-full p-2.5 shadow-[0_0_15px_rgba(157,0,255,0.3)] animate-fade-in pointer-events-none">
          <Loader2 className="w-4 h-4 text-brand animate-spin" />
        </div>
      )}
    </div>
  );
}
