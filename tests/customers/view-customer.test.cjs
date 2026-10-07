const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { formatInTimeZone } = require('date-fns-tz');
function load(path, overrides = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { exports, require: (id) => id in overrides ? overrides[id] : require(id) });
  return exports;
}
const permissions = load('app/core/auth/permissions.ts');
class ApiError extends Error { constructor(message, status) { super(message); this.status = status; } }
const customer = {
  id: 'customer', name: 'Ana', phoneNumber: '099123456', phoneCountryCode: '598', email: null,
  createdAt: '2026-10-01T01:00:00Z', firstAppointmentAt: null, lastAppointmentAt: null,
  totalAppointments: 7, completedAppointments: 4, cancelledAppointments: 2, noShowCount: 1,
  totalSpent: '1200.50', notes: null, blockedAt: null, blockedReason: null,
};
function render(options = {}) {
  const requests = []; const effects = []; let closes = 0; let retries = 0;
  const session = { id: options.accountId ?? 'account', activeTenant: {
    id: options.tenantId ?? 'tenant', timeZone: 'America/Montevideo', professionalId: 'own',
    permissions: options.permissions ?? ['customer:read'],
  } };
  const primitive = ({ children }) => React.createElement('div', null, children);
  const { ViewCustomerModal } = load('app/features/customers/components/overlays/view-customer-modal.tsx', {
    react: { ...React, useEffect: (fn) => effects.push(fn) },
    '@tanstack/react-query': { useQuery: (config) => { requests.push(config); return { data: customer, isSuccess: true, refetch: () => retries++, ...options.query }; } },
    '@/core/auth/use-auth-store': { useAuthStore: (select) => select({ session }) },
    '@/core/auth/permissions': permissions,
    '@/core/error/api-error': { ApiError },
    '@/shared/hooks/use-overlay': { useOverlay: () => ({ isVisible: true, close: () => closes++ }) },
    '@/shared/components/ui/modal': { Modal: primitive },
    '@/shared/components/ui/badge': load('app/shared/components/ui/badge.tsx'),
    '@/shared/components/ui/button': { Button: ({ children, onClick }) => React.createElement('button', { onClick }, children) },
    '@/shared/components/typography': { Text: primitive },
    '@/shared/utils/format-phone': load('app/shared/utils/format-phone.ts'),
    '@/shared/utils/currency': { formatCurrency: (v) => Number(v).toFixed(2) },
    '@/features/appointments/utils/appointment-display': { appointmentDisplayDate: (date, tz) => formatInTimeZone(date, tz, 'dd/MM/yyyy') },
    '../../api/customer-api': { customerApi: { getById: (id, config) => ({ id, ...config }) } },
  });
  const tree = ViewCustomerModal({ customerId: 'customer', tenantId: 'tenant', accountId: 'account' });
  effects.forEach((fn) => fn());
  return { tree, html: renderToStaticMarkup(tree), requests, closes: () => closes, retries: () => retries };
}
function findClick(tree) {
  if (!tree || typeof tree !== 'object') return;
  if (tree.props?.onClick) return tree.props.onClick;
  for (const child of React.Children.toArray(tree.props?.children)) { const click = findClick(child); if (click) return click; }
}
test('customer modal shows real aggregate fields, formatted contact, money and business-local dates', () => {
  const f = render();
  assert.match(f.html, /7 citas registradas.*4 completadas.*2 canceladas.*1 ausencias/);
  assert.match(f.html, /1200.50/);
  assert.match(f.html, /\+598 99 123 456/);
  assert.match(f.html, /Sin email/); assert.match(f.html, /Sin notas/);
  assert.match(f.html, /30\/09\/2026/);
  assert.match(f.html, /Primera cita programada/);
  assert.doesNotMatch(f.html, /Última visita/);
});
test('detail query captures customer, tenant, account and authorization and forwards cancellation', () => {
  const f = render(); const signal = {};
  assert.deepEqual(JSON.parse(JSON.stringify(f.requests[0].queryFn({ signal }))), { id: 'customer', tenantId: 'tenant', signal });
  assert.equal(f.requests[0].enabled, true);
  assert.equal(f.requests[0].queryKey[1], 'tenant');
  assert.equal(f.requests[0].queryKey[3], 'customer');
  assert.match(f.requests[0].queryKey[4], /account.*customer:read/);
});
test('tenant/account change or lost read permission hides and closes the modal', () => {
  for (const options of [{ tenantId: 'other' }, { accountId: 'other' }, { permissions: [] }]) {
    const f = render(options); assert.equal(f.html, ''); assert.equal(f.requests[0].enabled, false); assert.equal(f.closes(), 1);
  }
});
test('loading, null/deleted customer, forbidden and retryable errors have explicit states', () => {
  assert.match(render({ query: { data: undefined, isSuccess: false } }).html, /Cargando cliente/);
  assert.match(render({ query: { data: null } }).html, /ya no está disponible/);
  const forbidden = render({ query: { data: undefined, isError: true, error: new ApiError('Forbidden', 403) } });
  assert.match(forbidden.html, /ya no está disponible/); assert.doesNotMatch(forbidden.html, /Reintentar/);
  const f = render({ query: { data: undefined, isError: true, error: new Error('Sin conexión') } });
  assert.match(f.html, /Sin conexión/); findClick(f.tree)(); assert.equal(f.retries(), 1);
});
test('empty and blocked customers show their actual states', () => {
  assert.match(render({ query: { data: { ...customer, totalAppointments: 0 } } }).html, /Todavía no tiene citas/);
  const f = render({ query: { data: { ...customer, blockedAt: '2026-10-01', blockedReason: 'Inasistencias reiteradas' } } });
  assert.match(f.html, /Bloqueado/); assert.match(f.html, /Inasistencias reiteradas/);
});

test('Ver opens the shared desktop/mobile customer modal with captured identity', () => {
  const calls = [];
  const session = { id: 'account', activeTenant: { id: 'tenant' } };
  const menu = new Proxy({}, { get: () => ({ children }) => React.createElement('div', null, children) });
  const { CustomerActions } = load('app/features/customers/components/table/customer-actions.tsx', {
    react: { ...React, useRef: () => ({ current: null }) },
    '@/core/auth/use-auth-store': { useAuthStore: { getState: () => ({ session }) } },
    '@/core/auth/use-permissions': { usePermissions: () => ({ can: (permission) => permission === 'customer:read' }) },
    '@/shared/hooks/use-overlay': { useOverlay: (key) => ({ open: (props) => calls.push({ key, props }) }) },
    '@radix-ui/react-dropdown-menu': menu,
  });
  const tree = CustomerActions({ customer });
  function findSelect(node) {
    if (!node || typeof node !== 'object') return;
    if (node.props?.onSelect) return node.props.onSelect;
    for (const child of React.Children.toArray(node.props?.children)) { const callback = findSelect(child); if (callback) return callback; }
  }
  findSelect(tree)();
  assert.equal(calls[0].key, 'view-customer-modal');
  assert.equal(calls[0].props.customerId, 'customer');
  assert.equal(calls[0].props.tenantId, 'tenant');
  assert.equal(calls[0].props.accountId, 'account');
});
