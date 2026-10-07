const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(path, dependencies = {}) {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { exports, require: (id) => dependencies[id] },
  );
  return exports;
}
const model = load('app/features/customers/utils/customers-page-model.ts');
const { initialCustomersState, customersPageReducer, customersPageParams, canKeepCustomerResults, lastCustomersPage } = model;

test('mobile filters commit together and reset pagination without dropping search', () => {
  const next = customersPageReducer(
    { ...initialCustomersState, search: 'Ana', query: 'Ana', page: 3 },
    { type: 'filters', filters: { status: 'blocked', activity: 'upcoming', sort: 'spending' } },
  );
  const params = customersPageParams(next);
  assert.equal(params.skip, 0);
  assert.equal(params.take, 24);
  assert.equal(params.query, 'Ana');
  assert.equal(params.status, 'blocked');
  assert.equal(params.bookingActivity, 'upcoming');
  assert.equal(params.orderBy, 'totalSpent');
  assert.equal(params.order, 'desc');
});

test('pagination cache cannot cross tenants or changed criteria', () => {
  const params = customersPageParams(initialCustomersState);
  const key = ['customers', 'tenant-a', params];
  assert.equal(canKeepCustomerResults('tenant-a', { ...params, skip: 24 }, key), true);
  for (const [field, value] of [
    ['query', 'Ana'], ['status', 'blocked'], ['bookingActivity', 'never-booked'],
    ['orderBy', 'totalSpent'], ['order', 'desc'], ['take', 48],
  ]) {
    assert.equal(canKeepCustomerResults('tenant-a', { ...params, [field]: value }, key), false);
  }
  assert.equal(canKeepCustomerResults('tenant-b', params, key), false);
  assert.equal(canKeepCustomerResults(undefined, params, key), false);
  assert.equal(canKeepCustomerResults('tenant-a', undefined, key), false);
  assert.equal(canKeepCustomerResults('tenant-a', params, ['customers', 'tenant-a']), false);
});

test('query waits for a tenant and forwards cancellation and tenant identity', async () => {
  let tenantId = 'tenant-a';
  let request;
  const { useCustomers } = load('app/features/customers/hooks/use-customers.ts', {
    '../utils/customers-page-model': model,
    '@tanstack/react-query': { useQuery: (options) => options },
    '@/core/auth/use-auth-store': { useAuthStore: (selector) => selector({ session: { activeTenant: { id: tenantId } } }) },
    '../api/customer-api': { customerApi: { getAll: async (params, options) => { request = { params, options }; } } },
  });
  const params = customersPageParams(initialCustomersState);
  const query = useCustomers(params);
  assert.equal(query.queryKey[1], tenantId);
  assert.equal(query.enabled, true);
  const { signal } = new AbortController();
  await query.queryFn({ signal });
  assert.equal(request.options.signal, signal);
  assert.equal(request.options.tenantId, tenantId);
  assert.equal(query.placeholderData('previous', { queryKey: ['customers', tenantId, params] }), 'previous');
  tenantId = 'tenant-b';
  assert.equal(useCustomers(params).placeholderData('private', { queryKey: query.queryKey }), undefined);
  tenantId = undefined;
  assert.equal(useCustomers(params).enabled, false);
});

test('API forwards the abort signal and expected tenant to the HTTP client', () => {
  let request;
  const { customerApi } = load('app/features/customers/api/customer-api.ts', {
    '@/core/http/httpClient': { httpClient: { get: (url, config) => { request = { url, config }; } } },
  });
  const { signal } = new AbortController();
  const params = { query: 'Ana', skip: 0, take: 24 };
  customerApi.getAll(params, { signal, tenantId: 'tenant-a' });
  assert.equal(request.url, '/customers');
  assert.equal(request.config.signal, signal);
  assert.equal(request.config.expectedTenantId, 'tenant-a');
  assert.equal(request.config.params, params);
});

// Exercise the hook's request/effect seam with controlled debounce and query results.
function pageHarness() {
  let state = { ...initialCustomersState };
  let debounced = '';
  let result = { isLoading: false, isEnabled: true, isPlaceholderData: false };
  let effects = [];
  let requested;
  const { useCustomersPage } = load('app/features/customers/hooks/use-customers-page.ts', {
    react: {
      useReducer: (reducer) => [state, (action) => { state = reducer(state, action); }],
      useEffect: (effect) => { effects.push(effect); },
    },
    '@/shared/hooks/useDebounce': { useDebounce: () => debounced },
    './use-customers': { useCustomers: (params) => { requested = params; return result; } },
    '../utils/customers-page-model': model,
  });
  return {
    render: () => { effects = []; return useCustomersPage(); },
    flush: () => effects.forEach((effect) => effect()),
    debounce: (value) => { debounced = value; },
    result: (value) => { result = { ...result, ...value }; },
    requested: () => requested,
  };
}

test('debounced search starts on page zero; clearing search is immediate', () => {
  const page = pageHarness();
  page.render().setPage(3);
  page.render().setSearch(' Ana ');
  assert.equal(page.render().loading, true);
  assert.equal(page.requested().skip, 72);
  assert.equal(page.requested().query, undefined);
  page.debounce('Ana');
  assert.equal(page.render().page, 0);
  assert.equal(page.requested().skip, 0);
  assert.equal(page.requested().query, 'Ana');
  page.render().setPage(2);
  page.render().setSearch('');
  assert.equal(page.render().page, 0);
  assert.equal(page.requested().query, undefined);
  assert.equal(page.render().loading, false);
});

test('deleting a last-page customer recovers without flashing an empty state', () => {
  const page = pageHarness();
  page.render().setPage(2);
  page.result({ data: { data: [], meta: { total: 24 } } });
  assert.equal(page.render().loading, true);
  page.flush();
  assert.equal(page.render().page, 0);
  assert.equal(page.requested().skip, 0);
  assert.equal(lastCustomersPage(25), 1);
  assert.equal(lastCustomersPage(0), 0);
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
  page.render().applyFilters({ status: 'blocked', activity: 'never-booked', sort: 'last-visit' });
  page.render().setSearch('Ana');
  page.debounce('Ana');
  page.render().setPage(3);
  page.render().clear();
  const cleared = page.render();
  assert.equal(cleared.search, '');
  assert.equal(cleared.status, 'all');
  assert.equal(cleared.activity, 'all');
  assert.equal(cleared.sort, 'name');
  assert.equal(cleared.page, 0);
  assert.equal(cleared.active, false);
});

test('customer listing requires three trimmed characters and clears shorter searches immediately', () => {
  const page = pageHarness();
  for (const value of ['A', 'An', '  An  ', '   ']) {
    page.render().setSearch(value);
    assert.equal(page.render().loading, false);
    assert.equal(page.requested().query, undefined);
  }
  page.render().setSearch(' Ana ');
  assert.equal(page.render().loading, true);
  page.debounce('Ana');
  assert.equal(page.render().loading, false);
  assert.equal(page.requested().query, 'Ana');
  page.render().setPage(2);
  page.render().setSearch('An');
  assert.equal(page.render().page, 0);
  assert.equal(page.render().loading, false);
  assert.equal(page.requested().query, undefined);
});
