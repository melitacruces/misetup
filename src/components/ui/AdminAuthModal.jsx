import React from 'react';
import { Loader2, Lock } from 'lucide-react';

export default function AdminAuthModal({
  handleEditorLogin,
  passwordInput,
  setPasswordInput,
  passwordError,
  setPasswordError,
  setShowPasswordPrompt,
  isVerifying
}) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <form
        onSubmit={handleEditorLogin}
        className="bg-surface border border-line-strong p-6 rounded-md w-full max-w-sm flex flex-col gap-4 shadow-[0_0_40px_-10px_rgba(157,0,255,0.45)] animate-pop-in"
      >
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="w-7 h-7 rounded-md bg-brand/15 border border-brand/40 flex items-center justify-center text-brand">
            <Lock className="w-4 h-4" />
          </span>
          /editor
        </h3>
        <p className="text-xs text-gray-400">Ingresa la clave para acceder a los controles de edición.</p>
        <input
          type="password"
          placeholder="••••"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="bg-black border border-line-strong rounded px-3 py-2 text-sm focus:border-brand outline-none text-white tracking-widest font-sans transition-colors"
          autoFocus
        />
        {passwordError && <span className="text-xs text-red-500">{passwordError}</span>}
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => { setShowPasswordPrompt(false); setPasswordError(''); }}
            className="px-4 py-2 text-xs bg-white/5 border border-line hover:bg-white/10 rounded cursor-pointer transition-colors"
          >
            /cancelar
          </button>
          <button
            type="submit"
            disabled={isVerifying || !passwordInput}
            className="px-4 py-2 text-xs bg-brand text-white hover:bg-brand/80 rounded disabled:opacity-50 cursor-pointer transition-colors"
          >
            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : '/verificar'}
          </button>
        </div>
      </form>
    </div>
  );
}
