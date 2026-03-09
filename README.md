# Angular Cloudflare Starter

A production-ready full-stack starter template built on **Angular 21** with **Cloudflare Workers**. Features SSR via `@angular/ssr`, comprehensive Cloudflare service integrations, clean architecture following SOLID principles, and specification-driven development with OpenSpec.

> **Full Project Specification:** See [`openspec/config.yaml`](./openspec/config.yaml) for complete technical requirements, architecture patterns, and coding conventions.

## Key Features

### Frontend

- **Angular 21+** — Standalone components, signals, `input()`/`output()`, `OnPush` change detection, SSR
- **Angular Router** — Lazy-loaded routes, guards, resolvers
- **Angular Forms** — Reactive forms with signals
- **TypeScript 5.9+** — Strict type safety, **no `any` type allowed**
- **TailwindCSS 4.2+** — Utility-first CSS with mobile-first responsive design
- **Semantic HTML & ARIA** — AXE-compliant accessibility, skip links, keyboard nav, focus management
- **DaisyUI 5.5+** — UI components with customizable themes (default: **light**)
- **Lucide Angular** — Icon library (`lucide-angular`)
- **angular-i18next** — Frontend internationalization with centralized translation files
- **Form Layouts** — Following [TailwindCSS form layouts](https://tailwindcss.com/plus/ui-blocks/application-ui/forms/form-layouts)

### Backend

- **Hono 4.12+** — Fast, edge-native API framework with SOLID principles
- **i18next** — Backend internationalization with Hono integration
- **CSRF Protection** — Hono `csrf()` middleware for all mutation endpoints
- **CORS Protection** — Configurable origins via `wrangler.jsonc` variables
- **Rate Limiting** — Edge-native via Cloudflare `RateLimit` bindings with `hono-rate-limiter`
- **Secure Headers** — CSP, X-Frame-Options, etc. via `hono/secure-headers`
- **Logger Service** — Centralized logging with correlation ID and sensitive data sanitization
- **Global Error Handling** — Automatic error catching and logging for production debugging
- **Zod Validation** — Request validation via `@hono/zod-validator` middleware

### Architecture

- **Clean Architecture** — Engine/Facade and Service layers with SOLID principles
- **Dependency Injection** — Angular built-in DI (frontend), Awilix (backend) with interface-based contracts
- **Layer Discipline** — Only create engine layer when orchestrating 2+ services
- **Drizzle ORM** — Type-safe database with separate D1/Hyperdrive schemas/migrations
- **Zod** — Shared runtime schema validation (frontend + backend)
- **Theme & Language Selector** — Built into main layout with DaisyUI themes and `angular-i18next`

### Testing

- **Vitest 4.0+** — Built-in Angular unit + integration testing via `@angular/build:unit-test`
- **Angular TestBed** — Component testing with `@vitest/browser-playwright`
- **Playwright** — End-to-end testing across browsers (`from Playwright-E2E` prefix enforced)
- **90%+ Coverage** — Minimum coverage (statements, branches, functions, lines) enforced by v8
- **Comprehensive Testing** — Component, API, utility, integration, and E2E tests

### DevOps

- **PNPM** — Fast, efficient package manager (required)
- **ESLint + Prettier** — Linting and formatting
- **Docker Compose** — Local PostgreSQL for Hyperdrive development
- **OpenSpec** — Specification-driven development workflow
- **Wrangler** — Cloudflare CLI for development and deployment (locally testable)

### Cloudflare Services

- **D1** — SQLite database at the edge (separate schema in `db/d1/`)
- **Hyperdrive** — PostgreSQL connection pooling (separate schema in `db/hyperdrive/`)
- **KV** — Key-value cache, sessions, inter-DO communication
- **R2** — S3-compatible object storage for uploads/files
- **Durable Objects** — Stateful connections, queues (DO + KV for inter-DO coordination)
- **Vectorize** — Vector embeddings for ML data models
- **Workers AI** — AI inference and backend automation
- **Browser Rendering** — Server-side browser automation
- **Rate Limiter** — Edge-native request rate limiting

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Initialize OpenSpec](#initialize-openspec)
4. [Environment Setup](#environment-setup)
5. [Database Setup](#database-setup)
6. [Development](#development)
7. [Testing](#testing)
8. [Building & Deployment](#building--deployment)
9. [Project Structure](#project-structure)
10. [Architecture Overview](#architecture-overview)
11. [Quick Reference](#quick-reference)

---

## Prerequisites

Before starting, ensure you have the following installed:

| Tool             | Version | Purpose                         |
| ---------------- | ------- | ------------------------------- |
| **Node.js**      | 24+ LTS | JavaScript runtime              |
| **PNPM**         | 10+     | Package manager                 |
| **Docker**       | Latest  | Local PostgreSQL for Hyperdrive |
| **Wrangler CLI** | 4.71+   | Cloudflare deployments          |
| **Git**          | Latest  | Version control                 |

### Install Global Tools

```bash
# Install PNPM (if not installed)
npm install -g pnpm

# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare (for deployments)
wrangler login
```

---

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd angular-cf-starter
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This installs all project dependencies including:

- Angular 21, TypeScript 5.9+
- TailwindCSS 4+, DaisyUI, Lucide Angular
- Hono, Drizzle ORM, Zod
- Vitest, Playwright
- i18next, angular-i18next
- Awilix (backend dependency injection)

### Step 3: Install OpenSpec Fission AI (Optional but Recommended)

```bash
# Install OpenSpec CLI globally
npm install -g @fission-ai/openspec@latest

# Verify installation
openspec --version
```

---

## Initialize OpenSpec

OpenSpec provides specification-driven development for consistent, high-quality code.

Read the project context before making changes:

```bash
cat openspec/config.yaml
```

**Key files to review:**

- `openspec/config.yaml` — Project configuration, context, and rules

---

## Environment Setup

### Step 1: Create Environment File

```bash
cp .dev.vars.example .dev.vars
```

### Step 2: Configure Environment Variables

Edit `.dev.vars` with your settings (resolves `${...}` placeholders in `wrangler.jsonc` via `scripts/gen-wrangler.js`):

```bash
# .dev.vars (gitignored)
VALUE_FROM_CLOUDFLARE="Hello from local dev!"
KV_ID="your_kv_id_here"
HYPERDRIVE_DB_ID="your_hyperdrive_db_id_here"
# CORS_ALLOWED_ORIGINS=["http://localhost:4200","https://your-domain.com"]
```

### Step 3: Start Local Services

```bash
docker-compose up -d
docker-compose ps
```

---

## Database Setup

This project uses **Drizzle ORM** with separate schemas/migrations for:

- **D1** (SQLite) — `db/d1/`
- **Hyperdrive** (PostgreSQL) — `db/hyperdrive/`

### Local Testing

- **D1** writes state natively locally in `.wrangler/state`.
- **Hyperdrive** connects to the `docker-compose` PostgreSQL server on port `5432`.

---

## Development

### Start Development Server

```bash
pnpm dev
```

This starts the Angular dev server with HMR at `http://localhost:4200`.

### Code Quality Commands

```bash
# Run ESLint (lint)
pnpm lint

# Run TypeScript type checking (generates Cloudflare bindings)
pnpm typecheck
```

---

## Testing

### Run Tests

```bash
# Run all Vitest tests (unit + integration)
pnpm test

# Run tests once without watch
pnpm test:run

# Run tests with coverage
pnpm test:cov

# Run Playwright E2E tests
pnpm test:e2e
```

### Coverage Requirements

- **Minimum coverage: 90%** for all metrics (statements, branches, functions, lines) via Vitest v8.
- Backend mocking uses Awilix container substitution.
- Frontend mocking uses Angular `TestBed` provider overrides.
- **E2E Data Prefix:** All Playwright data inputs use `from Playwright-E2E` prefix.

---

## Building & Deployment

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Deploy to Cloudflare

For detailed CI/CD and deployment, see **[GUIDE.md](./GUIDE.md)**.

---

## Project Structure

```text
├── src/
│   ├── app/                      # Angular application root
│   │   ├── app.ts                # Root component (standalone, RouterOutlet)
│   │   ├── app.config.ts         # Application configuration (providers)
│   │   ├── app.routes.ts         # Root route definitions (lazy-loaded)
│   │   ├── components/           # Shared/reusable UI components
│   │   │   ├── layout/           # Layout (header, footer, sidebar, theme/lang selector)
│   │   │   └── ui/               # Generic UI (toast, modal, carousel, dropdown)
│   │   ├── core/                 # Singleton services, guards, interceptors
│   │   ├── engines/              # Frontend business logic orchestrators
│   │   ├── features/             # Feature modules (lazy-loaded routes)
│   │   ├── i18n/                 # Frontend internationalization (angular-i18next)
│   │   ├── schemas/              # Frontend-specific Zod schemas
│   │   ├── services/             # Frontend services (API, OAuth, etc.)
│   │   ├── types/                # Frontend-specific TypeScript types
│   │   └── utils/                # Frontend utilities
│   │
│   ├── server/                   # Backend (Hono on Cloudflare Workers)
│   │   ├── app.ts                # Hono server entrypoint
│   │   ├── containers/           # Backend DI container (Awilix)
│   │   ├── durable-objects/      # Durable Object classes
│   │   ├── engines/              # Backend business logic orchestrators
│   │   ├── i18n/                 # Backend internationalization
│   │   ├── middleware/           # Hono middleware (CSRF, CORS, logger, error-handler)
│   │   ├── routes/v1/            # Versioned API endpoints
│   │   ├── schemas/              # Backend-specific Zod schemas
│   │   ├── services/             # Backend services (D1, KV, R2, etc.)
│   │   └── types/                # Backend-specific TypeScript types
│   │
│   ├── server.ts                 # SSR entry (AngularAppEngine + Hono)
│   └── styles.css                # TailwindCSS 4+ with DaisyUI
│
├── db/                           # Database schemas and migrations (D1 + Hyperdrive)
├── e2e/                          # Playwright end-to-end tests
├── shared/                       # Shared schemas, types, and utilities
├── openspec/                     # OpenSpec specification files
├── angular.json                  # Angular CLI workspace configuration
├── eslint.config.js              # ESLint configuration
├── docker-compose.yml            # Local PostgreSQL for Hyperdrive
├── vitest.config.ts              # Vitest configuration
├── playwright.config.ts          # Playwright E2E configuration
└── wrangler.jsonc                # Cloudflare Workers configuration
```

---

## Architecture Overview

This project follows a **clean architecture** with SOLID principles:

```text
┌─────────────────────────────────────────────────────────────┐
│                    Routes / Controllers                      │
│       (Angular Router + Route Components / Hono routes)      │
└──────────────────────────┬──────────────────────────────────┘
                           │ calls
┌──────────────────────────▼──────────────────────────────────┐
│                   Engine / Facade Layer                      │
│         (Business logic, orchestrates 2+ services)           │
│   • ONLY create when orchestrating 2+ services               │
│   • Can be shared between frontend and backend if portable   │
└──────────────────────────┬──────────────────────────────────┘
                           │ delegates
┌──────────────────────────▼──────────────────────────────────┐
│                      Service Layer                           │
│           (Direct integration with external systems)         │
│                                                              │
│   Backend: D1 │ Hyperdrive │ KV │ R2 │ DO │ Vectorize │ AI  │
│   Frontend: API │ OAuth │ Payment │ Maps │ etc.              │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

- **Angular Built-in DI** (frontend) — `@Injectable`, `inject()`, `providedIn: 'root'`
- **Awilix DI** (backend) — Interface-based contracts, scoped containers per request
- **Logger Service** — Correlation ID, sensitive data sanitization
- **Global Error Handling** — Backend: Hono `onError`; Frontend: Angular `ErrorHandler`
- **CSRF Protection** — All mutations via Hono `csrf()` middleware
- **CORS Protection** — Configurable origins via `wrangler.jsonc`

---

## Quick Reference

```bash
# ─────────────────────────────────────────────────────────
# INSTALLATION
# ─────────────────────────────────────────────────────────
pnpm install                    # Install dependencies
docker-compose up -d            # Start local PostgreSQL

# ─────────────────────────────────────────────────────────
# DEVELOPMENT
# ─────────────────────────────────────────────────────────
pnpm dev                        # Start Angular dev server
pnpm lint                       # ESLint check
pnpm typecheck                  # TypeScript + Wrangler types

# ─────────────────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────────────────
pnpm d1:generate                # Generate D1 migrations
pnpm d1:migrate                 # Apply D1 migrations (local)
pnpm d1:studio                  # Open D1 Drizzle Studio
pnpm db:generate                # Generate Hyperdrive migrations
pnpm db:migrate                 # Apply Hyperdrive migrations (local)
pnpm db:studio                  # Open Hyperdrive Drizzle Studio

# ─────────────────────────────────────────────────────────
# TESTING
# ─────────────────────────────────────────────────────────
pnpm test                       # Run all Vitest tests
pnpm test:run                   # Run tests once (no watch)
pnpm test:cov                   # Run tests with coverage
pnpm test:e2e                   # Playwright E2E tests

# ─────────────────────────────────────────────────────────
# BUILD & DEPLOY
# ─────────────────────────────────────────────────────────
pnpm build                      # Production build
pnpm preview                    # Build + local Wrangler preview

# ─────────────────────────────────────────────────────────
# LOCAL SERVICES
# ─────────────────────────────────────────────────────────
docker-compose up -d            # Start PostgreSQL
docker-compose logs -f          # View logs
```

---

## License

MIT
