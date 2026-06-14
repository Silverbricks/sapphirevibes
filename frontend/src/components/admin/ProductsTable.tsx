'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, STD, ease } from '@/lib/motion';
import type { AdminProduct, AdminProductFilters, BulkPriceRule } from '@/services/admin.service';
import { ProductEditDrawer } from './ProductEditDrawer';
import { BulkPriceModal } from './BulkPriceModal';

// ── Seed data (12 realistic home décor products) ────────────────────────────
const SEED_PRODUCTS: AdminProduct[] = [
  { id: '1', name: 'Arles Brass Wall Sconce', slug: 'arles-brass-wall-sconce', sku: 'SV-WS-001', status: 'ACTIVE', basePrice: 189.00, compareAtPrice: 249.00, costPrice: 72.00, badges: ['SALE'], images: [], variants: [{ id: 'v1', name: 'Default', sku: 'SV-WS-001-D', priceModifier: 0, inventory: { quantityOnHand: 14, quantityReserved: 2, lowStockThreshold: 5 } }], isActive: true, isFeatured: true, category: { name: 'Lighting', slug: 'lighting' }, createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-05-10T00:00:00Z' },
  { id: '2', name: 'Dhana Gold Vase, Large', slug: 'dhana-gold-vase-large', sku: 'SV-VA-002', status: 'ACTIVE', basePrice: 71.50, compareAtPrice: null, costPrice: 28.00, badges: ['HOT'], images: [], variants: [{ id: 'v2', name: 'Default', sku: 'SV-VA-002-D', priceModifier: 0, inventory: { quantityOnHand: 4, quantityReserved: 1, lowStockThreshold: 5 } }], isActive: true, isFeatured: false, category: { name: 'Vases', slug: 'vases' }, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-05-15T00:00:00Z' },
  { id: '3', name: 'Nube Metal Mirror', slug: 'nube-metal-mirror', sku: 'SV-MI-003', status: 'ACTIVE', basePrice: 242.00, compareAtPrice: null, costPrice: 95.00, badges: ['TRENDING'], images: [], variants: [{ id: 'v3', name: 'Default', sku: 'SV-MI-003-D', priceModifier: 0, inventory: { quantityOnHand: 8, quantityReserved: 0, lowStockThreshold: 3 } }], isActive: true, isFeatured: true, category: { name: 'Mirrors', slug: 'mirrors' }, createdAt: '2026-02-15T00:00:00Z', updatedAt: '2026-05-20T00:00:00Z' },
  { id: '4', name: 'Iona Resin Cheetah', slug: 'iona-resin-cheetah', sku: 'SV-ST-004', status: 'ACTIVE', basePrice: 181.50, compareAtPrice: null, costPrice: 68.00, badges: ['NEW'], images: [], variants: [{ id: 'v4', name: 'Default', sku: 'SV-ST-004-D', priceModifier: 0, inventory: { quantityOnHand: 0, quantityReserved: 0, lowStockThreshold: 3 } }], isActive: true, isFeatured: false, category: { name: 'Statues', slug: 'statues' }, createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-05-25T00:00:00Z' },
  { id: '5', name: 'Abstract Brass Wall Art', slug: 'abstract-brass-wall-art', sku: 'SV-WA-005', status: 'ACTIVE', basePrice: 242.00, compareAtPrice: 320.00, costPrice: 90.00, badges: ['SALE', 'HOT'], images: [], variants: [{ id: 'v5', name: 'Default', sku: 'SV-WA-005-D', priceModifier: 0, inventory: { quantityOnHand: 6, quantityReserved: 1, lowStockThreshold: 4 } }], isActive: true, isFeatured: true, category: { name: 'Wall Art', slug: 'wall-art' }, createdAt: '2026-01-20T00:00:00Z', updatedAt: '2026-05-28T00:00:00Z' },
  { id: '6', name: 'Marbled Travertine Tray', slug: 'marbled-travertine-tray', sku: 'SV-TR-006', status: 'ACTIVE', basePrice: 89.00, compareAtPrice: null, costPrice: 34.00, badges: [], images: [], variants: [{ id: 'v6', name: 'Default', sku: 'SV-TR-006-D', priceModifier: 0, inventory: { quantityOnHand: 22, quantityReserved: 0, lowStockThreshold: 5 } }], isActive: true, isFeatured: false, category: { name: 'Decorative', slug: 'decorative' }, createdAt: '2026-03-10T00:00:00Z', updatedAt: '2026-05-01T00:00:00Z' },
  { id: '7', name: 'Faux Monstera, 70cm', slug: 'faux-monstera-70cm', sku: 'SV-PL-007', status: 'ACTIVE', basePrice: 71.50, compareAtPrice: null, costPrice: 26.00, badges: ['TRENDING'], images: [], variants: [{ id: 'v7', name: 'Default', sku: 'SV-PL-007-D', priceModifier: 0, inventory: { quantityOnHand: 3, quantityReserved: 0, lowStockThreshold: 5 } }], isActive: true, isFeatured: false, category: { name: 'Planters', slug: 'planters' }, createdAt: '2026-03-15T00:00:00Z', updatedAt: '2026-05-12T00:00:00Z' },
  { id: '8', name: 'Diwali Brass Diya Set', slug: 'diwali-brass-diya-set', sku: 'SV-DW-008', status: 'ACTIVE', basePrice: 54.00, compareAtPrice: 74.00, costPrice: 20.00, badges: ['FESTIVAL', 'SALE'], images: [], variants: [{ id: 'v8', name: 'Default', sku: 'SV-DW-008-D', priceModifier: 0, inventory: { quantityOnHand: 18, quantityReserved: 3, lowStockThreshold: 8 } }], isActive: true, isFeatured: true, category: { name: 'Festival', slug: 'festival' }, createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-05-25T00:00:00Z' },
  { id: '9', name: 'Bohemian Jute Rug 160×230cm', slug: 'bohemian-jute-rug', sku: 'SV-RG-009', status: 'ACTIVE', basePrice: 389.00, compareAtPrice: null, costPrice: 152.00, badges: [], images: [], variants: [{ id: 'v9', name: 'Default', sku: 'SV-RG-009-D', priceModifier: 0, inventory: { quantityOnHand: 5, quantityReserved: 1, lowStockThreshold: 3 } }], isActive: true, isFeatured: false, category: { name: 'Rugs', slug: 'rugs' }, createdAt: '2026-02-28T00:00:00Z', updatedAt: '2026-05-18T00:00:00Z' },
  { id: '10', name: 'Linen Textured Cushion, Terracotta', slug: 'linen-cushion-terracotta', sku: 'SV-CU-010', status: 'ACTIVE', basePrice: 49.00, compareAtPrice: 69.00, costPrice: 16.00, badges: ['SALE'], images: [], variants: [{ id: 'v10', name: 'Default', sku: 'SV-CU-010-D', priceModifier: 0, inventory: { quantityOnHand: 30, quantityReserved: 0, lowStockThreshold: 10 } }], isActive: true, isFeatured: false, category: { name: 'Cushions', slug: 'cushions' }, createdAt: '2026-04-10T00:00:00Z', updatedAt: '2026-05-05T00:00:00Z' },
  { id: '11', name: 'Hills Gold Wall Shelf', slug: 'hills-gold-wall-shelf', sku: 'SV-SH-011', status: 'ACTIVE', basePrice: 302.50, compareAtPrice: null, costPrice: 118.00, badges: ['HOT'], images: [], variants: [{ id: 'v11', name: 'Default', sku: 'SV-SH-011-D', priceModifier: 0, inventory: { quantityOnHand: 2, quantityReserved: 0, lowStockThreshold: 3 } }], isActive: true, isFeatured: true, category: { name: 'Wall Décor', slug: 'wall-decor' }, createdAt: '2026-01-05T00:00:00Z', updatedAt: '2026-05-22T00:00:00Z' },
  { id: '12', name: 'Artisan Ceramic Bowl Set', slug: 'artisan-ceramic-bowl-set', sku: 'SV-CB-012', status: 'DRAFT', basePrice: 139.00, compareAtPrice: null, costPrice: 52.00, badges: ['NEW'], images: [], variants: [{ id: 'v12', name: 'Default', sku: 'SV-CB-012-D', priceModifier: 0, inventory: { quantityOnHand: 12, quantityReserved: 0, lowStockThreshold: 5 } }], isActive: false, isFeatured: false, category: { name: 'Decorative', slug: 'decorative' }, createdAt: '2026-05-20T00:00:00Z', updatedAt: '2026-05-28T00:00:00Z' },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function aud(n: number) { return `$${n.toFixed(2)}`; }

function savePercent(price: number, compareAt: number) {
  return Math.round(((compareAt - price) / compareAt) * 100);
}

function stockLevel(p: AdminProduct): 'in_stock' | 'low' | 'out_of_stock' {
  const v = p.variants[0];
  if (!v?.inventory) return 'out_of_stock';
  const avail = v.inventory.quantityOnHand - v.inventory.quantityReserved;
  if (avail === 0) return 'out_of_stock';
  if (avail <= v.inventory.lowStockThreshold) return 'low';
  return 'in_stock';
}

const BADGE_COLORS: Record<string, string> = {
  HOT: '#e25c3e', NEW: '#4a90d9', TRENDING: '#9b59b6', SALE: '#27ae60', FESTIVAL: '#e4c884',
};

// ── Component ───────────────────────────────────────────────────────────────
export function ProductsTable() {
  const [products, setProducts] = useState<AdminProduct[]>(SEED_PRODUCTS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<AdminProductFilters>({});
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [showBulkPrice, setShowBulkPrice] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: string; field: 'price' | 'compareAt' } | null>(null);
  const [cellValue, setCellValue] = useState('');
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock' | 'updatedAt'>('updatedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.includes(search));
    if (filters.status) list = list.filter(p => p.status === filters.status);
    if (filters.badge) list = list.filter(p => p.badges.includes(filters.badge!));
    if (filters.stockLevel) list = list.filter(p => stockLevel(p) === filters.stockLevel);
    list.sort((a, b) => {
      let av: number | string = sortField === 'name' ? a.name : sortField === 'price' ? a.basePrice : sortField === 'stock' ? (a.variants[0]?.inventory?.quantityOnHand ?? 0) : a.updatedAt;
      let bv: number | string = sortField === 'name' ? b.name : sortField === 'price' ? b.basePrice : sortField === 'stock' ? (b.variants[0]?.inventory?.quantityOnHand ?? 0) : b.updatedAt;
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [products, search, filters, sortField, sortDir]);

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p.id)));
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  function commitCellEdit() {
    if (!editingCell) return;
    const val = parseFloat(cellValue);
    if (isNaN(val)) { setEditingCell(null); return; }
    setProducts(ps => ps.map(p => {
      if (p.id !== editingCell.id) return p;
      return editingCell.field === 'price' ? { ...p, basePrice: val } : { ...p, compareAtPrice: val };
    }));
    setEditingCell(null);
  }

  function applyBulkPrice(rule: BulkPriceRule) {
    setProducts(ps => ps.map(p => {
      if (!selected.has(p.id)) return p;
      let newPrice = p.basePrice;
      if (rule.type === 'set') newPrice = rule.value;
      else if (rule.type === 'increase_amount') newPrice = p.basePrice + rule.value;
      else if (rule.type === 'decrease_amount') newPrice = Math.max(0, p.basePrice - rule.value);
      else if (rule.type === 'increase_percent') newPrice = p.basePrice * (1 + rule.value / 100);
      else if (rule.type === 'decrease_percent') newPrice = p.basePrice * (1 - rule.value / 100);
      const compareAt = rule.clearCompareAt ? null : rule.applyToCompareAt ? newPrice * 1.2 : p.compareAtPrice;
      return { ...p, basePrice: Math.round(newPrice * 100) / 100, compareAtPrice: compareAt };
    }));
    setShowBulkPrice(false);
    setSelected(new Set());
  }

  function handleSave(updated: AdminProduct) {
    setProducts(ps => ps.map(p => p.id === updated.id ? updated : p));
    setEditingProduct(null);
  }

  function handleCreate(product: AdminProduct) {
    setProducts(ps => [product, ...ps]);
    setEditingProduct(null);
  }

  const statusColor = (s: string) => s === 'ACTIVE' ? '#27ae60' : s === 'DRAFT' ? '#6E7686' : '#e25c3e';

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Search by name or SKU…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', background: 'var(--ink-soft)', border: '1px solid var(--line)', color: 'var(--cream)', fontSize: '0.86rem', outline: 'none' }}
        />
        <select value={filters.status ?? ''} onChange={e => setFilters(f => ({ ...f, status: e.target.value || undefined }))} style={{ padding: '8px 12px', background: 'var(--ink-soft)', border: '1px solid var(--line)', color: 'var(--cream)', fontSize: '0.82rem' }}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select value={filters.stockLevel ?? ''} onChange={e => setFilters(f => ({ ...f, stockLevel: e.target.value as 'in_stock' | 'low' | 'out_of_stock' | undefined || undefined }))} style={{ padding: '8px 12px', background: 'var(--ink-soft)', border: '1px solid var(--line)', color: 'var(--cream)', fontSize: '0.82rem' }}>
          <option value="">All stock levels</option>
          <option value="in_stock">In stock</option>
          <option value="low">Low stock</option>
          <option value="out_of_stock">Out of stock</option>
        </select>
        <select value={filters.badge ?? ''} onChange={e => setFilters(f => ({ ...f, badge: e.target.value || undefined }))} style={{ padding: '8px 12px', background: 'var(--ink-soft)', border: '1px solid var(--line)', color: 'var(--cream)', fontSize: '0.82rem' }}>
          <option value="">All badges</option>
          {['HOT','NEW','TRENDING','SALE','FESTIVAL'].map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <button
          onClick={() => setEditingProduct({ id: '', name: '', slug: '', status: 'DRAFT', basePrice: 0, badges: [], images: [], variants: [], isActive: false, isFeatured: false, createdAt: '', updatedAt: '' })}
          style={{ padding: '8px 18px', background: 'var(--gold)', color: 'var(--ink)', border: 'none', fontWeight: 600, fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          + Add product
        </button>
      </div>

      {/* ── Bulk action bar ── */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: STD }}
            style={{ overflow: 'hidden', marginBottom: 12 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'var(--panel)', border: '1px solid var(--line)', fontSize: '0.82rem', color: 'var(--cream-dim)' }}>
              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{selected.size} selected</span>
              <button onClick={() => setShowBulkPrice(true)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream)', cursor: 'pointer', fontSize: '0.78rem' }}>Edit price</button>
              <button onClick={() => { setProducts(ps => ps.map(p => selected.has(p.id) ? { ...p, status: 'ARCHIVED', isActive: false } : p)); setSelected(new Set()); }} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream)', cursor: 'pointer', fontSize: '0.78rem' }}>Archive</button>
              <button onClick={() => { setProducts(ps => ps.filter(p => !selected.has(p.id))); setSelected(new Set()); }} style={{ padding: '6px 14px', background: 'rgba(226,92,62,0.15)', border: '1px solid rgba(226,92,62,.4)', color: '#e25c3e', cursor: 'pointer', fontSize: '0.78rem' }}>Delete</button>
              <button onClick={() => setSelected(new Set())} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--cream-dim)', cursor: 'pointer', fontSize: '0.82rem' }}>✕ Clear</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table ── */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--line)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', color: 'var(--cream)' }}>
          <thead>
            <tr style={{ background: 'var(--panel)', borderBottom: '1px solid var(--line)' }}>
              <th style={{ padding: '10px 14px', width: 36 }}>
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} />
              </th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.74rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>Product</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.74rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-dim)', cursor: 'pointer' }} onClick={() => { setSortField('stock'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>
                Inventory {sortField === 'stock' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.74rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-dim)', cursor: 'pointer' }} onClick={() => { setSortField('price'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>
                Price {sortField === 'price' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.74rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>Status</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.74rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>Category</th>
              <th style={{ padding: '10px 14px', width: 36 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const sl = stockLevel(p);
              const qty = (p.variants[0]?.inventory?.quantityOnHand ?? 0) - (p.variants[0]?.inventory?.quantityReserved ?? 0);
              const isEditingPrice = editingCell?.id === p.id && editingCell.field === 'price';
              const isEditingCompare = editingCell?.id === p.id && editingCell.field === 'compareAt';
              const margin = p.costPrice ? ((p.basePrice - p.costPrice) / p.basePrice * 100).toFixed(1) : null;

              return (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                  style={{ borderBottom: '1px solid var(--line)', background: selected.has(p.id) ? 'rgba(200,164,92,.06)' : 'var(--ink-soft)' }}
                >
                  <td style={{ padding: '10px 14px' }}>
                    <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleOne(p.id)} />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 40, height: 40, background: 'var(--panel)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--cream-dim)' }}>IMG</div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--cream-dim)' }}>{p.sku}</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 3 }}>
                          {p.badges.map(b => (
                            <span key={b} style={{ fontSize: '0.6rem', padding: '2px 6px', background: BADGE_COLORS[b] ?? 'var(--gold)', color: '#fff', letterSpacing: '0.1em' }}>{b}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{qty} in stock</span>
                      {sl === 'low' && <span style={{ fontSize: '0.66rem', padding: '2px 6px', background: 'rgba(230,126,34,.2)', color: '#e67e22', border: '1px solid rgba(230,126,34,.4)' }}>Low</span>}
                      {sl === 'out_of_stock' && <span style={{ fontSize: '0.66rem', padding: '2px 6px', background: 'rgba(226,92,62,.2)', color: '#e25c3e', border: '1px solid rgba(226,92,62,.4)' }}>Out of stock</span>}
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Inline price edit */}
                      {isEditingPrice ? (
                        <input
                          autoFocus
                          value={cellValue}
                          onChange={e => setCellValue(e.target.value)}
                          onBlur={commitCellEdit}
                          onKeyDown={e => e.key === 'Enter' && commitCellEdit()}
                          style={{ width: 80, padding: '2px 6px', background: 'var(--panel)', border: '1px solid var(--gold)', color: 'var(--cream)', fontSize: '0.84rem', outline: 'none' }}
                        />
                      ) : (
                        <span style={{ cursor: 'text', color: p.compareAtPrice ? 'var(--gold-bright)' : 'var(--cream)' }}
                          onClick={() => { setEditingCell({ id: p.id, field: 'price' }); setCellValue(String(p.basePrice)); }}>
                          {aud(p.basePrice)}
                        </span>
                      )}
                      {p.compareAtPrice && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {isEditingCompare ? (
                            <input
                              autoFocus
                              value={cellValue}
                              onChange={e => setCellValue(e.target.value)}
                              onBlur={commitCellEdit}
                              onKeyDown={e => e.key === 'Enter' && commitCellEdit()}
                              style={{ width: 80, padding: '2px 6px', background: 'var(--panel)', border: '1px solid var(--gold)', color: 'var(--cream)', fontSize: '0.78rem', outline: 'none' }}
                            />
                          ) : (
                            <span style={{ textDecoration: 'line-through', color: 'var(--cream-dim)', fontSize: '0.78rem', cursor: 'text' }}
                              onClick={() => { setEditingCell({ id: p.id, field: 'compareAt' }); setCellValue(String(p.compareAtPrice)); }}>
                              {aud(p.compareAtPrice)}
                            </span>
                          )}
                          <span style={{ fontSize: '0.66rem', padding: '2px 6px', background: 'rgba(39,174,96,.2)', color: '#27ae60', border: '1px solid rgba(39,174,96,.3)' }}>
                            Save {savePercent(p.basePrice, p.compareAtPrice)}%
                          </span>
                        </div>
                      )}
                      {margin && <span style={{ fontSize: '0.68rem', color: 'var(--cream-dim)' }}>Margin {margin}%</span>}
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: '0.72rem', padding: '3px 8px', background: `${statusColor(p.status)}22`, color: statusColor(p.status), border: `1px solid ${statusColor(p.status)}44` }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--cream-dim)', fontSize: '0.8rem' }}>{p.category?.name}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <button onClick={() => setEditingProduct(p)} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.82rem' }}>Edit</button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Drawers & Modals ── */}
      <AnimatePresence>
        {editingProduct && (
          <ProductEditDrawer
            product={editingProduct}
            onSave={editingProduct.id ? handleSave : handleCreate}
            onClose={() => setEditingProduct(null)}
          />
        )}
        {showBulkPrice && (
          <BulkPriceModal
            selectedIds={Array.from(selected)}
            products={products.filter(p => selected.has(p.id))}
            onApply={applyBulkPrice}
            onClose={() => setShowBulkPrice(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
