'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Loader2 } from 'lucide-react';
import {
  addEquipment,
  addSection,
  addSetupEvent,
  deleteEquipment,
  deleteSection,
  deleteSetupEvent,
  endEditorSession,
  getEditorSetupData,
  getSetupData,
  reorderEquipment,
  reorderSections,
  startEditorSession,
  updateEquipment,
  updateSection,
  updateSetupProfile,
} from '@/lib/actions';
import {
  buildSetupExport,
  normalizeEquipmentItem,
  normalizeEvent,
  normalizeProfile,
} from '@/lib/setupData';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import EquipmentEditor from '@/components/ui/EquipmentEditor';
import EquipmentGrid from '@/components/ui/EquipmentGrid';
import GuidePanel from '@/components/ui/GuidePanel';
import InventoryToolbar from '@/components/ui/InventoryToolbar';
import SetupOverview from '@/components/ui/SetupOverview';
import UpgradePlanner from '@/components/ui/UpgradePlanner';

const EMPTY_GUIDE = {
  section: false,
  equipment: false,
  reorder: false,
  export: false,
};

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function createClientId(prefix = 'local') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizePayload({ items, sections, profile, events }) {
  return {
    items: (items || []).map(normalizeEquipmentItem),
    sections: cloneData(sections || []),
    profile: normalizeProfile(profile),
    events: (events || []).map(normalizeEvent),
  };
}

