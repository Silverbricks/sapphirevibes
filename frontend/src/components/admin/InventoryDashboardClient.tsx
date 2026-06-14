'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, ease } from '@/lib/motion';

interface InventoryItem {
  id: string; name: string; sku: string; qty: number; threshold: number; category: string; backInStockInterest: number;
}

// Seeded from the same product list as ProductsTable
const LOW_STOCK: InventoryItem[] = [
  { id: '2', name: 'Dhana Gold Vase, Large', sku: 'SV-VA-002', qty: 3, threshold: 5, category: 'Vases', backInStockInterest: 0 },
  { id: '7', name: 'Faux Monstera, 70cm', sku: 'SV-PL-007', qty: 3, threshold: 5, category: 'Planters', backInStockInterest: 2 },
  { id: '11', name: 'Hills Gold Wall Shelf', sku: 'SV-SH-011', qty: 2, threshold: 3, category: 'Wall Décor', backInStockInterest: 5 },
  { id: '9', name: 'Bohemian Jute Rug 160×230cm', sku: 'SV-RG-009', qty: 4, threshold: 3, category: 'Rugs', backInStockInterest: 1 },
];

const OUT_OF_STOCK: InventoryItem[] = [
  { id: '4', name: 'Iona Resin Cheetah', sku: 'SV-ST-004', qty: 0, threshold: 3, category: 'Statues', backInStockInterest: 12 },
];

const STATS = [
  { label: 'Total SKUs', value: 12, color: 'var(--gold)' },
  { label: 'Total stock value', value: '$18,422 AUD', color: 'var(--gold-bright)' },
  { label: 'Low stock items', value: 4, color: '#e67e22' },
  { label: 'Out of stock', value: 1, color: '#e25c3e' },
  { label: 'Back-in-stock interest', value: 20, color: '#4a90d9' },
];

export function InventoryDashboardClient() {
  return (
    <div style={{ fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--cream)', marginBottom: 4 }}>Inventory</h1>
        <p style={{ fontSize: '0.86rem', color: 'var(--cream-dim)' }}>Monitor stock levels, low-stock alerts, and customer interest notifications.</p>
      </div>

      {/* Stat cards */}
      <motion.div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 36 }}
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="show"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            transition={{ duration: 0.45, ease, delay: i * 0.06 }}
            style={{ padding: '20px 20px', background: 'var(--ink-soft)', border: '1px solid var(--line)' }}
          >
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Low stock alerts */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '0.86rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>Low stock alerts</h2>
        <div style={{ border: '1px solid var(--line)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', color: 'var(--cream)' }}>
            <thead>
              <tr style={{ background: 'var(--panel)', borderBottom: '1px solid var(--line)' }}>
                {['Product', 'SKU', 'Category', 'Qty remaining', 'Threshold', 'Action'].map(h => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cream-dim)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOW_STOCK.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--cream-dim)', fontSize: '0.78rem' }}>{item.sku}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--cream-dim)' }}>{item.category}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 8px', background: 'rgba(230,126,34,.15)', color: '#e67e22', border: '1px solid rgba(230,126,34,.3)', fontSize: '0.78rem' }}>
                      {item.qty} left
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--cream-dim)' }}>{item.threshold}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <button style={{ padding: '5px 14px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream)', fontSize: '0.76rem', cursor: 'pointer' }}>Reorder</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Out of stock */}
      <section>
        <h2 style={{ fontSize: '0.86rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#e25c3e', marginBottom: 14 }}>Out of stock</h2>
        <div style={{ border: '1px solid var(--line)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', color: 'var(--cream)' }}>
            <thead>
              <tr style={{ background: 'var(--panel)', borderBottom: '1px solid var(--line)' }}>
                {['Product', 'SKU', 'Category', 'Interest', 'Action'].map(h => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cream-dim)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OUT_OF_STOCK.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--cream-dim)', fontSize: '0.78rem' }}>{item.sku}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--cream-dim)' }}>{item.category}</td>
                  <td style={{ padding: '10px 14px' }}>
                    {item.backInStockInterest > 0 && (
                      <span style={{ padding: '2px 8px', background: 'rgba(74,144,217,.15)', color: '#4a90d9', border: '1px solid rgba(74,144,217,.3)', fontSize: '0.78rem' }}>
                        {item.backInStockInterest} customers waiting
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', display: 'flex', gap: 8 }}>
                    <button style={{ padding: '5px 14px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream)', fontSize: '0.76rem', cursor: 'pointer' }}>Restock</button>
                    {item.backInStockInterest > 0 && (
                      <button style={{ padding: '5px 14px', background: 'rgba(74,144,217,.12)', border: '1px solid rgba(74,144,217,.3)', color: '#4a90d9', fontSize: '0.76rem', cursor: 'pointer' }}>
                        Notify {item.backInStockInterest}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
