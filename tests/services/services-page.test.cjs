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
const model = load('app/features/services/utils/services-page-model.ts');
const { initialServicesState, servicesPageReducer, servicesPageParams, canKeepServiceResults, lastServicesPage } = model;
test('mobile filters apply together and reset pagination while preserving search', () => {
  const next = servicesPageReducer(
    { ...initialServicesState, query: 'massage', page: 3 },
    {
      type: 'filters',
      filters: { status: 'inactive', duration: 'long', discount: 'with', sort: 'price-desc' },
    },
  );
  const params = servicesPageParams(next);
  assert.equal(params.skip, 0);
  assert.equal(params.query, 'massage');
  assert.equal(params.isActive, false);
  assert.equal(params.duration, 'long');
  assert.equal(params.discount, 'with');
  assert.equal(params.orderBy, 'price');
  assert.equal(params.order, 'desc');
});
test('search commits reset the page and clear restores all defaults', () => {
  const next = servicesPageReducer({ ...initialServicesState, page: 3 }, { type: 'query', value: 'haircut' });
  assert.equal(next.page, 0);
  assert.equal(servicesPageParams(next).query, 'haircut');
  const cleared = servicesPageReducer(next, { type: 'clear' });
  assert.equal(JSON.stringify(cleared), JSON.stringify(initialServicesState));
});
test('placeholder results stay only across pages with identical tenant and filters', () => {
  const params = servicesPageParams(initialServicesState);
  const key = ['services', 'tenant-a', params];
  assert.equal(canKeepServiceResults('tenant-a', { ...params, skip: 24 }, key), true);
  for (const [field, value] of [
    ['query', 'haircut'],
    ['isActive', false],
    ['duration', 'short'],
    ['discount', 'with'],
    ['professionalId', 'p1'],
    ['order', 'desc'],
    ['orderBy', 'price'],
    ['take', 48],
    ['count', false],
  ]) {
    assert.equal(canKeepServiceResults('tenant-a', { ...params, [field]: value }, key), false);
  }
  assert.equal(canKeepServiceResults('tenant-b', params, key), false);
  assert.equal(canKeepServiceResults(undefined, params, key), false);
});
test('deleting the last row recovers the previous page or page zero', () => {
  assert.equal(lastServicesPage(24), 0);
  assert.equal(lastServicesPage(25), 1);
  assert.equal(lastServicesPage(0), 0);
});
test('service query is tenant-scoped, waits for a tenant, and forwards cancellation', async () => {
  let tenantId = 'tenant-a';
  let request;
  const { useServices } = load('app/features/services/hooks/use-services.ts', {
    '../utils/services-page-model': model,
    '@tanstack/react-query': { useQuery: (options) => options },
    '@/core/auth/use-auth-store': { useAuthStore: (selector) => selector({ session: { activeTenant: { id: tenantId } } }) },
    '../api/services-api': {
      servicesApi: {
        getAll: async (params, options) => {
          request = { params, options };
        },
      },
    },
  });
  const params = servicesPageParams(initialServicesState);
  const query = useServices(params);
  assert.equal(query.queryKey[1], tenantId);
  assert.equal(query.enabled, true);
  const { signal } = new AbortController();
  await query.queryFn({ signal });
  assert.equal(request.options.signal, signal);
  assert.equal(request.options.tenantId, tenantId);
  tenantId = undefined;
  assert.equal(useServices(params).enabled, false);
});
