'use client';

import { useState } from 'react';

const ACTIVE_PROMOTIONS = [
  { code: 'WELCOME10',  type: '10% off', usage: 0,  limit: null,  active: true  },
  { code: 'SAPPHIRE15', type: '15% off', usage: 0,  limit: 100,   active: true  },
  { code: 'FREESHIP',   type: 'Free shipping', usage: 0, limit: null, active: true },
];

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState(ACTIVE_PROMOTIONS);

  function toggle(code: string) {
    setPromos(p => p.map(pr => pr.code === code ? { ...pr, active: !pr.active } : pr));
  }

  return (
    <div style={{ padding: '32px 36px' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--cream)' }}>Promotions</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--cream-dim)', marginTop: 4 }}>Manage coupon codes and discount campaigns</p>
        </div>
      </div>

      <div style={{ border: '1px solid var(--line)', overflow: 'hidden', marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
              {['Code', 'Type', 'Used', 'Limit', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--cream-dim)', fontWeight: 500, fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {promos.map(pr => (
              <tr key={pr.code} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--cream)', fontWeight: 600, fontFamily: 'Jost', letterSpacing: '0.1em' }}>{pr.code}</td>
                <td style={{ padding: '12px 16px', color: 'var(--cream-dim)' }}>{pr.type}</td>
                <td style={{ padding: '12px 16px', color: 'var(--cream-dim)' }}>{pr.usage}</td>
                <td style={{ padding: '12px 16px', color: 'var(--cream-dim)' }}>{pr.limit ?? '∞'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: pr.active ? '#34d399' : '#f87171' }}>{pr.active ? 'Active' : 'Paused'}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => toggle(pr.code)}
                    style={{ padding: '4px 12px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream-dim)', fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '0.1em' }}
                  >
                    {pr.active ? 'Pause' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: 20, border: '1px solid var(--line)', background: 'var(--ink-soft)', fontSize: '0.84rem', color: 'var(--cream-dim)' }}>
        <p style={{ color: 'var(--gold)', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>Note</p>
        Coupon validation is handled server-side via <code style={{ color: 'var(--cream)' }}>/api/coupons/validate</code>. Add new codes to that API route to make them redeemable.
      </div>
    </div>
  );
}
