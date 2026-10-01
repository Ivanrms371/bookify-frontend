# Dashboard agent guidance

This independent Git repository is the React Router 7 dashboard. Run pnpm commands here. When available, consult [parent guidance](../AGENTS.md), [architecture](../docs/architecture.md), and [cross-app workflow](../docs/cross-app-changes.md); these local instructions also support opening the app alone.

## Runtime and organization

`react-router.config.ts` sets `ssr: false`. Routes are explicitly declared in `app/routes.ts`, not inferred from filenames. `routes/_guard.tsx` wraps auth, onboarding and the tenant app; `/:slug` uses `routes/app/_slug.tsx`, with the dashboard layout nested inside it and billing outside that inner layout. Inspect route/guard behavior before adding navigation.

- `app/features/<domain>` owns domain API calls, components, hooks, schemas, types and utilities. Keep route modules thin.
- `app/core` owns auth, tenant, HTTP, query and error infrastructure.
- `app/shared` owns reusable UI, hooks, providers, stores and utilities.

The `@/*` alias maps to `app/*` in `tsconfig.json`. The tenant-aware axios client is `app/core/http/httpClient.ts`: `VITE_API_URL`, credentials, URL-derived `x-tenant-slug`, and `x-tenant-id` when the session tenant matches (or when no URL slug exists). Backend ID precedence makes header consistency important. Reuse the client and existing auth/tenant helpers; do not bypass tenant selection or cookie/refresh handling with ad hoc requests.

Use TanStack Query for server state and follow existing query keys/invalidation. Zustand and some Preact signals handle UI state. Reuse established Radix/shadcn-style shared components, React Hook Form/Zod validation and overlay registry/drawer patterns. Tailwind 4 is configured through Vite. Multiple icon and calendar libraries exist; follow the affected component's implementation rather than asserting one uniform convention. Use local [build-ui](.agents/skills/build-ui/SKILL.md) for UI implementation and [run-frontend](.agents/skills/run-frontend/SKILL.md) for development-server lifecycle; inspect current code/configuration before acting.

## Commands and validation

| Command | Behavior |
| --- | --- |
| `pnpm dev` | Starts `react-router dev --host`, exposing the dev server beyond loopback. |
| `pnpm build` | Runs `react-router build`; writes build/generated artifacts. |
| `pnpm start` | Manifest runs `react-router-serve ./build/server/index.js`; verify actual output before assuming it works with SSR disabled. |
| `pnpm typecheck` | Runs `react-router typegen && tsc`; regenerates route types and may write incremental metadata. |
| `pnpm exec tsc --noEmit --incremental false` | Checks existing generated route types without regenerating them; not equivalent to full `pnpm typecheck`. |

The supplied earlier non-emitting check failed with duplicate generated route declarations and application errors. It did not regenerate routes and was not the full typecheck script; distinguish existing failures from regressions and report exact commands/results. No automated test suite or repository CI workflows were found. Type checks alone do not verify interaction behavior; perform focused UI checks when authorized and relevant.

For API changes trace backend DTOs/mappers/permissions, feature calls/types/Zod schemas, and query/UI effects; also inspect `../web` for public consumers. When sibling repositories are unavailable, report needed coordination. API base URLs must match the backend `/api` prefix; environment templates have known mismatches and are not authoritative.

Preserve pre-existing dirty changes and this repository's Git root. Do not run generation/autofix, start servers, change dependencies/environment or mutate databases as incidental documentation work. Current session sandbox/approval restrictions apply. Historical deleted dependency rules are pending reconciliation, not automatically active policy.

## Documentation and evidence

Documentation provides architectural/domain context, but relevant code and tests remain the evidence of actual behavior. When documentation conflicts with implementation:

- Do not silently choose one.
- Report the inconsistency.
- Determine actual behavior from relevant implementation/tests.
- Update documentation when the current task changes documented behavior.
