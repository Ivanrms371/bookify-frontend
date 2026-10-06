const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync('app/features/appointments/utils/agenda-model.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  { exports: exportsObject, require },
);
const { initialAgendaState, agendaReducer, agendaParams, todayInTimeZone, moveAgendaDate, canKeepAppointmentResults, lastAgendaPage } =
  exportsObject;

test('business today and midnight-crossing navigation produce stable calendar dates', () => {
  assert.equal(todayInTimeZone('America/Montevideo', new Date('2026-10-05T01:00:00Z')), '2026-10-04');
  assert.equal(todayInTimeZone('Asia/Tokyo', new Date('2026-10-05T23:00:00Z')), '2026-10-06');
  assert.equal(moveAgendaDate('2026-12-31', 1), '2027-01-01');
  assert.equal(moveAgendaDate('2026-03-09', -1), '2026-03-08');
});

test('applying all mobile filters resets the page and produces one consistent request', () => {
  const previous = { ...initialAgendaState('2026-10-05'), page: 3 };
  const next = agendaReducer(previous, { type: 'filters', filters: { state: 'CONFIRMED', professionalId: 'p1', order: 'hour-asc' } });
  const params = agendaParams(next);
  assert.equal(next.page, 0);
  assert.equal(params.skip, 0);
  assert.equal(params.date, '2026-10-05');
  assert.equal(params.state, 'CONFIRMED');
  assert.equal(params.professionalId, 'p1');
  assert.equal(params.orderBy, 'startsAt');
  assert.equal(params.order, 'asc');
});

test('clearing filters preserves the business day and resets sorting and pagination', () => {
  const next = agendaReducer(
    { ...initialAgendaState('2026-10-05'), state: 'CANCELLED', order: 'hour-desc', professionalId: 'p1', page: 4 },
    { type: 'clear' },
  );
  assert.equal(next.selectedDate, '2026-10-05');
  assert.equal(next.page, 0);
  assert.equal(next.order, 'latest');
  assert.equal(agendaParams(next).state, undefined);
  assert.equal(agendaParams(next).professionalId, undefined);
});

test('the same day does not reset pagination or trigger a new query', () => {
  const state = { ...initialAgendaState('2026-10-05'), page: 2 };
  assert.equal(agendaReducer(state, { type: 'date', date: state.selectedDate }), state);
  assert.equal(agendaReducer(state, { type: 'date', date: '2026-10-06' }).page, 0);
});

test('placeholder results are retained only across pages of identical tenant and criteria', () => {
  const params = agendaParams(initialAgendaState('2026-10-05'));
  const previousKey = ['appointments', 'tenant-a', params];
  assert.equal(canKeepAppointmentResults('tenant-a', { ...params, skip: 20 }, previousKey), true);
  for (const [key, value] of [
    ['date', '2026-10-06'],
    ['professionalId', 'p1'],
    ['state', 'CONFIRMED'],
    ['order', 'asc'],
    ['take', 40],
  ]) {
    assert.equal(canKeepAppointmentResults('tenant-a', { ...params, [key]: value }, previousKey), false);
  }
  assert.equal(canKeepAppointmentResults('tenant-b', params, previousKey), false);
  assert.equal(canKeepAppointmentResults(undefined, params, previousKey), false);
});

test('page recovery handles an emptied last page and a completely empty result set', () => {
  assert.equal(lastAgendaPage(40), 1);
  assert.equal(lastAgendaPage(41), 2);
  assert.equal(lastAgendaPage(0), 0);
});

test('cached pagination results cannot carry across a business timezone change', () => {
  const params = agendaParams(initialAgendaState('2026-10-05'));
  const key = ['appointments', 'tenant-a', params, 'America/Montevideo'];
  assert.equal(canKeepAppointmentResults('tenant-a', params, key, 'America/Montevideo'), true);
  assert.equal(canKeepAppointmentResults('tenant-a', params, key, 'Asia/Tokyo'), false);
});

test('appointment query waits for a tenant and forwards request cancellation', async () => {
  let tenantId = 'tenant-a';
  let permissions = ['appointment:read', 'appointment:read_others'];
  let request;
  const hookExports = {};
  const dependencies = {
    '../utils/agenda-model': exportsObject,
    '@tanstack/react-query': { useQuery: (options) => options },
    '@/core/auth/use-auth-store': { useAuthStore: (selector) => selector({ session: { activeTenant: { id: tenantId, professionalId: 'own', permissions } } }) },
    '../api/appointments-api': {
      appointmentsApi: {
        getAll: async (params, options) => {
          request = { params, options };
          return [];
        },
      },
    },
  };
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync('app/features/appointments/hooks/use-appointments.ts', 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    { exports: hookExports, require: (id) => dependencies[id] },
  );
  const params = agendaParams(initialAgendaState('2026-10-05'));
  const query = hookExports.useAppointments(params, 'America/Montevideo');
  assert.equal(query.enabled, true);
  const controller = new AbortController();
  await query.queryFn({ signal: controller.signal });
  assert.equal(request.options.signal, controller.signal);
  assert.equal(request.options.tenantId, tenantId);
  permissions = ['appointment:read'];
  const restricted = hookExports.useAppointments(params, 'America/Montevideo');
  assert.notEqual(restricted.queryKey[4], query.queryKey[4]);
  assert.equal(restricted.placeholderData({ data: ['private'] }, { queryKey: query.queryKey }), undefined);
  tenantId = undefined;
  assert.equal(hookExports.useAppointments(params).enabled, false);
});
