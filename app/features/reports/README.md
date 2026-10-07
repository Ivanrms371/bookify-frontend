# Reports feature

`ReportsOverview` coordinates local filters and `useReportsOverview`. The hook loads real data through the tenant-aware `reportsApi`: one overview request for all sections and a separate filter-options request. Each visual section receives typed props from `types/reports.types.ts`; sections do not fetch data or import fixtures.

The cross-app backend/frontend integration and module-boundary plan is in [Reports data plan](../../../../docs/reports-data-plan.md).

Query keys are `['reports', tenantId, 'overview', params]` and `['reports', tenantId, 'filter-options']`, matching tenant-cache cleanup on permission changes. Filter options stay fresh for five minutes and refresh after relevant mutations. Overview requests forward cancellation, validate custom dates and keep previous results only within the same tenant. Custom requests wait for the tenant timezone; incomplete, reversed, oversized and future ranges show field feedback instead of sending requests.

Initial loading, retry, empty results and updating feedback are handled by the page. CSV export remains disabled until an export contract is implemented.

## Component contracts

`reports-api.ts` is the API entry point and imports request/response types from `types/reports.types.ts`. Only `useReportsOverview` calls it. The parent owns fetching and filter state; visual sections consume props defined in `types/reports-props.types.ts`, derived from the response data types.

| Component | Props |
| --- | --- |
| `ReportsFilters` | `value`, `options`, `onChange`, optional `optionsLoading` and `dateError` |
| `ReportsSummary` | `summary`, optional `currency` |
| `ReportsDailyRevenue` | `data` (daily revenue), optional `currency` |
| `ReportsTopServices` | `services`, optional `currency` |
| `ReportsProfessionals` | `professionals`, optional `currency` |
| `ReportsOutcomes` | `outcomes` |

The parent always passes the API currency to monetary sections; their standalone default remains UYU. `ReportsOverview` and `ReportsLoading` take no props.
