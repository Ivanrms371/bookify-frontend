const { readFileSync, existsSync } = require('node:fs');
const { resolve, dirname } = require('node:path');
const { runInNewContext } = require('node:vm');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = resolve(__dirname, '../../app');
const { load } = require('./load.cjs');
const Box = ({ children }) => React.createElement('div', null, children);
const mocks = {
  '@/features/professionals/hooks/use-professionals': { useProfessionals: () => ({ data: [{ id: 'p1', name: 'Ana' }], isLoading: false }) },
  '@/core/auth/use-auth-store': { useAuthStore: (selector) => selector({ session: { activeTenant: { id: 't1', slug: 'salon' } } }) },
  '@/features/settings/hooks/use-settings-draft': { useSettingsDraft: () => {} },
  '@/features/settings/hooks/use-settings-drafts': { useSettingsDraft: () => {} },
  '@/shared/components/form/input': { Input: (props) => React.createElement('input', props) },
  '@/shared/components/form/form-field': { FormField: Box },
  '@/shared/components/form/Textarea': { Textarea: (props) => React.createElement('textarea', props) },
  '@/shared/components/ui': { Button: ({ isSubmitting, ...props }) => React.createElement('button', { ...props, disabled: props.disabled || isSubmitting }), Callout: Box },
  '@/shared/components/ui/drawer': { DrawerBody: Box, DrawerFooter: Box },
  '@/shared/components/ui/modal': { ModalBody: Box, ModalFooter: Box },
};
test('new exception renders editable time intervals without a weekly ScheduleForm context', () => {
  const { ScheduleExceptionForm } = load('features/schedule/components/exceptions/schedule-exception-form.tsx', mocks);
  const html = renderToStaticMarkup(React.createElement(ScheduleExceptionForm, { tenantId: 't1', onSubmit() {}, onCancel() {} }));
  assert.match(html, /type="time"/);
  assert.match(html, /name="intervals.0.opensAt"/);
});
test('exception requests use the backend settings routes and PUT for editing', async () => {
  const calls = [];
  const httpClient = Object.fromEntries(
    ['get', 'post', 'put', 'patch', 'delete'].map((method) => [
      method,
      async (...args) => {
        calls.push([method, ...args]);
        return [];
      },
    ]),
  );
  const { scheduleExceptionApi } = load('features/schedule/api/schedule-exception-api.ts', { '@/core/http/httpClient': { httpClient } });
  await scheduleExceptionApi.getAll('t1');
  await scheduleExceptionApi.update('e1', { isClosed: true }, 't1');
  assert.equal(calls[0][1], '/settings/exceptions');
  assert.equal(calls[1][0], 'put');
  assert.equal(calls[1][1], '/settings/exceptions/e1');
  assert.equal(calls[1][3].expectedTenantId, 't1');
});

test('exception form shows save errors and never promises appointment cancellations or notifications', () => {
  const { ScheduleExceptionForm } = load('features/schedule/components/exceptions/schedule-exception-form.tsx', mocks);
  const html = renderToStaticMarkup(React.createElement(ScheduleExceptionForm, {
    tenantId: 't1', onSubmit() {}, onCancel() {}, error: 'No se pudo guardar', isSubmitting: true,
  }));
  assert.match(html, /role="alert"[^>]*>No se pudo guardar/);
  assert.match(html, /<fieldset disabled=""/);
  assert.match(html, /No cancela ni reprograma citas existentes ni envía notificaciones/);
  assert.match(html, /type="checkbox"/);
});
test('failed or empty professional loading blocks saving and explains recovery', () => {
  for (const state of [{ data: [], isLoading: false }, { isLoading: false, isError: true }]) {
    const { ScheduleExceptionForm } = load('features/schedule/components/exceptions/schedule-exception-form.tsx', {
      ...mocks,
      '@/features/professionals/hooks/use-professionals': { useProfessionals: () => state },
    });
    const html = renderToStaticMarkup(React.createElement(ScheduleExceptionForm, { tenantId: 't1', onSubmit() {}, onCancel() {} }));
    assert.match(html, /type="submit"[^>]*disabled=""/);
    assert.match(html, state.isError ? /Reintentar/ : /No hay profesionales/);
  }
});
test('creating an exception makes only the tenant-scoped exception POST, without appointment mutations', async () => {
  const calls = [];
  const httpClient = Object.fromEntries(['get', 'post', 'put', 'patch', 'delete'].map(method => [method, async (...args) => calls.push([method, ...args])]));
  const { scheduleExceptionApi } = load('features/schedule/api/schedule-exception-api.ts', { '@/core/http/httpClient': { httpClient } });
  const data = { startDate: '2026-10-12', endDate: '2026-10-12', isClosed: true, professionalIds: ['p1'], intervals: [] };
  await scheduleExceptionApi.create(data, 't1');
  assert.equal(calls.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0])), ['post', '/settings/exceptions', data, { expectedTenantId: 't1', skipAuthRetry: true }]);
});

