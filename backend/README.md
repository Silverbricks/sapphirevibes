# SapphireVibes Backend API

NestJS + TypeScript + Prisma + PostgreSQL + Redis — REST API for the SapphireVibes e-commerce platform.

## Quick Start

```bash
# 1. Start infrastructure (Postgres + Redis + MailHog)
cd ../deployment
docker compose up -d postgres redis mailhog

# 2. Install dependencies
cd ../backend
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Run migrations + seed
npm run prisma:migrate
npm run prisma:seed

# 5. Start development server
npm run start:dev
```

API runs at: `http://localhost:3001/api/v1`

## Architecture

```
src/
├── auth/           JWT auth, Google OAuth, guards
├── users/          Profile, addresses
├── products/       Catalog, variants, images, badges
├── categories/     15-category tree
├── inventory/      Stock tracking, low-stock alerts
├── cart/           Redis-backed cart with GST calculation
├── orders/         Order lifecycle (Pending → Delivered)
├── payments/       Stripe, PayPal, Afterpay, webhooks
├── subscriptions/  Monthly/yearly Stripe billing
├── memberships/    Free/Silver/Gold/VIP tiers
├── rewards/        Points earn/redeem system
├── promotions/     Coupons, flash sales
├── referrals/      Referral code tracking
├── wishlists/      Product save-for-later
├── reviews/        Verified purchase reviews
├── search/         Full-text + Redis autocomplete
├── notifications/  Email (SendGrid) + SMS (Twilio)
└── admin/          Analytics dashboard
```

## Key Commands

| Command | Description |
|---|---|
| `npm run start:dev` | Hot-reload dev server |
| `npm run prisma:migrate` | Run DB migrations |
| `npm run prisma:seed` | Seed categories, products, admin user |
| `npm run prisma:studio` | Open Prisma Studio at :5555 |
| `npm test` | Run unit tests |
| `npm run test:cov` | Tests with coverage report |
| `npm run typecheck` | TypeScript type check |

## Admin Credentials (after seed)

- Email: `admin@sapphirevibes.com.au`
- Password: `Admin@123!`

## Stripe Test Cards

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Afterpay: Use `afterpay` payment method in Stripe Elements
