const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function load(path, overrides = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { exports, require: (id) => id in overrides ? overrides[id] : require(id) });
  return exports;
}
const permissions = load('app/core/auth/permissions.ts');
const constants = load('../backend/src/common/security/constants/permissions.constant.ts');
const { ROLE_PERMISSIONS } = load('../backend/src/common/security/constants/role-permissions.constants.ts', { './permissions.constant': constants });
const canCancel = load('app/features/appointments/utils/can-cancel.ts', { '@/core/auth/permissions': permissions });
const canReschedule = load('app/features/appointments/utils/can-reschedule.ts', { '@/core/auth/permissions': permissions });
const menu = new Proxy({}, { get: () => ({ children }) => React.createElement('div', null, children) });

function fixture(status, role = 'STAFF', professionalId = 'own', startsAt = '2020-01-01T12:00:00Z', pending = false) {
  const calls = [];
  const tenant = { id: 'tenant', professionalId: 'own', permissions: ROLE_PERMISSIONS[role] };
  const { AppointmentActions } = load('app/features/appointments/components/ui/appointment-actions.tsx', {
    react: { ...React, useRef: () => ({ current: null }) },
    '@/core/auth/permissions': permissions,
    '@/core/auth/use-auth-store': { useAuthStore: Object.assign((select) => select({ session: { id: 'account', activeTenant: tenant } }), { getState: () => ({ session: { id: 'account', activeTenant: tenant } }) }) },
    '@/shared/hooks/use-overlay': { useOverlay: (key) => ({ open: (props) => calls.push({ key, props }) }) },
    '@/shared/components/ui': { Button: ({ children, disabled }) => React.createElement('button', { disabled }, children) },
    '@radix-ui/react-dropdown-menu': menu,
    '../../utils/can-cancel': canCancel,
    '../../utils/can-reschedule': canReschedule,
    '../../hooks/use-appointment-status': { useAppointmentStatus: (id, tenantId) => ({ isPending: pending, mutate: (status) => calls.push({ id, tenantId, status }) }) },
    sonner: { toast: { success() {}, error() {} } },
  });
  const tree = AppointmentActions({ appointment: { id: 'appointment', status, professionalId, startsAt } });
  return { tree, calls, html: renderToStaticMarkup(tree) };
}
function item(tree, label) {
  if (!tree || typeof tree !== 'object') return;
  if (tree.props?.onSelect && React.Children.toArray(tree.props.children).includes(label)) return tree;
  for (const child of React.Children.toArray(tree.props?.children)) {
    const found = item(child, label); if (found) return found;
  }
}

test('Ver cita is first and outcomes are absent from every Agenda menu', () => {
  for (const status of ['PENDING', 'CONFIRMED', 'COMPLETED', 'NO_SHOW', 'CANCELLED']) {
    const f = fixture(status);
    assert.match(f.html, /Ver cita/);
    assert.doesNotMatch(f.html, /Confirmar|Completar|Marcar ausente|Corregir a ausente/);
    assert.ok(f.html.indexOf('Ver cita') < f.html.indexOf('Crear otra') || !f.html.includes('Crear otra'));
  }
});
test('STAFF can view only own appointments; ADMIN can view others', () => {
  assert.doesNotMatch(fixture('CONFIRMED', 'STAFF', 'other').html, /Ver cita/);
  assert.match(fixture('CONFIRMED', 'ADMIN', 'other').html, /Ver cita/);
});
test('cancelled appointments retain Crear otra and no-show cannot reschedule', () => {
  assert.match(fixture('CANCELLED').html, /Crear otra/);
  assert.doesNotMatch(fixture('NO_SHOW').html, /Reagendar/);
});

