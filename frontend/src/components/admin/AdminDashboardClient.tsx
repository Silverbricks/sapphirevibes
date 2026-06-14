'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api.client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';

async function fetchDashboard() {
  const { data } = await apiClient.get('/admin/analytics/dashboard');
  return data.data;
}

async function fetchSales(days = 30) {
  const { data } = await apiClient.get(`/admin/analytics/sales?days=${days}`);
  return data.data;
}

async function fetchProducts() {
  const { data } = await apiClient.get('/admin/analytics/products');
  return data.data;
}

const CUSTOM_TOOLTIP_STYLE = {
  contentStyle: { background: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: 0 },
  labelStyle: { color: 'var(--cream-dim)', fontSize: '0.72rem' },
  itemStyle: { color: 'var(--gold-bright)', fontFamily: 'Jost' },
};

export function AdminDashboardClient() {
  const { data: dash, isLoading: dashLoading } = useQuery({ queryKey: ['admin-dashboard'], queryFn: fetchDashboard });
  const { data: sales } = useQuery({ queryKey: ['admin-sales-30'], queryFn: () => fetchSales(30) });
  const { data: products } = useQuery({ queryKey: ['admin-products'], queryFn: fetchProducts });

  return (
    <div className="px-8 py-10">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-medium mb-1" style={{ color: 'var(--cream)' }}>Dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>
          {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <KpiCard label="Revenue MTD" value={dash ? `$${Number(dash.revenue?.mtd ?? 0).toFixed(2)}` : '…'} sub="Month to date" loading={dashLoading} />
        <KpiCard label="Revenue YTD" value={dash ? `$${Number(dash.revenue?.ytd ?? 0).toFixed(2)}` : '…'} sub="Year to date" loading={dashLoading} />
        <KpiCard label="Orders Today" value={dash?.orders?.today ?? '…'} sub={`${dash?.orders?.total ?? 0} total`} loading={dashLoading} />
        <KpiCard label="Active Subs" value={dash?.subscriptions?.active ?? '…'} sub={`${dash?.customers?.total ?? 0} customers`} loading={dashLoading} />
      </div>

      {/* Alerts */}
      {dash?.alerts?.lowStock > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 mb-8 text-sm" style={{ border: '1px solid #f59e0b', background: 'rgba(245,158,11,.08)', color: '#f59e0b' }}>
          ⚠️ <span><b>{dash.alerts.lowStock}</b> product variants are low on stock</span>
          <a href="/admin/inventory" className="ml-auto text-xs underline" style={{ color: '#f59e0b' }}>View →</a>
        </div>
      )}

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 mb-8">
        {/* Revenue over time */}
        <div style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)', padding: 24 }}>
          <h2 className="font-serif text-lg font-medium mb-6" style={{ color: 'var(--cream)' }}>Revenue — Last 30 Days</h2>
          {sales && sales.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={sales}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c8a45c" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#c8a45c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                <XAxis dataKey="date" stroke="var(--cream-dim)" tick={{ fontSize: 10, fontFamily: 'Jost' }} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="var(--cream-dim)" tick={{ fontSize: 10, fontFamily: 'Jost' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip {...CUSTOM_TOOLTIP_STYLE} formatter={(v: any) => [`$${Number(v).toFixed(2)}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#c8a45c" strokeWidth={2} fill="url(#goldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No sales data yet" />
          )}
        </div>

        {/* Top products */}
        <div style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)', padding: 24 }}>
          <h2 className="font-serif text-lg font-medium mb-6" style={{ color: 'var(--cream)' }}>Top Products</h2>
          {products && products.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={products.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
                <XAxis type="number" stroke="var(--cream-dim)" tick={{ fontSize: 10, fontFamily: 'Jost' }} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="productName" stroke="var(--cream-dim)" tick={{ fontSize: 9, fontFamily: 'Jost' }} width={80} tickFormatter={(v: string) => v.length > 14 ? v.substring(0, 14) + '…' : v} />
                <Tooltip {...CUSTOM_TOOLTIP_STYLE} formatter={(v: any) => [`$${Number(v).toFixed(2)}`, 'Revenue']} />
                <Bar dataKey="_sum.lineTotal" fill="#c8a45c" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No product data yet" />
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/orders', label: 'Manage Orders', sub: 'Update status, tracking, refunds', icon: '📦' },
          { href: '/admin/products', label: 'Add Products', sub: 'Upload catalog, set prices', icon: '🏺' },
          { href: '/admin/promotions', label: 'Create Promotion', sub: 'Coupons, flash sales, bundles', icon: '💸' },
        ].map(({ href, label, sub, icon }) => (
          <a
            key={href}
            href={href}
            className="flex items-start gap-4 p-5 transition-all duration-300"
            style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)', textDecoration: 'none' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(200,164,92,.45)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--line)')}
          >
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--cream)' }}>{label}</p>
              <p className="text-xs" style={{ color: 'var(--cream-dim)' }}>{sub}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, loading }: { label: string; value: string | number; sub: string; loading?: boolean }) {
  return (
    <div className="p-6" style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
      <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--cream-dim)', letterSpacing: '0.18em' }}>{label}</p>
      {loading ? (
        <div className="h-8 w-20 animate-pulse rounded" style={{ background: 'var(--panel)' }} />
      ) : (
        <p className="font-serif text-2xl font-medium" style={{ color: 'var(--gold-bright)' }}>{value}</p>
      )}
      <p className="text-xs mt-1" style={{ color: 'var(--cream-dim)' }}>{sub}</p>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-[240px]" style={{ color: 'var(--cream-dim)', fontSize: '0.85rem' }}>
      {label}
    </div>
  );
}
