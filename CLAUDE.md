# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

React Router v7 (framework mode) app for **Turnify**. Tailwind v4, TanStack Query, Zustand, shadcn-style Radix UI, FullCalendar/Schedule-X. Uses `pnpm`.

## Commands

- `pnpm dev` — React Router dev server (with `--host`).
- `pnpm build` — `react-router build` (outputs `build/`).
- `pnpm start` — serve the built app via `@react-router/serve`.
- `pnpm typecheck` — `react-router typegen && tsc`. Run this after editing `app/routes.ts` or route module signatures so generated route types stay in sync.

## Architecture

Routes are declared in `app/routes.ts` (not filesystem-based). Layout composition:

- `_guard.tsx` — top-level auth/tenant guard wrapping everything.
- `auth/_layout.tsx` — login/signup.
- `onboarding/_layout.tsx` — multi-step tenant onboarding (welcome → business → schedule → services → team → customize → confirm → completed).
- `/:slug` (`app/_slug.tsx`) — tenant-scoped app shell; nested `app/_layout.tsx` renders the authenticated dashboard (calendar, services, customers, professionals, reports, settings, profile). `billing` sits outside that inner layout.
- Tenant slug comes from the URL — reading it from `params.slug` is how the frontend knows which tenant it is acting for.

Three parallel top-level trees — keep them straight:

- `app/features/<domain>/` — per-domain feature code (`api/`, `components/`, `hooks/`, `schemas/`, `types/`, `constants/`, `utils/`). Route files should be thin and delegate here. Domains mirror backend modules (appointments, availability, customers, services, professionals, memberships, invitations, subscriptions, notifications, calendar, schedule, staff-working-hours, tenant-working-hours, plans, billing, dashboard, onboarding, auth, profile, settings, tenant).
- `app/core/` — cross-cutting infrastructure: `auth/`, `tenant/`, `http/` (axios client), `query/` (TanStack Query setup), `error/`.
- `app/shared/` — generic UI + hooks + providers + stores + utils (shadcn/Radix components live under `shared/components`).

State: TanStack Query for server state; Zustand (+ `@preact/signals` in places) for local/UI state. Styling: Tailwind v4 via `@tailwindcss/vite`; `tw-animate-css` for animations; `prettier-plugin-tailwindcss` sorts classes.

The backend (`../backend`) exposes `/api/*`. When changing an API contract, update the matching Zod schemas under `app/features/<domain>/schemas` and the axios calls under `app/features/<domain>/api`.
