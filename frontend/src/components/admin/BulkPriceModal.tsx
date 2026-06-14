'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { scaleIn, STD, ease } from '@/lib/motion';
import type { AdminProduct, BulkPriceRule } from '@/services/admin.service';

interface Props {
  selectedIds: string[];
  products: AdminProduct[];
  onApply: (rule: BulkPriceRule) => void;
  onClose: () => void;
}

const RULE_TYPES: Array<{ value: BulkPriceRule['type']; label: string }> = [
  { value: 'set', label: 'Set to fixed price' },
  { value: 'increase_amount', label: 'Increase by $' },
  { value: 'decrease_amount', label: 'Decrease by $' },
  { value: 'increase_percent', label: 'Increase by %' },
  { value: 'decrease_percent', label: 'Decrease by %' },
];

function preview(price: number, rule: BulkPriceRule): number {
  switch (rule.type) {
    case 'set': return rule.value;
    case 'increase_amount': return price + rule.value;
    case 'decrease_amount': return Math.max(0, price - rule.value);
    case 'increase_percent': return price * (1 + rule.value / 100);
    case 'decrease_percent': return price * (1 - rule.value / 100);
  }
}

export function BulkPriceModal({ products, onApply, onClose }: Props) {
  const [rule, setRule] = useState<BulkPriceRule>({ type: 'set', value: 0, clearCompareAt: false, applyToCompareAt: false });

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60 }} />
      <motion.div
        variants={scaleIn} initial="hidden" animate="show" exit="hidden"
        transition={{ duration: STD, ease }}
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '100%', maxWidth: 560, background: 'var(--ink-soft)', border: '1px solid var(--line)',
          zIndex: 61, fontFamily: 'Outfit, sans-serif',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cream)' }}>Edit price · {products.length} products</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--cream-dim)', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: 6 }}>Adjustment type</div>
              <select value={rule.type} onChange={e => setRule(r => ({ ...r, type: e.target.value as BulkPriceRule['type'] }))}
                style={{ width: '100%', padding: '8px 12px', background: 'var(--ink)', border: '1px solid var(--line)', color: 'var(--cream)', fontSize: '0.86rem' }}>
                {RULE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: 6 }}>Value</div>
              <input type="number" value={rule.value} onChange={e => setRule(r => ({ ...r, value: parseFloat(e.target.value) || 0 }))}
                style={{ width: '100%', padding: '8px 12px', background: 'var(--ink)', border: '1px solid var(--line)', color: 'var(--cream)', fontSize: '0.86rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: 'var(--cream-dim)', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!rule.clearCompareAt} onChange={e => setRule(r => ({ ...r, clearCompareAt: e.target.checked }))} />
            Clear compare-at price (remove sale)
          </label>

          {/* Preview */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>Preview</div>
            <div style={{ overflowY: 'auto', maxHeight: 200, border: '1px solid var(--line)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', color: 'var(--cream)' }}>
                <thead>
                  <tr style={{ background: 'var(--panel)' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 400, color: 'var(--cream-dim)' }}>Product</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 400, color: 'var(--cream-dim)' }}>Current</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 400, color: 'var(--cream-dim)' }}>New price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '7px 12px' }}>{p.name}</td>
                      <td style={{ padding: '7px 12px', textAlign: 'right', color: 'var(--cream-dim)' }}>${p.basePrice.toFixed(2)}</td>
                      <td style={{ padding: '7px 12px', textAlign: 'right', color: 'var(--gold-bright)', fontWeight: 500 }}>${preview(p.basePrice, rule).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line)', display: 'flex', gap: 10 }}>
          <button onClick={() => onApply(rule)} style={{ padding: '10px 24px', background: 'var(--gold)', color: 'var(--ink)', border: 'none', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
            Apply to {products.length} products
          </button>
          <button onClick={onClose} style={{ padding: '10px 18px', background: 'transparent', color: 'var(--cream-dim)', border: '1px solid var(--line)', fontSize: '0.82rem', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </motion.div>
    </>
  );
}
