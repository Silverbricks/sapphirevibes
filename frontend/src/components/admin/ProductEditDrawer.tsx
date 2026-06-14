'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { slideInRight, STD, ease } from '@/lib/motion';
import type { AdminProduct } from '@/services/admin.service';

const BADGE_OPTIONS = ['HOT', 'NEW', 'TRENDING', 'SALE', 'FESTIVAL'];
const STATUS_OPTIONS = ['ACTIVE', 'DRAFT', 'ARCHIVED'] as const;

interface Props {
  product: AdminProduct;
  onSave: (product: AdminProduct) => void;
  onClose: () => void;
}

export function ProductEditDrawer({ product, onSave, onClose }: Props) {
  const isNew = !product.id;
  const [form, setForm] = useState<AdminProduct>({
    ...product,
    id: product.id || `new-${Date.now()}`,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const profit = form.basePrice - (form.costPrice ?? 0);
  const margin = form.costPrice ? ((profit / form.basePrice) * 100).toFixed(1) : null;

  function set<K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function toggleBadge(badge: string) {
    set('badges', form.badges.includes(badge) ? form.badges.filter(b => b !== badge) : [...form.badges, badge]);
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: STD }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, backdropFilter: 'blur(2px)' }}
      />
      {/* Drawer */}
      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="show"
        exit="exit"
        transition={{ duration: STD, ease }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 680,
          background: 'var(--ink-soft)', borderLeft: '1px solid var(--line)',
          overflowY: 'auto', zIndex: 51, display: 'flex', flexDirection: 'column',
          fontFamily: 'Outfit, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--cream)' }}>{isNew ? 'Add product' : `Edit · ${product.name}`}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--cream-dim)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Title & Description */}
          <Section title="Title & Description">
            <Label>Product name</Label>
            <Input value={form.name} onChange={v => set('name', v)} placeholder="e.g. Abstract Brass Wall Art" />
            <Label mt>Description</Label>
            <textarea value={form.description ?? ''} placeholder="Describe the product…" rows={4} style={inputStyle} onChange={e => set('description', e.target.value)} />
          </Section>

          {/* Pricing */}
          <Section title="Pricing">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <Label>Price (AUD, incl. GST)</Label>
                <Input type="number" value={String(form.basePrice)} onChange={v => set('basePrice', parseFloat(v) || 0)} />
              </div>
              <div>
                <Label>Compare-at price</Label>
                <Input type="number" value={String(form.compareAtPrice ?? '')} onChange={v => set('compareAtPrice', parseFloat(v) || null)} placeholder="—" />
              </div>
              <div>
                <Label>Cost per item</Label>
                <Input type="number" value={String(form.costPrice ?? '')} onChange={v => set('costPrice', parseFloat(v) || null)} placeholder="—" />
              </div>
            </div>
            {margin && (
              <div style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--cream-dim)' }}>
                Profit: <b style={{ color: 'var(--gold-bright)' }}>${profit.toFixed(2)}</b> · Margin: <b style={{ color: 'var(--gold-bright)' }}>{margin}%</b>
              </div>
            )}
            {form.compareAtPrice && form.compareAtPrice > form.basePrice && (
              <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(39,174,96,.12)', border: '1px solid rgba(39,174,96,.3)', fontSize: '0.82rem', color: '#27ae60' }}>
                Was {aud(form.compareAtPrice)} · Now {aud(form.basePrice)} · Save {Math.round(((form.compareAtPrice - form.basePrice) / form.compareAtPrice) * 100)}%
              </div>
            )}
          </Section>

          {/* Inventory */}
          <Section title="Inventory">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><Label>SKU</Label><Input value={form.sku ?? ''} onChange={v => set('sku', v)} /></div>
              <div>
                <Label>Quantity on hand</Label>
                <Input type="number" value={String(form.variants[0]?.inventory?.quantityOnHand ?? 0)} onChange={v => {
                  const variants = [...(form.variants ?? [])];
                  if (variants[0]) {
                    const inv = variants[0].inventory;
                    variants[0] = { ...variants[0], inventory: { quantityOnHand: parseInt(v) || 0, quantityReserved: inv?.quantityReserved ?? 0, lowStockThreshold: inv?.lowStockThreshold ?? 5 } };
                  }
                  set('variants', variants);
                }} />
              </div>
              <div>
                <Label>Low stock threshold</Label>
                <Input type="number" value={String(form.variants[0]?.inventory?.lowStockThreshold ?? 5)} onChange={v => {
                  const variants = [...(form.variants ?? [])];
                  if (variants[0]) {
                    const inv = variants[0].inventory;
                    variants[0] = { ...variants[0], inventory: { quantityOnHand: inv?.quantityOnHand ?? 0, quantityReserved: inv?.quantityReserved ?? 0, lowStockThreshold: parseInt(v) || 5 } };
                  }
                  set('variants', variants);
                }} />
              </div>
            </div>
          </Section>

          {/* Organisation */}
          <Section title="Organisation">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <Label>Status</Label>
                <select value={form.status} onChange={e => set('status', e.target.value as typeof STATUS_OPTIONS[number])} style={inputStyle}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label>Featured</Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} id="featured" />
                  <label htmlFor="featured" style={{ fontSize: '0.84rem', color: 'var(--cream-dim)' }}>Show in featured section</label>
                </div>
              </div>
            </div>
            <Label mt>Badges</Label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              {BADGE_OPTIONS.map(b => (
                <button key={b} onClick={() => toggleBadge(b)} style={{
                  padding: '5px 12px', fontSize: '0.72rem', letterSpacing: '0.12em',
                  background: form.badges.includes(b) ? 'var(--gold)' : 'transparent',
                  color: form.badges.includes(b) ? 'var(--ink)' : 'var(--cream-dim)',
                  border: `1px solid ${form.badges.includes(b) ? 'var(--gold)' : 'var(--line)'}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {b}
                </button>
              ))}
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--line)', display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => onSave({ ...form, updatedAt: new Date().toISOString(), isActive: form.status === 'ACTIVE' })}
            style={{ padding: '10px 24px', background: 'var(--gold)', color: 'var(--ink)', border: 'none', fontWeight: 600, fontSize: '0.82rem', letterSpacing: '0.12em', cursor: 'pointer' }}
          >
            {isNew ? 'Create product' : 'Save changes'}
          </button>
          <button
            onClick={() => onSave({ ...form, status: 'DRAFT', isActive: false, updatedAt: new Date().toISOString() })}
            style={{ padding: '10px 24px', background: 'transparent', color: 'var(--cream)', border: '1px solid var(--line)', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Save as draft
          </button>
          <button onClick={onClose} style={{ padding: '10px 18px', background: 'transparent', color: 'var(--cream-dim)', border: 'none', fontSize: '0.82rem', cursor: 'pointer', marginLeft: 'auto' }}>
            Discard
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────
function aud(n: number) { return `$${n.toFixed(2)}`; }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', background: 'var(--ink)', border: '1px solid var(--line)',
  color: 'var(--cream)', fontSize: '0.86rem', outline: 'none', boxSizing: 'border-box',
};

function Input({ value, onChange, type = 'text', placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />;
}

function Label({ children, mt }: { children: React.ReactNode; mt?: boolean }) {
  return <div style={{ fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: 6, marginTop: mt ? 14 : 0 }}>{children}</div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ fontSize: '0.82rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>{title}</h3>
      <div style={{ padding: '18px 20px', background: 'var(--ink)', border: '1px solid var(--line)' }}>{children}</div>
    </div>
  );
}
