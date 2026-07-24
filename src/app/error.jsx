'use client';

import { useEffect } from 'react';
import { Terminal } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black font-mono animate-fade-in">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4">
        <div className="w-14 h-14 rounded-lg border border-red-500/40 bg-red-500/10 flex items-center justify-center text-red-500">
          <Terminal className="w-7 h-7" />
        </div>
        <h2 className="text-white text-xl font-bold tracking-tight">error_fatal</h2>
        <p className="text-gray-400 text-xs leading-relaxed">
          Se ha producido un error crítico. Por favor, reinicia el sistema.
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs transition-colors rounded-lg cursor-pointer"
        >
          [ REINICIAR_SISTEMA ]
        </button>
      </div>
    </div>
  );
}
