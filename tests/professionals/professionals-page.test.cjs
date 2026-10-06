const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(path, dependencies = {}) {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText,
    { exports, require: (id) => id in dependencies ? dependencies[id] : require(id) },
  );
  return exports;
}
const model = load('app/features/professionals/utils/professionals-page-model.ts');
const { initialProfessionalsState, professionalsPageReducer, professionalsPageParams, canKeepProfessionalResults, lastProfessionalsPage } = model;

test('mobile filters commit together and reset pagination without dropping search', () => {
  const next = professionalsPageReducer(
    { ...initialProfessionalsState, search: 'Ana', query: 'Ana', page: 3 },
    { type: 'filters', filters: { status: 'inactive', serviceId: 'service-a', sort: 'newest' } },
  );
  const params = professionalsPageParams(next);
  assert.equal(params.skip, 0);
  assert.equal(params.take, 24);
  assert.equal(params.query, 'Ana');
  assert.equal(params.isActive, false);
  assert.equal(params.serviceId, 'service-a');
  assert.equal(params.orderBy, 'createdAt');
  assert.equal(params.sortOrder, 'desc');
});

test('pagination cache cannot cross tenants or changed criteria', () => {
  const params = professionalsPageParams(initialProfessionalsState);
  const key = ['professionals', 'tenant-a', params];
  assert.equal(canKeepProfessionalResults('tenant-a', { ...params, skip: 24 }, key), true);
  for (const [field, value] of [
    ['query', 'Ana'], ['isActive', false], ['serviceId', 'service-a'],
    ['orderBy', 'createdAt'], ['sortOrder', 'desc'], ['take', 48],
  ]) {
    assert.equal(canKeepProfessionalResults('tenant-a', { ...params, [field]: value }, key), false);
  }
  assert.equal(canKeepProfessionalResults('tenant-b', params, key), false);
  assert.equal(canKeepProfessionalResults(undefined, params, key), false);
  assert.equal(canKeepProfessionalResults('tenant-a', params, ['professionals', 'tenant-a']), false);
});

test('query waits for a tenant and forwards cancellation and tenant identity', async () => {
  let tenantId = 'tenant-a';
  let request;
  const { useProfessionalsListing } = load('app/features/professionals/hooks/use-professionals-listing.ts', {
    '../utils/professionals-page-model': model,
    '@tanstack/react-query': { useQuery: (options) => options },
    '@/core/auth/use-auth-store': { useAuthStore: (selector) => selector({ session: { activeTenant: { id: tenantId } } }) },
    '../api/professional-api': { professionalApi: { getListing: async (params, options) => { request = { params, options }; } } },
  });
  const params = professionalsPageParams(initialProfessionalsState);
  const query = useProfessionalsListing(params);
  assert.equal(query.queryKey[1], tenantId);
  assert.equal(query.enabled, true);
  const { signal } = new AbortController();
  await query.queryFn({ signal });
  assert.equal(request.options.signal, signal);
  assert.equal(request.options.tenantId, tenantId);
  assert.equal(query.placeholderData('previous', { queryKey: ['professionals', tenantId, params] }), 'previous');
  tenantId = 'tenant-b';
  assert.equal(useProfessionalsListing(params).placeholderData('private', { queryKey: query.queryKey }), undefined);
  tenantId = undefined;
  assert.equal(useProfessionalsListing(params).enabled, false);
});

test('API forwards the abort signal and expected tenant to the HTTP client', () => {
  let request;
  const { professionalApi } = load('app/features/professionals/api/professional-api.ts', {
    '@/core/http/httpClient': { httpClient: { get: (url, config) => { request = { url, config }; } } },
  });
  const { signal } = new AbortController();
  const params = { query: 'Ana', skip: 0, take: 24 };
  professionalApi.getListing(params, { signal, tenantId: 'tenant-a' });
  assert.equal(request.url, '/professionals');
  assert.equal(request.config.signal, signal);
  assert.equal(request.config.expectedTenantId, 'tenant-a');
  assert.equal(request.config.params.query, params.query);
  assert.equal(request.config.params.count, true);
});

// Exercise the hook's request/effect seam with controlled debounce and query results.
function pageHarness() {
  let state = { ...initialProfessionalsState };
  let debounced = '';
  let result = { isLoading: false, isEnabled: true, isPlaceholderData: false };
  let effects = [];
  let requested;
  const { useProfessionalsPage } = load('app/features/professionals/hooks/use-professionals-page.ts', {
    react: {
      useReducer: (reducer) => [state, (action) => { state = reducer(state, action); }],
      useEffect: (effect) => { effects.push(effect); },
    },
    '@/shared/hooks/useDebounce': { useDebounce: () => debounced },
    './use-professionals-listing': { useProfessionalsListing: (params) => { requested = params; return result; } },
    '../utils/professionals-page-model': model,
  });
  return {
    render: () => { effects = []; return useProfessionalsPage(); },
    flush: () => effects.forEach((effect) => effect()),
    debounce: (value) => { debounced = value; },
    result: (value) => { result = { ...result, ...value }; },
    requested: () => requested,
  };
}

