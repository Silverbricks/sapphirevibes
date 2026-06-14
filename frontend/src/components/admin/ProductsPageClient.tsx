'use client';

import { ProductsTable } from './ProductsTable';

export function ProductsPageClient() {
  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', padding: '0 0 40px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--cream)', marginBottom: 4 }}>Products</h1>
        <p style={{ fontSize: '0.86rem', color: 'var(--cream-dim)' }}>Manage your product catalogue, pricing, inventory, and organisation.</p>
      </div>
      <ProductsTable />
    </div>
  );
}
