import { Check, ChevronRight, Circle, Route, RotateCcw, X } from 'lucide-react';

const CHALLENGES = [
  {
    id: 'section',
    title: 'agrega una sección',
    description: 'Crea una categoría propia desde la barra lateral.',
  },
  {
    id: 'equipment',
    title: 'crea un elemento',
    description: 'Guarda un equipo, software o servicio.',
  },
  {
    id: 'reorder',
    title: 'reordena tu setup',
    description: 'Arrastra dos tarjetas o usa sus flechas.',
  },
  {
    id: 'export',
    title: 'exporta el resultado',
    description: 'Descarga una copia portable en JSON.',
  },
];

export default function GuidePanel({
  progress,
  onClose,
  onShowChallenge,
  onResetProgress,
}) {
  const completed = CHALLENGES.filter(challenge => progress[challenge.id]).length;
  const percentage = (completed / CHALLENGES.length) * 100;

  return (
    <aside
      aria-label="Guía interactiva"
      className="fixed inset-x-3 bottom-3 z-[60] max-h-[78vh] overflow-y-auto rounded-lg border border-brand/35 bg-panel/95 p-4 shadow-[0_12px_48px_rgba(0,0,0,0.25)] backdrop-blur-xl animate-pop-in sm:left-auto sm:right-5 sm:w-[360px]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
            <Route className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              modo guiado
            </p>
            <h2 className="mt-1 text-sm font-bold text-white">
              {completed === CHALLENGES.length
                ? 'setup explorado'
                : `${completed}/${CHALLENGES.length} retos`}
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Cerrar guía"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-lg bg-black">
        <div
          className="h-full rounded-lg bg-brand transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-4 space-y-2">
        {CHALLENGES.map(challenge => {
          const done = Boolean(progress[challenge.id]);
          return (
            <button
              key={challenge.id}
              type="button"
              onClick={() => !done && onShowChallenge(challenge.id)}
              disabled={done}
              className={`flex min-h-16 w-full items-center gap-3 rounded-lg border px-3 text-left transition-colors ${
                done
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border-line bg-black hover:border-brand/50'
              }`}
            >
              {done ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-black">
                  <Check className="h-3.5 w-3.5" />
                </span>
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-gray-500" />
              )}
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-xs font-bold lowercase ${
                    done ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  {challenge.title}
                </span>
                <span className="mt-1 block font-sans text-xs leading-relaxed text-gray-400">
                  {challenge.description}
                </span>
              </span>
              {!done && <ChevronRight className="h-4 w-4 text-gray-500" />}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onResetProgress}
        className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-gray-300"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        reiniciar retos
      </button>
    </aside>
  );
}
