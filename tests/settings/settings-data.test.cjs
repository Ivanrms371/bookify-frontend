const assert = require('node:assert/strict');
const { test } = require('node:test');
const { load } = require('./load.cjs');

test('working hours preserve server weekdays, times and closed days; closed schedules save empty hours', () => {
  const { workingHoursToForm } = load('features/schedule/utils/working-hours-model.ts');
  const { mapScheduleToDTO } = load('features/schedule/utils/map-schedule-to-dto.ts');
  const form = workingHoursToForm([{ day: 'MONDAY', isActive: true, intervals: [{ opens: '08:30', closes: '17:45' }] }]);
  assert.equal(form.workingHours.length, 7);
  assert.equal(form.workingHours[0].intervals[0].opensAt, '08:30');
  assert.equal(form.workingHours[1].isActive, false);
  assert.equal(form.workingHours[6].dayOfWeek, 'sunday');
  const saved = mapScheduleToDTO(form);
  assert.deepEqual(JSON.parse(JSON.stringify(saved)), {
    workingHours: [{ dayOfWeek: 'monday', intervals: [{ opensAt: '08:30', closesAt: '17:45' }] }],
  });
  assert.equal(mapScheduleToDTO(workingHoursToForm([])).workingHours.length, 0);
  assert.throws(() => workingHoursToForm(null));
});
test('exception validation accepts closure and touching intervals, rejects invalid/overlapping intervals', () => {
  const { scheduleExceptionFormSchema: schema } = load('features/schedule/schemas/schedule-exception-form-schema.ts');
  const valid = {
    startDate: '2026-10-12',
    endDate: '2026-10-12',
    isClosed: false,
    professionalIds: ['p1'],
    intervals: [
      { opensAt: '09:00', closesAt: '12:00' },
      { opensAt: '12:00', closesAt: '18:00' },
    ],
  };
  assert.equal(schema.safeParse(valid).success, true);
  assert.equal(schema.safeParse({ ...valid, intervals: [] }).success, false);
  assert.equal(schema.safeParse({ ...valid, isClosed: true, intervals: [] }).success, true);
  assert.equal(schema.safeParse({ ...valid, endDate: '2026-10-11' }).success, false);
  assert.equal(schema.safeParse({ ...valid, professionalIds: [] }).success, false);
  assert.equal(schema.safeParse({ ...valid, intervals: [{ opensAt: '25:00', closesAt: '26:00' }] }).success, false);
  assert.equal(
    schema.safeParse({ ...valid, intervals: [{ opensAt: '18:00', closesAt: '09:00' }] }).error.issues[0].path.join('.'),
    'intervals.0.closesAt',
  );
  assert.equal(
    schema.safeParse({
      ...valid,
      intervals: [
        { opensAt: '09:00', closesAt: '13:00' },
        { opensAt: '12:00', closesAt: '18:00' },
      ],
    }).success,
    false,
  );
});
test('settings queries and writes capture tenant ID, cancel reads and disable automatic auth retries on writes', async () => {
  let tenantId = 'a';
  const calls = [];
  const httpClient = Object.fromEntries(
    ['get', 'patch'].map((method) => [
      method,
      async (...args) => {
        calls.push([method, ...args]);
        return {};
      },
    ]),
  );
  const { SettingsService } = load('features/settings/api/settings.service.ts', { '@/core/http/httpClient': { httpClient } });
  const { useGetSettings } = load('features/settings/hooks/use-get-settings.ts', {
    '@tanstack/react-query': { useQuery: (options) => options },
    '@/core/auth/use-auth-store': { useAuthStore: (selector) => selector({ session: { activeTenant: { id: tenantId } } }) },
    '../api/settings.service': { SettingsService },
  });
  const a = useGetSettings();
  tenantId = 'b';
  const b = useGetSettings();
  assert.notDeepEqual([...a.queryKey], [...b.queryKey]);
  const signal = new AbortController().signal;
  await a.queryFn({ signal });
  assert.equal(calls[0][2].expectedTenantId, 'a');
  assert.equal(calls[0][2].signal, signal);
  await SettingsService.updateAppointmentSettings({ maxAdvancedDays: 30 }, 'a');
  assert.equal(calls[1][3].expectedTenantId, 'a');
  assert.equal(calls[1][3].skipAuthRetry, true);
});
test('saving hours invalidates only the affected business and uses the supported PUT payload', async () => {
  const calls = [],
    invalidations = [];
  const { useSaveTenantWorkingHours } = load('features/schedule/hooks/use-save-tenant-working-hours.ts', {
    '@tanstack/react-query': {
      useMutation: (options) => options,
      useQueryClient: () => ({
        invalidateQueries: (options) => {
          invalidations.push(options.queryKey);
          return Promise.resolve();
        },
      }),
    },
    '../api/tenant-working-hours-api': {
      tenantWorkingHoursApi: {
        save: async (...args) => {
          calls.push(args);
        },
      },
    },
    './use-tenant-working-hours': { tenantWorkingHoursKey: (id) => ['tenant-working-hours', id] },
    '@/features/settings/hooks/use-get-settings': { settingsQueryKey: (id) => ['tenant-settings', id] },
  });
  const mutation = useSaveTenantWorkingHours('a');
  assert.equal(mutation.retry, false);
  await mutation.mutationFn({ workingHours: [{ dayOfWeek: 'monday', isActive: false, intervals: [] }] });
  mutation.onSuccess();
  assert.equal(calls[0][0], 'a');
  assert.equal(calls[0][1].workingHours.length, 0);
  assert.equal(
    invalidations.every((key) => key[1] === 'a'),
    true,
  );
});
