const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('../settings/load.cjs');

class ReportDate extends Date {
  constructor(...args) { super(...(args.length ? args : ['2026-10-06T02:00:00Z'])); }
}
const model = load('features/reports/utils/report-request.ts', {}, { Date: ReportDate });
const filters = { period: 'this-month', professionalId: 'all', serviceId: 'all', startDate: '', endDate: '' };

function harness(optionsData) {
  let tenant = { id: 'tenant-a', permissions: ['report:read'] };
  const requests = [];
  const api = {
    getOverview: (...args) => { requests.push(['overview', ...args]); },
    getFilterOptions: (...args) => { requests.push(['options', ...args]); },
  };
  const { useReportsOverview } = load('features/reports/hooks/use-reports-overview.ts', {
    '@tanstack/react-query': { useQuery: (config) => ({ ...config, data: config.queryKey[2] === 'filter-options' ? optionsData : undefined }) },
    '@/core/auth/use-auth-store': { useAuthStore: (selector) => selector({ session: { activeTenant: tenant } }) },
    '../api/reports-api': { reportsApi: api },
    '../utils/report-request': model,
  });
  return { render: (value = filters) => useReportsOverview(value), tenant: (value) => { tenant = value; }, requests };
}

test('preset requests omit custom dates and all-resource sentinels; combined filters are retained', () => {
  const preset = model.normalizeReportRequest({ ...filters, startDate: '2026-09-01', endDate: '2026-09-30' });
  assert.equal(JSON.stringify(preset), JSON.stringify({ period: 'this-month' }));
  const custom = model.normalizeReportRequest({ ...filters, period: 'custom', startDate: '2026-09-01', endDate: '2026-09-30', professionalId: 'professional', serviceId: 'service' });
  assert.equal(custom.professionalId, 'professional');
  assert.equal(custom.serviceId, 'service');
  assert.equal(custom.startDate, '2026-09-01');
});

test('invalid custom dates are rejected even before timezone options arrive', () => {
  for (const dates of [
    {}, { startDate: '2026-09-01' },
    { startDate: '2026-02-30', endDate: '2026-03-01' },
    { startDate: '2026-09-02', endDate: '2026-09-01' },
    { startDate: '2024-01-01', endDate: '2025-01-01' },
  ]) {
    const result = harness().render({ ...filters, period: 'custom', ...dates });
    assert.ok(result.validationError);
    assert.equal(result.overview.enabled, false);
  }
});

test('custom requests wait for timezone and use tenant-local today instead of UTC today', () => {
  const custom = { ...filters, period: 'custom', startDate: '2026-10-05', endDate: '2026-10-05' };
  assert.equal(harness().render(custom).overview.enabled, false);
  const page = harness({ timeZone: 'America/Montevideo' });
  assert.equal(page.render(custom).overview.enabled, true);
  const future = page.render({ ...custom, endDate: '2026-10-06' });
  assert.ok(future.validationError.includes('hoy'));
  assert.equal(future.overview.enabled, false);
  assert.equal(model.validateReportDates({ ...custom, startDate: '2024-01-01', endDate: '2024-12-31' }, 'UTC'), undefined);
});

test('overview changes with filters while option cache keys remain stable and tenant cleanup can find both', () => {
  const page = harness({ timeZone: 'America/Montevideo' });
  const first = page.render();
  const second = page.render({ ...filters, professionalId: 'professional' });
  assert.equal(JSON.stringify(first.options.queryKey), JSON.stringify(second.options.queryKey));
  assert.notEqual(JSON.stringify(first.overview.queryKey), JSON.stringify(second.overview.queryKey));
  assert.equal(first.overview.queryKey[1], 'tenant-a');
  assert.equal(first.options.queryKey[1], 'tenant-a');
  assert.ok(first.options.staleTime > 0);
});

test('queries propagate cancellation and expected tenant; placeholders never cross tenants or lost permissions', async () => {
  const page = harness();
  const first = page.render();
  const { signal } = new AbortController();
  await first.overview.queryFn({ signal });
  await first.options.queryFn({ signal });
  assert.equal(page.requests[0][2], 'tenant-a');
  assert.equal(page.requests[0][3], signal);
  assert.equal(page.requests[1][1], 'tenant-a');
  assert.equal(page.requests[1][2], signal);
  assert.equal(first.overview.placeholderData('previous', { queryKey: first.overview.queryKey }), 'previous');
  page.tenant({ id: 'tenant-b', permissions: ['report:read'] });
  assert.equal(page.render().overview.placeholderData('private', { queryKey: first.overview.queryKey }), undefined);
  page.tenant({ id: 'tenant-a', permissions: [] });
  assert.equal(page.render().overview.enabled, false);
  assert.equal(page.render().options.enabled, false);
  assert.equal(page.render().overview.placeholderData('private', { queryKey: first.overview.queryKey }), undefined);
  page.tenant(undefined);
  assert.equal(page.render().overview.enabled, false);
});

test('API methods use separate endpoints and forward tenant guards, query params and cancellation', () => {
  const requests = [];
  const { reportsApi } = load('features/reports/api/reports-api.ts', {
    '@/core/http/httpClient': { httpClient: { get: (url, config) => { requests.push({ url, config }); } } },
  });
  const { signal } = new AbortController();
  const params = { period: 'last-month', serviceId: 'service' };
  reportsApi.getOverview(params, 'tenant-a', signal);
  reportsApi.getFilterOptions('tenant-a', signal);
  assert.equal(requests[0].url, '/reports/overview');
  assert.equal(requests[0].config.params, params);
  assert.equal(requests[1].url, '/reports/filter-options');
  assert.equal(requests[1].config.params, undefined);
  for (const { config } of requests) {
    assert.equal(config.expectedTenantId, 'tenant-a');
    assert.equal(config.signal, signal);
  }
});
