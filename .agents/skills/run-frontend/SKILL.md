---
name: run-frontend
description: Start, stop, restart, or inspect the dashboard development server and verify a requested route or UI change.
---

# Run dashboard

## Context and prerequisites

Resolve the owning app three directories above this skill folder; do not assume a parent checkout or caller working directory. Read [dashboard guidance](../../../AGENTS.md), inspect Git status, and verify `package.json`, `react-router.config.ts`, `vite.config.ts`, `tsconfig.json` and `app/routes.ts`. For route inspection, read the route guard, relevant tenant/auth helpers and `app/core/http/httpClient.ts`. Installed dependencies and suitable API/auth context are required for checks that use them.

## Procedure

1. Identify inspection versus start/stop/restart and the requested route. Inspect any existing server's listener, command, working directory and ownership. Reuse a compatible authorized server; do not replace an unknown process or start a duplicate.
2. Check dependency availability and route-type needs. Missing dependencies do not authorize installation. Route generation is a separate writing operation, not a prerequisite for every startup. Inspect the current typecheck script: it currently runs route generation plus TypeScript. Distinguish that from checking existing generated types.
3. Before launch, state network exposure from the current script/config (currently `pnpm dev` includes `--host`). Start only when the user's request covers server runtime; use a tool-managed session and retain its handle/PID and logs.
4. Use the URL printed by the server. Trace route/auth/onboarding behavior to select an accessible route using an authorized account and active membership; do not pick arbitrary tenant slugs or fabricate/seed a session. If the API is unavailable, inspect the configured base URL and backend CORS implementation when available, and report the blocker without changing configuration or starting the backend implicitly.
5. For stop/restart, gracefully stop only the task-owned or specifically authorized identified process, verify shutdown, then restart if requested. Keep a requested server running with its handle reported; close temporary verification servers when their agreed use ends.

## Side effects and gates

Allowed: read-only inspection, authorized dashboard process lifecycle and bounded browser inspection. Dev startup may write tool-generated caches/types; inspect status afterward. Installation/downloads, explicit route generation, builds, format/autofix, environment changes and Git operations need task authorization covering their affected outputs. Do not submit business-data mutations, create accounts or alter sessions merely to preview UI. Existing authorization persists; the skill grants none and cannot override session restrictions.

## Verification and stopping conditions

Verify server logs, intended URL and actual requested route rendering. For UI checks inspect relevant loading/error/empty/pending/validation states, focus and responsive behavior without unapproved submissions. Distinguish missing API/auth prerequisites from rendering failures. Do not treat production serving as validated by development startup.

Stop dependent work on unknown listener ownership, missing dependencies/configuration, unavailable authorization or startup failure. Report unavailable authenticated checks rather than manufacturing test data. Report command, app directory, handle, URL, checks and limitations; redact sensitive logs and distinguish task-created generated changes from prior dirty files.
