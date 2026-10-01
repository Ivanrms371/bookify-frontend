---
name: build-ui
description: Implement or refine dashboard routes, components, forms, and async interactions using existing feature and shared UI patterns.
---

# Build dashboard UI

## Context and prerequisites

Resolve the owning app three directories above this folder. Read [dashboard guidance](../../../AGENTS.md), inspect status and affected dirty files, and identify the requested UI outcome and writable files. Inspect `package.json`, route/TypeScript configuration, the nearest feature components, shared primitives, forms, overlays, styles and existing icon imports. Read relevant API calls, schemas, query keys and the tenant-aware client before changing data interactions.

For contract changes, use the [cross-app workflow](../../../../docs/cross-app-changes.md) when available and inspect backend plus public-web consumers. Local guidance remains usable without the parent; report unavailable contract coordination.

## Procedure

1. Trace the route and auth/tenant/onboarding context. Locate existing UI and feature patterns before adding components; identify any shared/global files the task actually needs.
2. Map relevant interaction states: loading, empty, error, success, disabled/pending and validation. Choose applicable states rather than adding artificial ones. Keep feature implementation behind thin route modules and reuse existing client/query/overlay patterns.
3. Implement within the authorized scope. Discover imports from current TypeScript aliases and nearby code. Follow the affected component's conventions instead of imposing an unsupported single icon, color or theme policy. Preserve labels, keyboard navigation, focus behavior and accessible names.
4. If a primitive generator is proposed, first inspect `components.json`, alias destinations, stylesheet path, dependency changes and expected outputs. Current generator configuration has mismatches with the shared tree. Stop generation if destinations do not match; report the issue rather than repairing configuration incidentally or running `shadcn@latest` blindly. Reuse existing primitives where possible.
5. Trace contract/types/schema/query invalidation changes through both consumers when relevant; implement only authorized changes and report required coordination. Do not redesign unrelated pages or fix unrelated baseline failures.

## Side effects and gates

Allowed: authorized route, feature, necessary shared-component and meaningful test edits within named boundaries. Coordinate shared-file ownership; do not assume ownership of the entire app. Dependency installation/downloads, generators, explicit route generation, global styling, broad format/autofix, environment changes and Git operations require authorization covering their outputs. Builds write artifacts. Browser/server runtime and business-data submissions are distinct operations; previewing UI does not authorize mutation. The skill grants no permissions; honor prior approvals and session restrictions.

## Verification and stopping conditions

Choose checks that answer the change's risks. Recheck manifest/config first: `pnpm exec tsc --noEmit --incremental false` checks existing generated types; `pnpm typecheck` currently regenerates routes and may write metadata. Record existing failures separately from regressions and do not regenerate or delete dirty types as incidental repair. Build only when its output validates a material concern and writes are authorized.

For authorized runtime validation, use the local [run-frontend](../run-frontend/SKILL.md) procedure and inspect relevant desktop/mobile layouts, overflow, async states, keyboard/focus and form errors. Do not require a server merely for nonvisual changes or submit real data without authorization. Report unavailable runtime/auth/API checks honestly.

Pause dependent work on unresolved contracts, generator destination mismatches, shared-file ownership conflicts or missing required authorization. Continue independent work where possible. Review per-repository diffs including untracked files; report files, checks, baseline failures, untested behavior and sibling coordination without implicit staging/committing.
