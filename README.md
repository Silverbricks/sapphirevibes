# SapphireVibes E-Commerce Platform

> Considered home décor for the Australian home — with subscriptions, membership rewards, festival collections, and AR preview.

## Repository Structure

```
sapphirevibes/
├── frontend/    Next.js 14 + TypeScript + Tailwind CSS
├── backend/     NestJS + TypeScript + Prisma + PostgreSQL
├── docs/        Design references, API docs, SRS
└── deployment/  Docker Compose, GitHub Actions, Terraform (AWS)
```

## Getting Started (Local)

### 1. Start infrastructure

```bash
cd deployment
docker compose up -d postgres redis mailhog pgadmin
```

Services:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- MailHog (catch-all email UI): `http://localhost:8025`
- pgAdmin: `http://localhost:5050`

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env       # fill in your values
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

API: `http://localhost:3001/api/v1`

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # set NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
npm run dev
```

Storefront: `http://localhost:3031`

## Phase Roadmap

| Phase | Scope | Timeline |
|---|---|---|
| **Phase 1** | Core store, checkout, subscriptions, memberships, admin | 16–18 weeks |
| **Phase 2** | Flash sales, social sharing, referrals, festival campaigns, push notifications | 10–12 weeks |
| **Phase 3** | AI recommendations, React Native mobile app, advanced analytics | 14–16 weeks |
| **Phase 4** | Multi-vendor, AR preview, voice shopping, affiliate system | 20–24 weeks |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Zustand, TanStack Query |
| Backend | NestJS, TypeScript, Prisma, PostgreSQL, Redis |
| Payments | Stripe (cards, Apple Pay, Google Pay, Afterpay), PayPal |
| Email | SendGrid |
| SMS | Twilio |
| Hosting | AWS (ECS Fargate, RDS, ElastiCache, S3, CloudFront) |
| CI/CD | GitHub Actions |

## Design Reference

See `docs/homepage-design.html` — a complete standalone HTML preview of the homepage design.

Open it directly in a browser for a pixel-perfect preview.
