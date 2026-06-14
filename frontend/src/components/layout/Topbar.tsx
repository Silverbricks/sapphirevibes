export function Topbar() {
  return (
    <div
      className="text-center py-2.5 text-xs tracking-widest uppercase overflow-hidden"
      style={{
        background: 'linear-gradient(90deg,#11151c,#1d242f,#11151c)',
        borderBottom: '1px solid var(--line)',
        color: 'var(--cream-dim)',
        letterSpacing: '0.22em',
      }}
    >
      {/* Mobile: single short message */}
      <span className="sm:hidden">
        Free shipping over{' '}
        <b style={{ color: 'var(--gold-bright)', fontWeight: 500 }}>$150</b>
        {' '}· Afterpay available
      </span>
      {/* Desktop: full message */}
      <span className="hidden sm:inline">
        Free shipping Australia-wide over{' '}
        <b style={{ color: 'var(--gold-bright)', fontWeight: 500 }}>$150</b>
        &nbsp;·&nbsp; Pay later with{' '}
        <b style={{ color: 'var(--gold-bright)', fontWeight: 500 }}>Afterpay</b>{' '}
        &amp;{' '}
        <b style={{ color: 'var(--gold-bright)', fontWeight: 500 }}>Zip</b>
      </span>
    </div>
  );
}
