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
const constants = load('../backend/src/common/security/constants/permissions.constant.ts');
const { ROLE_PERMISSIONS } = load('../backend/src/common/security/constants/role-permissions.constants.ts', { './permissions.constant': constants });
const permissions = load('app/core/auth/permissions.ts');
const { can, canManageAppointment, canAccessArea } = permissions;
const tenant = (role) => ({ id: 'tenant', slug: 'business', role, professionalId: 'own', permissions: ROLE_PERMISSIONS[role] });

test('frontend reads backend permissions and denies missing sessions without a role fallback', () => {
  assert.equal(can(null, 'professional:create'), false);
  assert.equal(can({ role: 'OWNER' }, 'professional:create'), false);
  assert.equal(can(tenant('STAFF'), 'customer:create'), true);
  assert.equal(can(tenant('STAFF'), 'customer:update'), false);
  assert.equal(can(tenant('ADMIN'), 'tenant:update'), true);
  for (const role of ['OWNER', 'ADMIN', 'STAFF']) {
    assert.equal(can(tenant(role), 'billing:read'), role === 'OWNER');
    assert.equal(can(tenant(role), 'professional:create'), role !== 'STAFF');
  }
});
test('STAFF areas match its allowed resources and block direct management URLs', () => {
  for (const area of ['calendar', 'services', 'customers', 'profile']) assert.equal(canAccessArea(tenant('STAFF'), area), true);
  for (const area of ['', 'professionals', 'settings', 'reports', 'billing']) assert.equal(canAccessArea(tenant('STAFF'), area), false);
  for (const area of ['', 'professionals', 'settings', 'reports']) assert.equal(canAccessArea(tenant('ADMIN'), area), true);
});
test('appointment actions require the base permission and professional ownership or an others permission', () => {
  for (const action of ['read', 'create', 'update', 'cancel', 'reschedule']) {
    assert.equal(canManageAppointment(tenant('STAFF'), action, 'own'), true);
    assert.equal(canManageAppointment(tenant('STAFF'), action, 'other'), false);
    assert.equal(canManageAppointment({ ...tenant('STAFF'), professionalId: null }, action, null), false);
    assert.equal(canManageAppointment(tenant('ADMIN'), action, 'other'), true);
  }
  assert.equal(canManageAppointment({ professionalId: 'own', permissions: ['appointment:cancel_others'] }, 'cancel', 'own'), false);
});
test('restricted overlays cannot open, even if called directly', () => {
  const { canOpenOverlay } = load('app/core/auth/overlay-permissions.ts', { './permissions': permissions });
  for (const key of ['create-professional-modal', 'update-professional-drawer', 'delete-professional-modal',
    'create-service-modal', 'update-service-modal', 'delete-service-modal', 'update-customer-modal',
    'delete-customer-modal', 'block-customer-modal', 'team-action-modal', 'add-exception-modal']) {
    assert.equal(canOpenOverlay(tenant('STAFF'), key), false, key);
    assert.equal(canOpenOverlay(tenant('ADMIN'), key), true, key);
  }
  assert.equal(canOpenOverlay(tenant('STAFF'), 'create-customer-modal'), true);
  assert.equal(canOpenOverlay(tenant('STAFF'), 'reschedule-appointment-drawer', { appointment: { professionalId: 'other' } }), false);
  assert.equal(canOpenOverlay(tenant('STAFF'), 'reschedule-appointment-drawer', { appointment: { professionalId: 'own' } }), true);
});
const menu = new Proxy({}, { get: (_target, name) => name === 'Separator' ? () => React.createElement('hr') : ({ children }) => React.createElement('div', null, children) });
const button = ({ children }) => React.createElement('button', null, children);
function renderActions(path, role, props) {
  const { usePermissions } = { usePermissions: () => ({ can: (permission) => can(tenant(role), permission) }) };
  const module = load(path, {
    '@radix-ui/react-dropdown-menu': menu,
    '@/core/auth/use-permissions': { usePermissions },
    '@/core/auth/permissions': permissions,
    '@/core/auth/use-auth-store': { useAuthStore: (select) => select({ session: { activeTenant: tenant(role) } }) },
    '@/shared/hooks/use-overlay': { useOverlay: () => ({ open() {} }) },
    '@/shared/components/ui': { Button: button },
  });
  const Component = Object.values(module)[0];
  return renderToStaticMarkup(React.createElement(Component, props));
}
test('STAFF professional and service menus disappear; customer read/booking remains', () => {
  assert.equal(renderActions('app/features/professionals/components/list/professional-actions.tsx', 'STAFF', { professional: { id: 'other' } }), '');
  assert.equal(renderActions('app/features/services/components/grid/service-actions.tsx', 'STAFF', { service: {} }), '');
  const customer = renderActions('app/features/customers/components/table/customer-actions.tsx', 'STAFF', { customer: { id: 'customer', name: 'Ana' } });
  assert.match(customer, /Agendar cita/);
  assert.match(customer, /Ver/);
  assert.doesNotMatch(customer, /Editar|Eliminar|Bloquear|Desbloquear/);
  const admin = renderActions('app/features/customers/components/table/customer-actions.tsx', 'ADMIN', { customer: { id: 'customer' } });
  assert.match(admin, /Editar/);
  assert.match(admin, /Eliminar/);
  assert.match(admin, /Bloquear/);
});

