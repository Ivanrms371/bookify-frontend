# AGENTS.md

This file provides guidance to Codex and other coding agents when working in the frontend app.

React Router v7 framework-mode app for **Turnify**. Uses Tailwind v4, TanStack Query, Zustand, shadcn-style Radix UI, FullCalendar/Schedule-X, and `pnpm`.

## Commands

- `pnpm dev` — React Router dev server with `--host`.
- `pnpm build` — `react-router build`, outputting `build/`.
- `pnpm start` — serve the built app via `@react-router/serve`.
- `pnpm typecheck` — `react-router typegen && tsc`. Run after editing `app/routes.ts` or route module signatures so generated route types stay in sync.

## Architecture

Routes are declared in `app/routes.ts`; this app is not filesystem-routed.

- `_guard.tsx` — top-level auth/tenant guard.
- `auth/_layout.tsx` — login/signup.
- `onboarding/_layout.tsx` — onboarding flow: welcome, business, schedule, services, team, customize, confirm, completed.
- `/:slug` (`app/_slug.tsx`) — tenant-scoped app shell. Nested `app/_layout.tsx` renders the authenticated dashboard: calendar, services, customers, professionals, reports, settings, and profile. `billing` sits outside that inner layout.
- Tenant slug comes from the URL; use `params.slug` or existing tenant helpers to know which tenant the frontend is acting for.

Keep these top-level trees distinct:

- `app/features/<domain>/` — domain feature code: `api/`, `components/`, `hooks/`, `schemas/`, `types/`, `constants/`, and `utils/`. Route files should stay thin and delegate here.
- `app/core/` — cross-cutting infrastructure: `auth/`, `tenant/`, `http/`, `query/`, and `error/`.
- `app/shared/` — generic UI, hooks, providers, stores, and utils. shadcn/Radix components live under `shared/components`.

## UI & State

Use TanStack Query for server state. Use Zustand, and existing `@preact/signals` usage where already established, for local/UI state. Styling is Tailwind v4 via `@tailwindcss/vite`; `tw-animate-css` handles animations; `prettier-plugin-tailwindcss` sorts classes.

Prefer existing shared components and feature-local patterns before adding new abstractions. For UI implementation, also consult the repo-local skills in `../.codex/skills/`, especially `build-ui` and `design`.

The backend (`../backend`) exposes `/api/*`. When changing an API contract, update matching Zod schemas under `app/features/<domain>/schemas` and axios calls under `app/features/<domain>/api`.