function drawer(status, options = {}) {
  const calls = [];
  const tenant = { id: 'tenant', professionalId: 'own', permissions: options.readOnly ? ['appointment:read'] : ROLE_PERMISSIONS.STAFF };
  const appointment = { id: 'appointment', professionalId: 'own', status, startsAt: options.future ? '2100-01-01T12:00:00Z' : '2020-01-01T12:00:00Z', endsAt: '2020-01-01T13:00:00Z', durationMinutes: 60, price: '100.50', discountAmount: '20.25', confirmationCode: 'SECRET', serviceName: 'Servicio', ...options.appointment };
  const session = { id: 'account', activeTenant: tenant };
  const useAuthStore = (select) => select({ session });
  useAuthStore.getState = () => ({ session });
  const primitive = ({ children }) => React.createElement('div', null, children);
  const { ViewAppointmentDrawer } = load('app/features/appointments/components/overlays/view-appointment-drawer.tsx', {
    react: { ...React, useEffect() {}, useRef: () => ({ current: false }), useState: (initial) => [initial, () => {}] },
    '@/shared/components/ui/drawer': { Drawer: primitive, DrawerBody: primitive, DrawerFooter: primitive },
    '@/shared/components/ui/card': { Card: primitive },
    '@/shared/components/typography': { Heading: primitive, Text: primitive },
    '@/shared/utils/format-phone': load('app/shared/utils/format-phone.ts'),
    '@tanstack/react-query': { useQuery: ({ queryKey }) => queryKey[0] === 'services' ? ({ data: options.service }) : ({ data: appointment, isFetchedAfterMount: true, ...options.query }), useQueryClient: () => ({ setQueryData() {} }) },
    '@/core/auth/use-auth-store': { useAuthStore },
    '@/core/auth/permissions': permissions,
    '@/core/error/api-error': { ApiError: class extends Error {} },
    '@/shared/hooks/use-overlay': { useOverlay: () => ({ isVisible: true, close() {} }) },
    '@/shared/components/ui/button': { Button: ({ children, disabled, onClick }) => React.createElement('button', { disabled, onClick }, children) },
    '@/shared/components/ui/avatar': { Avatar: primitive },
    '@/shared/utils/currency': { formatCurrency: (v) => v.toFixed(2) },
    '@/features/services/api/services-api': {},
    '@/features/services/components/service-thumbnail': { ServiceThumbnail: ({ imageUrl }) => React.createElement('img', { src: imageUrl, alt: '' }) },
    '../../api/appointments-api': {},
    '../../hooks/use-appointment-status': { useAppointmentStatus: () => ({ isPending: Boolean(options.pending), mutateAsync: async (status) => { calls.push(status); if (options.fail) throw new Error('Failed'); return { ...appointment, status }; } }) },
    '../../utils/appointment-display': { appointmentDisplayDate: () => '01/01/2020', appointmentDisplayTime: () => '12:00' },
    '../status-badge': { StatusBadge: ({ status }) => React.createElement('span', null, status) },
    sonner: { toast: { success() {}, error() {} } },
  });
  const tree = ViewAppointmentDrawer({ appointment, tenantId: 'tenant', accountId: 'account' });
  return { html: renderToStaticMarkup(tree), tree, calls };
}
function button(tree, label) {
  if (!tree || typeof tree !== 'object') return;
  if (tree.props?.onClick && tree.props.children === label) return tree;
  for (const child of React.Children.toArray(tree.props?.children)) { const result = button(child, label); if (result) return result; }
}
test('drawer displays saved prices, missing fields and never the management token', () => {
  const f = drawer('CONFIRMED');
  assert.match(f.html, /100.50/); assert.match(f.html, /20.25/); assert.match(f.html, /80.25/);
  assert.match(f.html, /Sin cliente/); assert.match(f.html, /Sin teléfono/); assert.match(f.html, /Sin email/); assert.match(f.html, /Sin notas/);
  assert.doesNotMatch(f.html, /SECRET/);
});
test('outcome availability covers future, corrections, cancelled and read-only states', () => {
  for (const status of ['PENDING', 'CONFIRMED']) {
    assert.equal(button(drawer(status).tree, 'Completar').props.disabled, false);
    const future = drawer(status, { future: true });
    assert.equal(button(future.tree, 'Completar').props.disabled, true);
    assert.equal(button(future.tree, 'No vino').props.disabled, true);
    assert.match(future.html, /cuando comience/);
  }
  assert.equal(button(drawer('COMPLETED').tree, 'Completar'), undefined);
  assert.equal(button(drawer('NO_SHOW').tree, 'No vino'), undefined);
  assert.equal(button(drawer('CANCELLED').tree, 'Completar'), undefined);
  assert.equal(button(drawer('CONFIRMED', { readOnly: true }).tree, 'Completar'), undefined);
  assert.equal(button(drawer('CONFIRMED', { pending: true }).tree, 'No vino').props.disabled, true);
  assert.equal(button(drawer('CONFIRMED', { query: { isFetching: true } }).tree, 'Completar').props.disabled, true);
});
test('direct submission suppresses duplicate clicks and failed requests allow retry', async () => {
  const f = drawer('CONFIRMED');
  await Promise.all([button(f.tree, 'Completar').props.onClick(), button(f.tree, 'Completar').props.onClick()]);
  assert.deepEqual(f.calls, ['COMPLETED']);
  const failed = drawer('CONFIRMED', { fail: true });
  await button(failed.tree, 'No vino').props.onClick();
  await button(failed.tree, 'No vino').props.onClick();
  assert.deepEqual(failed.calls, ['NO_SHOW', 'NO_SHOW']);
});

test('Ver cita captures the appointment, tenant and account when opening', () => {
  const f = fixture('CANCELLED');
  item(f.tree, 'Ver cita').props.onSelect();
  assert.equal(f.calls[0].key, 'view-appointment-drawer');
  assert.equal(f.calls[0].props.tenantId, 'tenant');
  assert.equal(f.calls[0].props.accountId, 'account');
  assert.equal(f.calls[0].props.appointment.id, 'appointment');
});

test('drawer formats both contacts and shows professional details from the appointment response', () => {
  const f = drawer('CONFIRMED', { appointment: {
    customerPhone: '099123456', customerPhoneCountryCode: '+598', customerEmail: 'cliente@example.com',
    professionalPhone: '987654321', professionalPhoneCountryCode: '+51', professionalEmail: 'profesional@example.com',
    professionalName: 'Ana Pérez', professionalBio: 'Especialista en color y cuidado del cabello.',
  } });
  assert.match(f.html, /\+598 99 123 456/);
  assert.match(f.html, /\+51 987 654 321/);
  assert.match(f.html, /Ana Pérez/);
  assert.match(f.html, /profesional@example.com/);
  assert.match(f.html, /Especialista en color/);
});

test('service presentation uses catalog image and description with the saved appointment price', () => {
  const f = drawer('CONFIRMED', { service: { imageUrl: '/service.jpg', description: 'Una descripción breve del servicio.', price: 999 } });
  assert.match(f.html, /service.jpg/);
  assert.match(f.html, /Una descripción breve del servicio/);
  assert.match(f.html, /100.50/);
  assert.doesNotMatch(f.html, /999/);
});
