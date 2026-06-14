# SapphireVibes Frontend

Next.js 14 + TypeScript + Tailwind CSS — Storefront and admin UI for SapphireVibes.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
# Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# 3. Start dev server
npm run dev
```

App runs at: `http://localhost:3031`

## Folder Structure

```
src/
├── app/            Next.js 14 App Router (pages + layouts)
│   ├── (shop)/     Product catalog, categories, collections
│   ├── (checkout)/ Cart, checkout (3-step), confirmation
│   ├── (auth)/     Login, register, forgot password
│   ├── (account)/  Dashboard, orders, wishlist, rewards, subscription
│   └── (admin)/    Admin dashboard (protected by ADMIN role)
├── components/
│   ├── home/       Homepage sections (hero, collections, festival, reviews)
│   ├── layout/     Header, footer, topbar
│   ├── product/    ProductCard, ProductGrid, BadgeChip, VariantSelector
│   ├── cart/       CartDrawer, CartItem, CartSummary
│   ├── checkout/   3-step checkout flow
│   ├── admin/      DataTable, StatsCard, ChartWrapper
│   └── ui/         Base primitives (Button, Input, Modal, Toast)
├── hooks/          useCart, useAuth, useWishlist, useReveal
├── store/          Zustand stores (cartStore, authStore)
├── services/       API client + service layer
└── utils/          formatCurrency (AUD), formatDate, gstHelpers
```

## Design System

The design follows the `docs/homepage-design.html` reference file with:
- **Palette**: Ink (`#0e1116`), Gold (`#c8a45c`), Cream (`#f4efe6`)
- **Typography**: Cormorant Garamond (serif headings) + Jost (sans body)
- **Motion**: Scroll-reveal animations, gold hover underlines, countdown timers

## Key Commands

| Command | Description |
|---|---|
| `npm run dev` | Dev server with Fast Refresh |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (Jest + RTL) |
| `npm run test:e2e` | Playwright E2E tests |
