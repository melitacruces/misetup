import React from 'react';
import { Menu, Lock, Unlock, Plus, Loader2 } from 'lucide-react';

export default function Header({
  CATEGORIES,
  activeTab,
  setIsMobileMenuOpen,
  isEditorMode,
  setShowPasswordPrompt,
  handleEditorLogin,
  logoutEditor,
  handleAddItem,
  isPending,
  demo
}) {
  const currentCategory = CATEGORIES[activeTab] || { icon: <i className="fa-solid fa-folder"></i>, title: '...' };

  return (
    <header className="h-20 flex flex-col justify-center px-4 sm:px-6 lg:px-6 border-b border-line sticky top-0 bg-[#000000]/90 backdrop-blur-md z-10 shrink-0 relative">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 text-gray-300 hover:text-brand hover:bg-brand/10 rounded cursor-pointer transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="flex items-center gap-2.5 text-white font-bold text-xl">
            <span className="text-brand flex items-center text-lg">{currentCategory.icon}</span>
            {currentCategory.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {!isEditorMode ? (
            <button
              onClick={() => demo ? handleEditorLogin() : setShowPasswordPrompt(true)}
              className="flex items-center justify-center gap-2 p-2 sm:px-3 sm:py-2 border border-brand text-brand hover:bg-brand/10 text-xs font-bold rounded transition-all shrink-0 cursor-pointer min-w-[32px] min-h-[32px]"
              title="Modo Editor"
            >
              <Lock className="w-4 h-4 text-brand shrink-0" />
              <span className="hidden sm:inline">editor</span>
            </button>
          ) : (
            <button
              onClick={logoutEditor}
              className="flex items-center justify-center gap-2 p-2 sm:px-3 sm:py-2 border border-brand/50 text-brand hover:bg-brand/10 hover:border-brand text-xs font-bold rounded transition-all shrink-0 cursor-pointer min-w-[32px] min-h-[32px]"
              title="Modo Espectador"
            >
              <Unlock className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">viewer</span>
            </button>
          )}

          {isEditorMode && (
            <button
              onClick={handleAddItem}
              disabled={isPending}
              className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 bg-brand text-white hover:bg-brand/80 disabled:opacity-50 text-xs font-bold rounded transition-opacity shrink-0 cursor-pointer min-w-[32px] min-h-[32px]"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">new</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
