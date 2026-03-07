# Angular Cloudflare Starter

A production-ready full-stack starter template built on **Angular** with **Cloudflare Workers**. Features SSR, comprehensive Cloudflare service integrations, clean architecture following SOLID principles, and specification-driven development with OpenSpec.

> **📖 Full Project Specification:** See [`openspec/config.yaml`](./openspec/config.yaml) for complete technical requirements, architecture patterns, and coding conventions.

## Key Features

### Frontend

- **React 19.2+** — Latest modern patterns with hooks, Suspense, and Server Components
- **Angular 1.161+** — Full-stack React framework ([docs](https://tanstack.com/start/latest/docs/framework/react)) powered by TanStack Router
- **TypeScript 5.9+** — Strict type safety, **no `any` type allowed**
- **TailwindCSS 4.2+** — Utility-first CSS with mobile-first responsive design
- **Semantic HTML & ARIA** — Accessibility (skip links, keyboard nav, focus management) and SEO
- **DaisyUI 5.5+** — UI components with customizable themes (default: **light**)
- **Lucide React** — Icon library (`lucide-react`)
- **react-i18next** — Frontend internationalization with centralized translation files
- **Form Layouts** — Following [TailwindCSS form layouts](https://tailwindcss.com/plus/ui-blocks/application-ui/forms/form-layouts)

### Backend

- **Hono 4.12+** — Fast, edge-native API framework with SOLID principles
- **TypeScript 5.9+** — Type-safe backend, **no `any` type allowed**
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
- **Dependency Injection** — Awilix with interface-based contracts
- **Layer Discipline** — Only create engine layer when orchestrating 2+ services
- **Drizzle ORM** — Type-safe database with separate D1/Hyperdrive schemas/migrations
- **Zod** — Shared runtime schema validation (frontend + backend)
- **i18next** — Internationalization (frontend + backend, centralized)
- **Theme & Language Selector** — Built into main layout with DaisyUI themes

### Testing

- **Vitest 4.0+** — Unit + integration testing framework (with explicit D1/Hyperdrive and Service mocking via Awilix)
- **React Testing Library** — Component testing with accessibility focus
- **Playwright** — End-to-end testing across browsers (`from Playwright-E2E` prefix enforced)
- **90%+ Coverage** — Minimum coverage requirement (statements, branches, functions, lines) enforced by v8
- **Comprehensive Testing** — Component, API, utility, integration, and E2E tests

### DevOps

- **PNPM** — Fast, efficient package manager (required)
- **Biome.js** — Fast formatting and linting
- **Docker Compose** — Local PostgreSQL for Hyperdrive development
- **OpenSpec** — Specification-driven development workflow
- **Wrangler** — Cloudflare CLI for development and deployment (Configured to be locally testable)

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
| **Wrangler CLI** | 4.67+   | Cloudflare deployments          |
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
cd tanstack-start-react-cf-starter
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This installs all project dependencies including:

- React 19, TanStack Start, TypeScript
- TailwindCSS 4+, DaisyUI, Lucide React
- Hono, Drizzle ORM, Zod
- Vitest, React Testing Library, Playwright
- i18next, react-i18next
- Awilix (dependency injection)

### Step 3: Install OpenSpec Fission AI (Optional but Recommended)

OpenSpec Fission AI enhances the development workflow with AI-assisted specification management.

```bash
# Install OpenSpec CLI globally
npm install -g @fission-ai/openspec@latest

# Verify installation
openspec --version
```

---

## Initialize OpenSpec

OpenSpec provides specification-driven development for consistent, high-quality code.

### Step 1: Review Project Specifications

Read the project context before making changes:

```bash
# View project specifications
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

Edit `.dev.vars` with your settings (it resolves `${...}` placeholders in `wrangler.jsonc` via `scripts/gen-wrangler.js`):

```bash
# .dev.vars (gitignored)
VALUE_FROM_CLOUDFLARE="Hello from local dev!"
KV_ID="your_kv_id_here"
HYPERDRIVE_DB_ID="your_hyperdrive_db_id_here"
# Optional (recommended for CORS)
# CORS_ALLOWED_ORIGINS="http://localhost:5173,https://your-domain.com"
```

### Step 3: Start Local Services

Start PostgreSQL for Hyperdrive development:

```bash
docker-compose up -d
```

Verify the service is running:

```bash
docker-compose ps
```

---

## Database Setup

This project is designed to use **Drizzle ORM** with separate schemas/migrations for:

- **D1** (SQLite) - `db/d1/`
- **Hyperdrive** (PostgreSQL) - `db/hyperdrive/`

### Validating Schemas and Testing Locally

The setup guarantees you test databases using Cloudflare's local runtime:

- **D1** writes state natively locally in `.wrangler/state`.
- **Hyperdrive** is piped to the `docker-compose` PostgreSQL server running on port `5432`.

---

## Development

### Start Development Server

```bash
pnpm dev
```

This starts:

- **Vite dev server** with HMR at `http://localhost:5173`
- **Cloudflare Workers** local bindings integration (`D1`, `KV`, etc.)

### Code Quality Commands

```bash
# Run Biome check + auto-fix (lint + format)
pnpm lint

# Run TypeScript type checking
pnpm typecheck
```

---

## Testing

### Run Tests

```bash
# Run all Vitest tests (unit + integration)
pnpm test

# Run tests with Vitest UI in browser
pnpm test:ui

# Run Playwright E2E tests
pnpm e2e
```

### Coverage Requirements

- **Minimum coverage: 90%** for all metrics (statements, branches, functions, lines) utilizing Vitest `v8`.
- Ensure all mocked dependencies correctly integrate Awilix container substitutions.
- **E2E Data Input Restriction:** Use `from Playwright-E2E` prefix for all E2E interactions.

---

## Building & Deployment

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
# Preview with local bindings
pnpm preview
```

### Deploy to Cloudflare

For detailed CI/CD and deployment, consult **[GUIDE.md](./GUIDE.md)**! It explicitly instructs you on providing Cloudflare IDs across specific staging/production workflows with pre-made templates backing the `scripts/gen-wrangler.js` file mapping!

---

## Project Structure

```text
├── src/                          # Main Application Source Code
│   ├── components/               # React components (PascalCase files)
│   ├── containers/               # Frontend DI container (Awilix)
│   ├── engines/                  # Frontend business logic orchestrators
│   ├── i18n/                     # Frontend internationalization
│   ├── routes/                   # TanStack Router file-based route modules
│   ├── schemas/                  # Frontend-specific Zod schemas
│   ├── services/                 # Frontend services (API, OAuth, etc.)
│   ├── types/                    # Frontend-specific TypeScript types
│   ├── router.tsx                # TanStack Router setup
│   ├── routeTree.gen.ts          # Auto-generated TanStack Router tree
│   ├── styles.css                # TailwindCSS 4+ main stylesheet
│   │
│   └── server/                   # Backend (Hono on Cloudflare Workers)
│       ├── app.ts                # Hono server entrypoint
│       ├── containers/           # Backend DI container (Awilix)
│       ├── durable-objects/      # Durable Object classes
│       ├── engines/              # Backend business logic orchestrators
│       ├── i18n/                 # Backend internationalization
│       ├── routes/               # API route handlers
│       ├── schemas/              # Backend-specific Zod schemas
│       ├── services/             # Backend services (D1, KV, R2, etc.)
│       └── types/                # Backend-specific TypeScript types
│
├── db/                           # Database schemas and migrations
├── e2e/                          # Playwright end-to-end tests
├── shared/                       # Shared schemas, types, and utilities
├── openspec/                     # OpenSpec specification files
├── scripts/                      # Build and utility scripts
├── biome.json                    # Biome.js configuration (format + lint)
├── docker-compose.yml            # Local PostgreSQL for Hyperdrive
├── package.json                  # Dependencies and scripts (PNPM)
├── playwright.config.ts          # Playwright E2E configuration
├── tsconfig.json                 # TypeScript root config (strict)
├── vite.config.ts                # TanStack Start + Cloudflare Vite integration
├── vitest.config.ts              # Vitest test configuration
└── wrangler.jsonc                # Cloudflare Workers configuration
```

---

## Architecture Overview

This project follows a **clean architecture** with SOLID principles and dependency injection:

```text
┌─────────────────────────────────────────────────────────────┐
│                    Routes / Controllers                      │
│     (TanStack Start Route Loaders / Actions / Hono routes)   │
└──────────────────────────┬──────────────────────────────────┘
                           │ calls
┌──────────────────────────▼──────────────────────────────────┐
│                   Engine / Facade Layer                      │
│         (Business logic, orchestrates 2+ services)           │
│                                                              │
│   • Coordinates multiple services                            │
│   • Contains business rules and validation                   │
│   • Transaction boundaries                                   │
│   • ONLY create when orchestrating 2+ services               │
│   • Can be shared between frontend and backend if portable   │
└──────────────────────────┬──────────────────────────────────┘
                           │ delegates
┌──────────────────────────▼──────────────────────────────────┐
│                      Service Layer                           │
│           (Direct integration with external systems)         │
│                                                              │
│   Backend: D1Service │ HyperdriveService │ KVService │       │
│            R2Service │ DOService │ VectorizeService │         │
│            AIService │ LoggerService │ AuthService            │
│                                                              │
│   Frontend: APIService │ OAuthService │ PaymentService │     │
│             MapService │ SmartContractService │ etc.       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

**Layer Discipline:**

- **Engine Layer** — Business logic orchestration (no direct external calls)
- **Service Layer** — Direct integrations with D1, KV, R2, APIs, etc.
- **No Unnecessary Layers** — Only create engine layer when coordinating 2+ services

**Dependency Injection:**

- **Awilix** — Interface-based DI following [official guide](https://github.com/jeffijoe/awilix/blob/master/README.md)
- **Interface Contracts** — All services must implement interfaces
- **Testability** — Easy mocking and unit testing

**Core Features:**

- **Logger Service** — Centralized logging with correlation ID, sensitive data sanitization
- **Global Error Handling** — Automatic error catching and logging for all API routes
- **CSRF Protection** — Required for all mutations (POST/PUT/PATCH/DELETE) via origin checks using Hono middleware globally.
- **CORS Protection** — Configurable origins via `wrangler.jsonc` variables

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
pnpm dev                        # Start dev server (Vite + Wrangler)
pnpm lint                       # Biome check + auto-fix

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
pnpm test:ui                    # Vitest UI (browser)
pnpm e2e                        # Playwright E2E tests

# ─────────────────────────────────────────────────────────
# BUILD & DEPLOY
# ─────────────────────────────────────────────────────────
pnpm build                      # Production build
pnpm preview                    # Build + local preview

# ─────────────────────────────────────────────────────────
# LOCAL SERVICES
# ─────────────────────────────────────────────────────────
docker-compose up -d            # Start PostgreSQL
docker-compose logs -f          # View logs
```

---

## License

MIT