function bookingDrawer(role, professionalId = 'own') {
  const calls = {};
  const bookingTenant = { ...tenant(role), professionalId };
  const container = ({ children }) => React.createElement('div', null, children);
  const options = {
    SectionHeader: ({ title, description }) => React.createElement('div', null, title, description),
    ServiceOption: ({ service }) => React.createElement('div', null, service.name),
    ProfessionalOption: ({ professional }) => React.createElement('div', null, professional.name),
    EmptyInline: ({ text }) => React.createElement('p', null, text),
  };
  const { CreateAppointmentDrawer } = load('app/features/appointments/components/overlays/create-appointment-drawer.tsx', {
    react: { ...React, useEffect() {}, useRef: (value) => ({ current: value }), useState: (value) => [typeof value === 'function' ? value() : value, () => {}] },
    'react-router': { useLocation: () => ({ pathname: '/business/calendar' }) },
    '@/core/auth/use-auth-store': { useAuthStore: (select) => select({ session: { activeTenant: bookingTenant } }) },
    '@/core/auth/permissions': permissions,
    '@/shared/hooks/use-overlay': { useOverlay: () => ({ close() {}, open() {} }) },
    '@/shared/components/ui': { Button: button, Drawer: container },
    '@/shared/components/ui/drawer': { DrawerBody: container, DrawerFooter: container },
    '@/shared/components/ui/spinner': { Spinner: () => null },
    '@/features/customers/hooks/use-customer-search': { useCustomerSearch: () => ({ data: [] }) },
    '@/features/appointments/hooks/use-create-appointment': { useCreateAppointment: () => ({ mutate: (data) => { calls.created = data; }, isPending: false }) },
    '@/features/appointments/schemas/create-appointment-schema': { createAppointmentSchema: { safeParse: (data) => ({ success: true, data }) } },
    '@/features/services': {
      useServices: (params, enabled) => { calls.services = { params, enabled }; return { data: { data: enabled ? [{ id: 'service', name: 'Assigned service' }] : [] }, isLoading: false }; },
      useServiceProfessionals: (id, enabled) => { calls.professionals = { id, enabled }; return { data: enabled ? [{ id: 'other', name: 'Other professional' }] : [] }; },
    },
    '../../hooks/use-appointment-drawer-schedule': { useAppointmentDrawerSchedule: (selection) => {
      calls.schedule = selection;
      return { hasValidSelection: true, selectedSlot: { startsAt: '2030-01-07T12:00:00Z' }, clearSelection() {}, days: [], slots: [], availability: {} };
    } },
    './appointment-drawer-customer-section': { AppointmentDrawerCustomerSection: () => null },
    './appointment-selection-summary': { AppointmentSelectionSummary: () => null },
    './appointment-drawer-schedule-section': { AppointmentDrawerScheduleSection: () => null },
    './appointment-drawer-options': options,
  });
  const tree = CreateAppointmentDrawer({ defaultServiceId: 'service', defaultProfessionalId: 'other' });
  function findSubmit(element) {
    if (!element || typeof element !== 'object') return;
    if (element.props?.children === 'Crear reserva') return element;
    for (const child of React.Children.toArray(element.props?.children)) {
      const found = findSubmit(child); if (found) return found;
    }
  }
  return { calls, html: renderToStaticMarkup(tree), submit: findSubmit(tree) };
}

test('STAFF booking filters assigned services, hides professional selection and submits the session professional', () => {
  const { calls, html, submit } = bookingDrawer('STAFF');
  assert.equal(calls.services.params.professionalId, 'own');
  assert.equal(calls.services.params.isActive, true);
  assert.equal(calls.services.enabled, true);
  assert.equal(calls.professionals.enabled, false);
  assert.equal(calls.schedule.professionalId, 'own');
  assert.doesNotMatch(html, /Seleccionar profesional|ver profesionales|Other professional/);
  assert.match(html, /tus servicios asignados/);
  submit.props.onClick();
  assert.equal(calls.created.professionalId, 'own');
});
test('ADMIN booking retains professional selection and unscoped service choices', () => {
  const { calls, html } = bookingDrawer('ADMIN');
  assert.equal(calls.services.params.professionalId, undefined);
  assert.equal(calls.professionals.enabled, true);
  assert.equal(calls.schedule.professionalId, 'other');
  assert.match(html, /Seleccionar profesional/);
});
test('STAFF without a professional does not request an unfiltered list or submit', () => {
  const { calls, html, submit } = bookingDrawer('STAFF', null);
  assert.equal(calls.services.enabled, false);
  assert.equal(calls.professionals.enabled, false);
  assert.equal(submit.props.disabled, true);
  assert.match(html, /No tienes un perfil profesional vinculado/);
  submit.props.onClick();
  assert.equal(calls.created, undefined);
});