test('debounced search starts on page zero; clearing search is immediate', () => {
  const page = pageHarness();
  page.render().setPage(3);
  page.render().setSearch(' Maria ');
  assert.equal(page.render().loading, true);
  assert.equal(page.requested().skip, 72);
  assert.equal(page.requested().query, undefined);
  page.debounce('Maria');
  assert.equal(page.render().page, 0);
  assert.equal(page.requested().skip, 0);
  assert.equal(page.requested().query, 'Maria');
  page.render().setPage(2);
  page.render().setSearch('');
  assert.equal(page.render().page, 0);
  assert.equal(page.requested().query, undefined);
  assert.equal(page.render().loading, false);
});

test('deleting a last-page professional recovers without flashing an empty state', () => {
  const page = pageHarness();
  page.render().setPage(2);
  page.result({ data: { data: [], meta: { total: 24 } } });
  assert.equal(page.render().loading, true);
  page.flush();
  assert.equal(page.render().page, 0);
  assert.equal(page.requested().skip, 0);
  assert.equal(lastProfessionalsPage(25), 1);
  assert.equal(lastProfessionalsPage(0), 0);
});

test('placeholder pages do not trigger premature page recovery', () => {
  const page = pageHarness();
  page.render().setPage(2);
  page.result({ isPlaceholderData: true, data: { data: [], meta: { total: 24 } } });
  page.render();
  page.flush();
  assert.equal(page.render().page, 2);
});

test('clear resets search, filters, sorting, and page in one action', () => {
  const page = pageHarness();
  page.render().applyFilters({ status: 'inactive', serviceId: 'service-a', sort: 'newest' });
  page.render().setSearch('Maria');
  page.debounce('Maria');
  page.render().setPage(3);
  page.render().clear();
  const cleared = page.render();
  assert.equal(cleared.search, '');
  assert.equal(cleared.status, 'all');
  assert.equal(cleared.serviceId, 'all');
  assert.equal(cleared.sort, 'name');
  assert.equal(cleared.page, 0);
  assert.equal(cleared.active, false);
});

test('short professional searches do not issue search queries', () => {
  const page = pageHarness();
  page.render().setSearch('Ana');
  assert.equal(page.render().loading, false);
  assert.equal(page.requested().query, undefined);
});

function serviceOptionsHarness(getAll) {
  let tenantId = 'tenant-a';
  const useAuthStore = (select) => select({ session: { activeTenant: { id: tenantId } } });
  useAuthStore.getState = () => ({ session: { activeTenant: { id: tenantId } } });
  const { useProfessionalServiceOptions } = load('app/features/professionals/hooks/use-professional-service-options.ts', {
    '@tanstack/react-query': { useQuery: (options) => options },
    '@/core/auth/use-auth-store': { useAuthStore },
    '@/features/services/api/services-api': { servicesApi: { getAll } },
    '../utils/professionals-page-model': model,
  });
  return { query: useProfessionalServiceOptions(), tenant: (value) => { tenantId = value; }, hook: useProfessionalServiceOptions };
}

test('service options fetch every page, count once, and avoid a trailing empty request', async () => {
  const requests = [];
  const harness = serviceOptionsHarness(async (params, options) => {
    requests.push({ params, options });
    return {
      data: Array.from({ length: 24 }, (_, i) => ({ id: String(params.skip + i), name: `Service ${params.skip + i}`, price: 10 })),
      meta: { total: params.count ? 48 : undefined },
    };
  });
  const { signal } = new AbortController();
  const services = await harness.query.queryFn({ signal });
  assert.equal(services.length, 48);
  assert.equal(services[47].id, '47');
  assert.equal(services[0].price, undefined);
  assert.equal(requests.length, 2);
  assert.equal(requests[0].params.count, true);
  assert.equal(requests[1].params.count, false);
  assert.equal(requests[1].params.skip, 24);
  assert.equal(requests[0].options.signal, signal);
  assert.equal(requests[0].options.tenantId, 'tenant-a');
  assert.equal(harness.query.staleTime, 60_000);
  harness.tenant(undefined);
  assert.equal(harness.hook().enabled, false);
});

