export default function Loading() {
  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-black animate-fade-in"
      style={{ backgroundImage: 'radial-gradient(60% 50% at 50% 42%, rgba(157,0,255,0.10), transparent 70%)' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand/30 border-t-brand"></div>
        <p className="text-brand font-mono text-xs tracking-[0.3em] animate-pulse">loading</p>
      </div>
    </div>
  );
}
