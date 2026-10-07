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
  '@/shared/components/ui': { Button: Box, Callout: Box },
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