test('service options stop between pages when aborted or the tenant changes', async () => {
  for (const interrupt of ['abort', 'tenant']) {
    const controller = new AbortController();
    let calls = 0;
    const harness = serviceOptionsHarness(async () => {
      calls++;
      if (interrupt === 'abort') controller.abort();
      else harness.tenant('tenant-b');
      return { data: Array.from({ length: 24 }, (_, i) => ({ id: String(i), name: 'Service' })), meta: { total: 48 } };
    });
    await assert.rejects(harness.query.queryFn({ signal: controller.signal }), /El espacio cambió/);
    assert.equal(calls, 1);
  }
});

test('service options can page without a reported total', async () => {
  let calls = 0;
  const harness = serviceOptionsHarness(async () => ({
    data: Array.from({ length: calls++ === 0 ? 24 : 1 }, (_, i) => ({ id: String(i), name: 'Service' })),
    meta: {},
  }));
  assert.equal((await harness.query.queryFn({ signal: new AbortController().signal })).length, 25);
  assert.equal(calls, 2);
});

test('header applies mobile filters together and preserves unmodified values', () => {
  let filters;
  const { ProfessionalsHeader } = load('app/features/professionals/components/professionals-header.tsx', {
    '@/shared/components/ui/responsive-filters': { ResponsiveFilters: () => null },
    '@/shared/components/ui': { Button: () => null },
    '@/shared/components/ui/select': { Select: () => null },
    '@/shared/components/form/input': { Input: () => null },
  });
  const tree = ProfessionalsHeader({
    search: '', status: 'active', serviceId: 'all', sort: 'name', services: [],
    servicesLoading: false, servicesError: false, canCreate: false,
    onSearchChange() {}, onFiltersChange: (values) => { filters = values; },
    onRetryServices() {}, onCreate() {},
  });
  tree.props.children[1].props.onApply({ 'Servicio asignado': 'service-a', 'Ordenar por': 'newest' });
  assert.equal(filters.status, 'active');
  assert.equal(filters.serviceId, 'service-a');
  assert.equal(filters.sort, 'newest');
});

test('page mounts one responsive view and scopes page state to the tenant', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  let desktop = true;
  let tenantId = 'tenant-a';
  let pageCalls = 0;
  const { Professionals } = load('app/features/professionals/components/professionals.tsx', {
    '@/core/auth/permissions': { can: () => true },
    '@/features/billing/hooks/use-billing-subscription': { useBillingSummary: () => ({}) },
    '@/features/billing/utils/resource-limit': { hasFreeResourceLimit: () => false },
    '@/core/auth/use-auth-store': { useAuthStore: (select) => select({ session: { activeTenant: tenantId ? { id: tenantId } : null } }) },
    '@/shared/hooks/useMediaQuery': { useMediaQuery: () => desktop },
    '@/shared/hooks/use-overlay': { useOverlay: () => ({ open() {} }) },
    '@/shared/components/feedback/EmptyState': { EmptyState: () => null },
    '@/shared/components/ui': { Button: ({ children }) => React.createElement('button', null, children) },
    '@/shared/components/ui/table': { TableSkeleton: () => React.createElement('span', null, 'loading') },
    './list/professionals-card': { ProfessionalsCard: () => React.createElement('span', null, 'mobile-card') },
    './table/professionals-table': { ProfessionalsTable: () => React.createElement('span', null, 'desktop-table') },
    './professionals-header': { ProfessionalsHeader: () => null },
    '../utils/professionals-page-model': model,
    '../hooks/use-professional-service-options': { useProfessionalServiceOptions: () => ({ data: [] }) },
    '../hooks/use-professionals-page': { useProfessionalsPage: () => {
      pageCalls++;
      return { ...initialProfessionalsState, professionals: [{ id: 'p1' }], total: 1, query: {} };
    } },
  });
  const desktopHtml = renderToStaticMarkup(React.createElement(Professionals));
  assert.match(desktopHtml, /desktop-table/);
  assert.doesNotMatch(desktopHtml, /mobile-card/);
  desktop = false;
  const mobileHtml = renderToStaticMarkup(React.createElement(Professionals));
  assert.match(mobileHtml, /mobile-card/);
  assert.doesNotMatch(mobileHtml, /desktop-table/);
  assert.equal(Professionals().key, 'tenant-a');
  tenantId = 'tenant-b';
  assert.equal(Professionals().key, 'tenant-b');
  tenantId = undefined;
  pageCalls = 0;
  assert.match(renderToStaticMarkup(React.createElement(Professionals)), /loading/);
  assert.equal(pageCalls, 0);
});
