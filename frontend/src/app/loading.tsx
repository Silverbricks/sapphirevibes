export default function GlobalLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--ink)' }}
    >
      <div className="flex flex-col items-center gap-6">
        <div
          className="w-px relative overflow-hidden"
          style={{ height: 56, background: 'rgba(200,164,92,0.18)' }}
        >
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              height: '40%',
              background: 'var(--gold)',
              animation: 'sv-load 1.6s linear infinite',
            }}
          />
        </div>
        <p
          className="text-[0.62rem] tracking-[0.28em] uppercase"
          style={{ color: 'var(--cream-dim)' }}
        >
          Loading
        </p>
        <style>{`@keyframes sv-load { from { transform: translateY(-100%) } to { transform: translateY(250%) } }`}</style>
      </div>
    </div>
  );
}