export default function Dashboard({
  initialData,
  initialSections = [],
  initialProfile,
  initialEvents = [],
  initialEditorMode = false,
  preview = false,
}) {
  const initialPayload = useMemo(
    () =>
      normalizePayload({
        items: initialData,
        sections: initialSections,
        profile: initialProfile,
        events: initialEvents,
      }),
    [initialData, initialSections, initialProfile, initialEvents]
  );
  const previewSeed = useRef(initialPayload);

  const [items, setItems] = useState(initialPayload.items);
  const [sections, setSections] = useState(initialPayload.sections);
  const [profile, setProfile] = useState(initialPayload.profile);
  const [events, setEvents] = useState(initialPayload.events);
  const [activeView, setActiveView] = useState('overview');
  const [activeTab, setActiveTab] = useState(initialSections[0]?.slug || 'core');
  const [editingItem, setEditingItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isEditorMode, setIsEditorMode] = useState(initialEditorMode);
  const [notice, setNotice] = useState('');
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideProgress, setGuideProgress] = useState(EMPTY_GUIDE);
  const [guideHydrated, setGuideHydrated] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kindFilter, setKindFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('position');

  const guideStorageKey = 'misetup_preview_guide_v1';

  useEffect(() => {
    setItems(initialPayload.items);
    setSections(initialPayload.sections);
    setProfile(initialPayload.profile);
    setEvents(initialPayload.events);
    setIsEditorMode(initialEditorMode);
  }, [initialPayload, initialEditorMode]);

  useEffect(() => {
    if (!preview) return;
    const saved = window.localStorage.getItem(guideStorageKey);
    if (saved) {
      try {
        setGuideProgress({ ...EMPTY_GUIDE, ...JSON.parse(saved) });
      } catch {
        setGuideProgress(EMPTY_GUIDE);
      }
    }
    setGuideHydrated(true);
  }, [preview, guideStorageKey]);

  useEffect(() => {
    if (!preview || !guideHydrated) return;
    window.localStorage.setItem(
      guideStorageKey,
      JSON.stringify(guideProgress)
    );
  }, [preview, guideHydrated, guideProgress, guideStorageKey]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 4200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (sections.length > 0 && !sections.some(section => section.slug === activeTab)) {
      setActiveTab(sections[0].slug);
    }
  }, [sections, activeTab]);

  const runAction = callback =>
    new Promise(resolve => {
      startTransition(async () => {
        try {
          resolve(await callback());
        } catch (error) {
          console.error(error);
          setNotice(error.message || 'No se pudo completar la acción.');
          resolve(null);
        }
      });
    });

  const applyPayload = payload => {
    const normalized = normalizePayload(payload);
    setItems(normalized.items);
    setSections(normalized.sections);
    setProfile(normalized.profile);
    setEvents(normalized.events);
  };

  const markChallenge = id => {
    if (!preview) return;
    setGuideProgress(previous => ({ ...previous, [id]: true }));
  };

  const CATEGORIES = useMemo(
    () =>
      sections.reduce((accumulator, section) => {
        accumulator[section.slug] = {
          title: section.title,
          icon: (
            <i className={section.icon_name || 'fa-solid fa-folder'} />
          ),
          defaultIcon: section.icon_name || 'fa-solid fa-folder',
        };
        return accumulator;
      }, {}),
    [sections]
  );

  const handleEditorLogin = async event => {
    event?.preventDefault();
    if (!preview) {
      const password = window.prompt('Ingresa la clave de editor de esta instalación.');
      if (!password) return false;
      const session = await runAction(() => startEditorSession(password));
      if (!session?.success) {
        setNotice(session?.error || 'No se pudo iniciar la sesión de editor.');
        return false;
      }
      const payload = await runAction(() => getEditorSetupData());
      if (!payload) return false;
      applyPayload(payload);
      setIsEditorMode(true);
      setNotice('Modo editor activado. Los cambios se guardarán en tu base de datos.');
      return true;
    }
    setIsEditorMode(true);
    setNotice('Modo editor activado. Los cambios son temporales.');
    return true;
  };

  const logoutEditor = async () => {
    setEditingItem(null);
    if (!preview) {
      await runAction(() => endEditorSession());
      const payload = await runAction(() => getSetupData());
      if (payload) applyPayload(payload);
    }
    setIsEditorMode(false);
    setNotice('Volviste al modo viewer.');
  };

  const startEditing = (category, item) => {
    if (!isEditorMode) return;
    setEditingItem({
      category,
      id: item.id,
      isNew: false,
      draft: normalizeEquipmentItem(item),
    });
  };

  const handleAddItem = () => {
    if (!isEditorMode) return;
    const isPlanner = activeView === 'planner';
    const newItem = normalizeEquipmentItem({
      id: createClientId('draft'),
      category: activeTab,
      type: '',
      brand: '',
      model: '',
      description: '',
      icon_name: CATEGORIES[activeTab]?.defaultIcon || 'fa-solid fa-box',
      website_url: '',
      position: items.filter(item => item.category === activeTab).length,
      roadmap_position: items.filter(item => item.status === 'wishlist').length,
      item_kind: 'hardware',
      status: isPlanner ? 'wishlist' : 'active',
      currency: profile.default_currency,
      is_public: true,
    });

    setItems(previous => [...previous, newItem]);
    setEditingItem({
      category: activeTab,
      id: newItem.id,
      isNew: true,
      draft: newItem,
    });
  };

  const cancelEditing = () => {
    if (editingItem?.isNew) {
      setItems(previous => previous.filter(item => item.id !== editingItem.id));
    }
    setEditingItem(null);
  };

  const saveEditing = async draftInput => {
    if (!isEditorMode || !editingItem) return false;
    const draft = normalizeEquipmentItem(draftInput || editingItem.draft);

    if (!preview) {
      const response = await runAction(() =>
        editingItem.isNew
          ? addEquipment(draft)
          : updateEquipment(editingItem.id, draft)
      );
      if (!response?.success) {
        setNotice(response?.error || 'No se pudo guardar el elemento.');
        return false;
      }
      const savedItem = normalizeEquipmentItem(response.item);
      setItems(previous =>
        previous.map(item => (item.id === editingItem.id ? savedItem : item))
      );
      if (response.event) {
        setEvents(previous => [normalizeEvent(response.event), ...previous]);
      }
      setEditingItem(null);
      setNotice('Elemento guardado en tu base de datos.');
      return true;
    }

    setItems(previous =>
      previous.map(item => (item.id === editingItem.id ? draft : item))
    );
    if (editingItem.isNew) {
      const newEvent = normalizeEvent({
        id: createClientId('event'),
        event_type: draft.status === 'wishlist' ? 'planned' : 'added',
        title:
          draft.status === 'wishlist'
            ? `upgrade planificado: ${draft.brand} ${draft.model || draft.type}`
            : `nuevo en el setup: ${draft.brand} ${draft.model || draft.type}`,
          description: draft.description,
        occurred_on:
          draft.planned_for ||
          draft.purchase_date ||
          new Date().toISOString().slice(0, 10),
        amount:
          draft.status === 'wishlist'
            ? draft.target_price
            : draft.purchase_price,
        currency: draft.currency,
        is_public: draft.is_public,
      });
      setEvents(previous => [newEvent, ...previous]);
      markChallenge('equipment');
    }
    setEditingItem(null);
    setNotice('Cambios guardados en esta preview.');
    return true;
  };

  const handleDeleteItem = async () => {
    if (!isEditorMode || !editingItem) return false;
    const { id, isNew } = editingItem;
    if (!preview && !isNew) {
      const response = await runAction(() => deleteEquipment(id));
      if (!response?.success) {
        setNotice(response?.error || 'No se pudo eliminar el elemento.');
        return false;
      }
    }
    setItems(previous => previous.filter(item => item.id !== id));
    setEvents(previous => previous.filter(event => event.equipment_id !== id));
    setEditingItem(null);
    setNotice('Elemento eliminado.');
    return true;
  };

  const handleAddSection = async (title, iconName) => {
    if (!isEditorMode) return false;
    if (!preview) {
      const response = await runAction(() =>
        addSection({ title, icon_name: iconName })
      );
      if (!response?.success) {
        setNotice(response?.error || 'No se pudo crear la sección.');
        return false;
      }
      setSections(previous => [...previous, response.section]);
      setNotice('Sección creada en tu base de datos.');
      return true;
    }
    const slug = String(title)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    if (!slug || sections.some(section => section.slug === slug)) {
      setNotice('Ya existe una sección con ese nombre.');
      return false;
    }
    setSections(previous => [
      ...previous,
      {
        id: createClientId('section'),
        slug,
        title,
        icon_name: iconName || 'fa-solid fa-folder',
        position: previous.length,
      },
    ]);
    markChallenge('section');
    setNotice('Sección creada en esta preview.');
    return true;
  };

  const handleDeleteSection = async id => {
    if (!isEditorMode) return false;
    const section = sections.find(item => item.id === id);
    if (section && items.some(item => item.category === section.slug)) {
      setNotice('Solo puedes eliminar secciones vacías.');
      return false;
    }

    if (!preview) {
      const response = await runAction(() => deleteSection(id));
      if (!response?.success) {
        setNotice(response?.error || 'No se pudo eliminar la sección.');
        return false;
      }
    }

    setSections(previous => previous.filter(item => item.id !== id));
    setNotice('Sección eliminada.');
    return true;
  };

  const handleReorderSections = async orderedIds => {
    if (!isEditorMode) return false;
    const previousSections = sections;
    const reordered = [...sections]
      .sort(
        (left, right) =>
          orderedIds.indexOf(left.id) - orderedIds.indexOf(right.id)
      )
      .map((section, index) => ({ ...section, position: index }));
    setSections(reordered);
    if (!preview) {
      const response = await runAction(() => reorderSections(orderedIds));
      if (!response?.success) {
        setSections(previousSections);
        setNotice(response?.error || 'No se pudo reordenar.');
        return false;
      }
    }
    markChallenge('reorder');
    return true;
  };

  const handleUpdateSection = async (id, title, iconName) => {
    if (!isEditorMode || !title.trim()) return false;
    if (!preview) {
      const response = await runAction(() =>
        updateSection(id, { title, icon_name: iconName })
      );
      if (!response?.success) {
        setNotice(response?.error || 'No se pudo actualizar la sección.');
        return false;
      }
      setSections(previous =>
        previous.map(section =>
          section.id === id ? response.section : section
        )
      );
      setNotice('Sección actualizada en tu base de datos.');
      return true;
    }
    setSections(previous =>
      previous.map(section =>
        section.id === id
          ? { ...section, title: title.trim(), icon_name: iconName }
          : section
      )
    );
    setNotice('Sección actualizada.');
    return true;
  };

  const handleReorderItems = async orderedIds => {
    if (!isEditorMode) return false;
    const previousItems = items;
    const currentIds = new Set(orderedIds);
    const reorderedActive = items
      .filter(item => currentIds.has(item.id))
      .sort(
        (left, right) =>
          orderedIds.indexOf(left.id) - orderedIds.indexOf(right.id)
      )
      .map((item, index) => ({
        ...item,
        position: index,
        roadmap_position: index,
      }));
    const reorderedById = new Map(reorderedActive.map(item => [item.id, item]));
    setItems(previous =>
      previous.map(item => reorderedById.get(item.id) || item)
    );
    if (!preview) {
      const response = await runAction(() => reorderEquipment(orderedIds));
      if (!response?.success) {
        setItems(previousItems);
        setNotice(response?.error || 'No se pudo reordenar.');
        return false;
      }
    }
    markChallenge('reorder');
    setNotice('Orden actualizado en esta preview.');
    return true;
  };

  const handleSaveProfile = async nextProfile => {
    if (!isEditorMode) return false;
    const normalized = normalizeProfile(nextProfile);
    if (!preview) {
      const response = await runAction(() => updateSetupProfile(normalized));
      if (!response?.success) {
        setNotice(response?.error || 'No se pudo guardar la presentación.');
        return false;
      }
      setProfile(normalizeProfile(response.profile));
      setNotice('Presentación guardada en tu base de datos.');
      return true;
    }
    setProfile(normalized);
    setNotice('Presentación actualizada en esta preview.');
    return true;
  };

  const handleAddEvent = async event => {
    if (!isEditorMode) return false;
    if (!preview) {
      const response = await runAction(() => addSetupEvent(event));
      if (!response?.success) {
        setNotice(response?.error || 'No se pudo añadir el evento.');
        return false;
      }
      setEvents(previous => [normalizeEvent(response.event), ...previous]);
      setNotice('Hito añadido al timeline.');
      return true;
    }
    setEvents(previous => [
      normalizeEvent({ ...event, id: createClientId('event') }),
      ...previous,
    ]);
    setNotice('Hito añadido al timeline.');
    return true;
  };

  const handleDeleteEvent = async id => {
    if (!isEditorMode) return false;
    if (!preview) {
      const response = await runAction(() => deleteSetupEvent(id));
      if (!response?.success) {
        setNotice(response?.error || 'No se pudo eliminar el evento.');
        return false;
      }
    }
    setEvents(previous => previous.filter(event => event.id !== id));
    setNotice('Evento eliminado.');
    return true;
  };

  const handleExport = () => {
    const payload = buildSetupExport({
      profile,
      sections,
      items,
      events,
      preview,
      includePrivate: isEditorMode,
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const title = String(profile.title || 'MiSetup').trim();
    const safeName = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const exportName = safeName === 'misetup' ? 'MiSetup' : safeName;
    anchor.href = url;
    anchor.download = `${exportName || 'MiSetup'}-${preview ? 'preview' : 'export'}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    markChallenge('export');
    setNotice('Setup exportado como JSON.');
  };

  const handleReset = async () => {
    setEditingItem(null);
    setQuery('');
    setStatusFilter('all');
    setKindFilter('all');
    setSortOrder('position');

    if (preview) {
      applyPayload(cloneData(previewSeed.current));
      setActiveView('overview');
      setActiveTab(previewSeed.current.sections[0]?.slug || 'core');
      setIsEditorMode(false);
      setGuideProgress(EMPTY_GUIDE);
      setNotice('Preview reiniciada.');
      return;
    }

    const payload = await runAction(() =>
      isEditorMode ? getEditorSetupData() : getSetupData()
    );
    if (payload) {
      applyPayload(payload);
      setNotice('Datos recargados desde PostgreSQL.');
    }
  };

  const showChallenge = challenge => {
    if (challenge === 'export') {
      setGuideOpen(false);
      window.setTimeout(() => {
        document.querySelector('[aria-label="Exportar setup"]')?.focus();
      }, 50);
      return;
    }

    if (!isEditorMode) {
      setIsEditorMode(true);
    }

    setQuery('');
    setStatusFilter('all');
    setKindFilter('all');
    setSortOrder('position');
    setActiveView('inventory');
    setGuideOpen(false);
    if (challenge === 'section') {
      setIsMobileMenuOpen(true);
      window.setTimeout(() => {
        document.querySelector('[data-guide="add-section"]')?.focus();
      }, 350);
    } else if (challenge === 'equipment') {
      window.setTimeout(() => {
        document.querySelector('[data-guide="add-equipment"]')?.focus();
      }, 50);
    } else if (challenge === 'reorder') {
      setNotice('Usa las flechas de una tarjeta o arrástrala a otra posición.');
    }
  };

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    const result = items.filter(item => {
      if (item.category !== activeTab) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (kindFilter !== 'all' && item.item_kind !== kindFilter) return false;
      if (!search) return true;
      const haystack = [
        item.type,
        item.brand,
        item.model,
        item.description,
        ...(item.tags || []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(search);
    });

    return result.sort((left, right) => {
      if (sortOrder === 'name') {
        return `${left.brand} ${left.model}`.localeCompare(
          `${right.brand} ${right.model}`
        );
      }
      if (sortOrder === 'price') {
        const leftPrice =
          left.status === 'wishlist' ? left.target_price : left.purchase_price;
        const rightPrice =
          right.status === 'wishlist' ? right.target_price : right.purchase_price;
        return Number(rightPrice || 0) - Number(leftPrice || 0);
      }
      if (sortOrder === 'date') {
        return String(right.purchase_date || right.planned_for || '').localeCompare(
          String(left.purchase_date || left.planned_for || '')
        );
      }
      return Number(left.position || 0) - Number(right.position || 0);
    });
  }, [items, activeTab, statusFilter, kindFilter, query, sortOrder]);

  const wishlistCount = items.filter(item => item.status === 'wishlist').length;
  const sectionItemCount = items.filter(item => item.category === activeTab).length;

  return (
    <div
      className="relative flex min-h-screen bg-black font-mono text-white selection:bg-brand/40"
      style={{
        backgroundImage:
          'radial-gradient(72% 55% at 50% -8%, rgba(157,0,255,0.12), transparent 72%)',
      }}
    >

      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        CATEGORIES={CATEGORIES}
        sections={sections}
        items={items}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeView={activeView}
        setActiveView={setActiveView}
        cancelEditing={cancelEditing}
        wishlistCount={wishlistCount}
        isPending={isPending}
        isEditorMode={isEditorMode}
        handleAddSection={handleAddSection}
        handleDeleteSection={handleDeleteSection}
        handleReorderSections={handleReorderSections}
        handleUpdateSection={handleUpdateSection}
      />

      <main className="flex min-h-screen w-full flex-1 flex-col lg:ml-64">
        <Header
          CATEGORIES={CATEGORIES}
          activeTab={activeTab}
          activeView={activeView}
          setActiveView={setActiveView}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isEditorMode={isEditorMode}
          handleEditorLogin={handleEditorLogin}
          logoutEditor={logoutEditor}
          handleAddItem={handleAddItem}
          handleExport={handleExport}
          handleReset={handleReset}
          isPending={isPending}
          preview={preview}
        />

        {activeView === 'overview' && (
          <SetupOverview
            items={items}
            sections={sections}
            profile={profile}
            events={events}
            isEditorMode={isEditorMode}
            isPending={isPending}
            onOpenSection={slug => {
              setActiveTab(slug);
              setActiveView('inventory');
            }}
            onSaveProfile={handleSaveProfile}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            preview={preview}
            guideProgress={guideProgress}
            onOpenGuide={() => setGuideOpen(true)}
          />
        )}

        {activeView === 'inventory' && (
          <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
            <InventoryToolbar
              query={query}
              setQuery={setQuery}
              status={statusFilter}
              setStatus={setStatusFilter}
              kind={kindFilter}
              setKind={setKindFilter}
              sort={sortOrder}
              setSort={setSortOrder}
              resultCount={filteredItems.length}
              totalCount={sectionItemCount}
            />
            <EquipmentGrid
              activeItems={filteredItems}
              isEditorMode={isEditorMode}
              startEditing={startEditing}
              handleReorderItems={handleReorderItems}
              isPending={isPending}
              showPrices={profile.show_prices || isEditorMode}
              canReorder={
                !query &&
                statusFilter === 'all' &&
                kindFilter === 'all' &&
                sortOrder === 'position'
              }
            />
          </div>
        )}

        {activeView === 'planner' && (
          <UpgradePlanner
            items={items}
            profile={profile}
            isEditorMode={isEditorMode}
            isPending={isPending}
            onEdit={startEditing}
            onAdd={handleAddItem}
            onSaveProfile={handleSaveProfile}
          />
        )}
      </main>

      <EquipmentEditor
        key={editingItem?.id || 'closed-editor'}
        editingItem={editingItem}
        sections={sections}
        isPending={isPending}
        onCancel={cancelEditing}
        onSave={saveEditing}
        onDelete={handleDeleteItem}
      />

      {preview && guideOpen && (
        <GuidePanel
          progress={guideProgress}
          onClose={() => setGuideOpen(false)}
          onShowChallenge={showChallenge}
          onResetProgress={() => setGuideProgress(EMPTY_GUIDE)}
        />
      )}

      <div
        aria-live="polite"
        className={`fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-lg border px-4 py-2 text-xs shadow-xl backdrop-blur transition-all ${
          notice
            ? 'translate-y-0 border-brand/40 bg-black/90 text-white opacity-100'
            : 'pointer-events-none translate-y-3 border-transparent opacity-0'
        }`}
      >
        {notice}
      </div>

      {isPending && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-lg border border-brand/30 bg-black/70 p-2.5 shadow-[0_0_15px_rgba(157,0,255,0.3)] backdrop-blur-md">
          <Loader2 className="h-4 w-4 animate-spin text-brand" />
        </div>
      )}
    </div>
  );
}
