import {
  BookOpenCheck,
  Download,
  LayoutDashboard,
  ListFilter,
  Loader2,
  Lock,
  Menu,
  Plus,
  RefreshCcw,
  Unlock,
} from 'lucide-react';

const VIEWS = [
  { id: 'overview', label: 'overview', icon: LayoutDashboard },
  { id: 'inventory', label: 'inventory', icon: ListFilter },
  { id: 'planner', label: 'planner', icon: BookOpenCheck },
];

export default function Header({
  CATEGORIES,
  activeTab,
  activeView,
  setActiveView,
  setIsMobileMenuOpen,
  isEditorMode,
  handleEditorLogin,
  logoutEditor,
  handleAddItem,
  handleExport,
  handleReset,
  isPending,
  preview,
}) {
  const currentCategory = CATEGORIES[activeTab] || {
    icon: <i className="fa-solid fa-folder" />,
    title: 'inventory',
  };
  const viewTitle =
    activeView === 'overview'
      ? 'overview'
      : activeView === 'planner'
        ? 'upgrade_planner'
        : currentCategory.title;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-black/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:flex lg:h-16 lg:items-center lg:py-0">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-brand/10 hover:text-brand lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir navegación"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="flex min-w-0 items-center gap-2.5 text-lg font-bold text-white sm:text-xl">
            <span className="flex shrink-0 items-center text-base text-brand">
              {activeView === 'inventory' ? currentCategory.icon : (
                <i className={activeView === 'planner' ? 'fa-solid fa-wand-magic-sparkles' : 'fa-solid fa-chart-simple'} />
              )}
            </span>
            <span className="truncate lowercase">{viewTitle}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {preview && (
            <a
              href="https://github.com/melitacruces/misetup"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir GitHub"
              className="hidden min-h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-xs font-bold text-gray-400 transition-colors hover:border-brand hover:text-brand md:flex"
            >
              <i className="fa-brands fa-github text-base shrink-0" />
              <span>github</span>
            </a>
          )}
          <button
            type="button"
            onClick={handleExport}
            aria-label="Exportar setup"
            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-xs font-bold text-gray-400 transition-colors hover:border-brand hover:text-brand disabled:opacity-40"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span>exportar</span>
          </button>
          {preview && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              aria-label="Reiniciar escenario"
              className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-xs font-bold text-gray-400 transition-colors hover:border-brand hover:text-brand disabled:opacity-40"
            >
              <RefreshCcw className="h-4 w-4 shrink-0" />
              <span>reiniciar</span>
            </button>
          )}
          {!isEditorMode ? (
            <button
              type="button"
              onClick={handleEditorLogin}
              className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-brand px-3 text-xs font-bold text-brand transition-colors hover:bg-brand/10"
            >
              <Lock className="h-4 w-4 shrink-0" />
              <span>editor</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={logoutEditor}
              className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-brand/50 px-3 text-xs font-bold text-brand transition-colors hover:bg-brand/10"
            >
              <Unlock className="h-4 w-4 shrink-0" />
              <span>viewer</span>
            </button>
          )}

          {isEditorMode && activeView !== 'overview' && (
            <button
              type="button"
              onClick={handleAddItem}
              disabled={isPending}
              data-guide="add-equipment"
              className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-brand px-3 text-xs font-bold text-white transition-opacity hover:opacity-85 disabled:opacity-40"
              aria-label={activeView === 'planner' ? 'Nuevo upgrade' : 'Nuevo elemento'}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              ) : (
                <Plus className="h-4 w-4 shrink-0" />
              )}
              <span>
                {activeView === 'planner' ? 'upgrade' : 'nuevo'}
              </span>
            </button>
          )}
        </div>
      </div>

      <nav className="mt-3 flex gap-1 overflow-x-auto rounded-lg border border-line bg-panel p-1 lg:hidden">
        {VIEWS.map(view => {
          const Icon = view.icon;
          const active = activeView === view.id;
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => setActiveView(view.id)}
              className={`flex min-h-9 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-xs font-bold transition-colors ${
                active
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-brand'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {view.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