test('form submission preserves special hours and clears hidden intervals for a full-day closure', async () => {
  for (const isClosed of [false, true]) {
    let submit;
    const values = { startDate: '2026-10-12', endDate: '2026-10-12', isClosed, professionalIds: ['p1'], intervals: [{ opensAt: '10:00', closesAt: '16:00' }], reason: 'Feriado' };
    const rhf = require('react-hook-form');
    const { ScheduleExceptionForm } = load('features/schedule/components/exceptions/schedule-exception-form.tsx', {
      ...mocks,
      'react-hook-form': { ...rhf, useForm: (options) => {
        const form = rhf.useForm(options);
        return { ...form, handleSubmit: (callback) => { submit = callback; return () => {}; } };
      } },
    });
    let saved;
    renderToStaticMarkup(React.createElement(ScheduleExceptionForm, { tenantId: 't1', onSubmit: async data => { saved = data; }, onCancel() {} }));
    await submit(values);
    assert.deepEqual(JSON.parse(JSON.stringify(saved)), { ...values, intervals: isClosed ? [] : values.intervals });
  }
});

test('adding a time row requires complete ordered non-overlapping existing intervals', () => {
  const { ScheduleExceptionForm } = load('features/schedule/components/exceptions/schedule-exception-form.tsx', mocks);
  const cases = [
    { blocks: [{ opensAt: '', closesAt: '' }], allowed: false },
    { blocks: [{ opensAt: '09:00', closesAt: '' }], allowed: false },
    { blocks: [{ opensAt: '18:00', closesAt: '09:00' }], allowed: false },
    { blocks: [{ opensAt: '09:00', closesAt: '09:00' }], allowed: false },
    { blocks: [{ opensAt: '09:00', closesAt: '12:00' }, { opensAt: '11:00', closesAt: '13:00' }], allowed: false },
    { blocks: [{ opensAt: '09:00', closesAt: '12:00' }, { opensAt: '12:00', closesAt: '13:00' }], allowed: true },
    { blocks: [{ opensAt: '09:00', closesAt: '12:00' }], allowed: true },
    { blocks: [], allowed: true },
  ];
  for (const { blocks, allowed } of cases) {
    const html = renderToStaticMarkup(React.createElement(ScheduleExceptionForm, {
      tenantId: 't1', onSubmit() {}, onCancel() {},
      initialData: { startDate: '2026-10-12', endDate: '2026-10-12', isClosed: false, blocks, professionals: [{ professionalId: 'p1' }] },
    }));
    const addButton = html.match(/<button[^>]*>[^]*?Añadir intervalo<\/button>/g).at(-1).split('<button').at(-1);
    assert.equal(addButton.includes('disabled=""'), !allowed, JSON.stringify(blocks));
    assert.equal(html.includes('id="interval-add-hint"'), !allowed);
  }
});
