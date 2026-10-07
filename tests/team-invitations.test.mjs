import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(relativePath, mocks, globals = {}) {
  const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  runInNewContext(output, { module, exports: module.exports, require: (name) => mocks[name] ?? require(name), ...globals });
  return module.exports;
}
function fixture() {
  let tenant = { id: 'business-a', slug: 'salon', role: 'OWNER' };
  const window = { location: { pathname: '/salon/settings' } };
  const calls = [];
  const record = {
    id: 'invitation-id',
    email: 'new@example.com',
    name: 'New',
    role: 'STAFF',
    status: 'EXPIRED',
    expiresAt: '2026-10-01T12:00:00Z',
  };
  const member = {
    id: 'membership-id',
    userId: 'account-id',
    role: 'ADMIN',
    isActive: false,
    user: { id: 'account-id', name: 'Actual Member', email: 'actual@example.com', avatarUrl: null },
    professional: null,
  };
  let cache = { members: [member], invitations: [record] };
  let failure;
  const httpClient = Object.fromEntries(
    ['get', 'post', 'delete', 'patch'].map((method) => [
      method,
      async (...args) => {
        calls.push({ method, args: JSON.parse(JSON.stringify(args)) });
        if (failure) throw failure;
        return method === 'get'
          ? { members: [member], invitations: [record] }
          : ['delete', 'patch'].includes(method)
            ? { success: true }
            : record;
      },
    ]),
  );
  const { teamInvitationsApi } = load('../app/features/settings/team/team-invitations-api.ts', {
    '@/core/http/httpClient': { httpClient },
  });
  class ApiError extends Error {}
  const invalidations = [];
  const hooks = load(
    '../app/features/settings/team/use-team-invitations.ts',
    {
      '@tanstack/react-query': {
        useQuery: (options) => options,
        useMutation: (options) => options,
        useQueryClient: () => ({
          getQueryData: () => cache,
          setQueryData: (_key, updater) => {
            cache = updater(cache);
          },
          invalidateQueries: (options) => {
            invalidations.push([...options.queryKey]);
            return Promise.resolve();
          },
        }),
      },
      '@/core/auth/use-auth-store': { useAuthStore: { getState: () => ({ session: { id: 'manager-id', activeTenant: tenant } }) } },
      '@/core/error/api-error': { ApiError },
      './team-invitations-api': { teamInvitationsApi },
      './team-model': load('../app/features/settings/team/team-model.ts', {}),
    },
    { window },
  );
  return {
    calls,
    getCache: () => cache,
    record,
    member,
    invalidations,
    hooks,
    window,
    setTenant: (value) => {
      tenant = value;
    },
    fail: (value) => {
      failure = value;
    },
  };
}
test('loads real members and outstanding invitations in one tenant-scoped request', async () => {
  const f = fixture();
  const query = f.hooks.useTeamData('business-a', true);
  assert.deepEqual([...query.queryKey], ['team', 'business-a']);
  assert.equal(query.enabled, true);
  assert.deepEqual(await query.queryFn(), { members: [f.member], invitations: [f.record] });
  assert.deepEqual(f.calls[0], { method: 'get', args: ['/team', { expectedTenantId: 'business-a' }] });
  assert.equal(f.hooks.useTeamData('business-a', false).enabled, false);
  assert.notDeepEqual([...query.queryKey], [...f.hooks.useTeamData('business-b', true).queryKey]);
});
test('invites using the supported route, normalized email and role only, with no automatic mutation retry', async () => {
  const f = fixture();
  const mutation = f.hooks.useTeamInvitationAction('business-a');
  assert.equal(mutation.retry, false);
  await mutation.mutationFn({ type: 'invite', email: ' NEW@Example.com ', role: 'STAFF' });
  assert.deepEqual(f.calls, [
    {
      method: 'post',
      args: ['/team/members/invite', { email: 'new@example.com', role: 'STAFF' }, { expectedTenantId: 'business-a', skipAuthRetry: true }],
    },
  ]);
});
test('rejects invalid emails and admin promotion attempts before making a request', async () => {
  const f = fixture();
  const mutation = f.hooks.useTeamInvitationAction('business-a');
  await assert.rejects(mutation.mutationFn({ type: 'invite', email: 'invalid', role: 'STAFF' }), /correo válido/);
  f.setTenant({ id: 'business-a', slug: 'salon', role: 'ADMIN' });
  await assert.rejects(mutation.mutationFn({ type: 'invite', email: 'new@example.com', role: 'ADMIN' }), /Solo puedes invitar personal/);
  assert.equal(f.calls.length, 0);
  await mutation.mutationFn({ type: 'invite', email: 'new@example.com', role: 'STAFF' });
  assert.equal(f.calls.length, 1);
});
test('resend and cancel use the invitation UUID and supported HTTP methods', async () => {
  const f = fixture();
  const mutation = f.hooks.useTeamInvitationAction('business-a');
  await mutation.mutationFn({ type: 'resend', id: 'invitation-id' });
  await mutation.mutationFn({ type: 'cancel', id: 'invitation-id' });
  assert.deepEqual(f.calls, [
    { method: 'post', args: ['/team/invitations/invitation-id/resend', null, { expectedTenantId: 'business-a', skipAuthRetry: true }] },
    { method: 'delete', args: ['/team/invitations/invitation-id', { expectedTenantId: 'business-a', skipAuthRetry: true }] },
  ]);
});
test('a stale modal cannot mutate a different business, a mismatched URL or a staff session', async () => {
  for (const tenant of [
    null,
    { id: 'business-b', slug: 'other', role: 'OWNER' },
    { id: 'business-a', slug: 'other', role: 'OWNER' },
    { id: 'business-a', slug: 'salon', role: 'STAFF' },
  ]) {
    const f = fixture();
    const mutation = f.hooks.useTeamInvitationAction('business-a');
    f.setTenant(tenant);
    await assert.rejects(mutation.mutationFn({ type: 'cancel', id: 'invitation-id' }), /espacio seleccionado cambió/);
    assert.equal(f.calls.length, 0);
  }
});
test('success refreshes only the captured business invitations and affected professional data', () => {
  const f = fixture();
  const mutation = f.hooks.useTeamInvitationAction('business-a');
  f.setTenant({ id: 'business-b', slug: 'other', role: 'OWNER' });
  mutation.onSuccess();
  assert.deepEqual(f.invalidations, [
    ['team', 'business-a'],
    ['professionals', 'business-a'],
    ['professional', 'business-a'],
  ]);
});
test('server conflicts propagate to the modal and refresh the outstanding invitation list', async () => {
  const f = fixture();
  const conflict = new Error('Ya existe una invitación pendiente o vencida. Puedes reenviarla.');
  f.fail(conflict);
  const mutation = f.hooks.useTeamInvitationAction('business-a');
  await assert.rejects(mutation.mutationFn({ type: 'invite', email: 'new@example.com', role: 'STAFF' }), (error) => error === conflict);
  mutation.onError();
  assert.deepEqual(f.invalidations, [['team', 'business-a']]);
});

test('member changes PATCH the membership ID with an explicit role or access state', async () => {
  const f = fixture();
  const mutation = f.hooks.useTeamMemberAction('business-a');
  assert.equal(mutation.retry, false);
  for (const action of [
    { type: 'role', id: 'membership-id', role: 'STAFF' },
    { type: 'access', id: 'membership-id', isActive: false },
    { type: 'access', id: 'membership-id', isActive: true },
  ])
    await mutation.mutationFn(action);
  assert.deepEqual(
    f.calls.map((call) => call.args),
    [
      ['/team/members/membership-id', { role: 'STAFF' }, { expectedTenantId: 'business-a', skipAuthRetry: true }],
      ['/team/members/membership-id', { isActive: false }, { expectedTenantId: 'business-a', skipAuthRetry: true }],
      ['/team/members/membership-id', { isActive: true }, { expectedTenantId: 'business-a', skipAuthRetry: true }],
    ],
  );
  assert.ok(f.calls.every((call) => call.method === 'patch'));
});
test('member actions protect owners, self, missing members and administrator targets', async () => {
  for (const configure of [
    (f) => {
      f.member.role = 'OWNER';
    },
    (f) => {
      f.member.userId = 'manager-id';
    },
    (f) => {
      f.member.id = 'another-membership';
    },
    (f) => {
      f.setTenant({ id: 'business-a', slug: 'salon', role: 'ADMIN' });
    },
  ]) {
    const f = fixture();
    configure(f);
    await assert.rejects(
      f.hooks.useTeamMemberAction('business-a').mutationFn({ type: 'access', id: 'membership-id', isActive: true }),
      /No puedes modificar/,
    );
    assert.equal(f.calls.length, 0);
  }
});
test('administrators can manage staff but cannot promote them or send invalid states', async () => {
  const f = fixture();
  f.member.role = 'STAFF';
  f.setTenant({ id: 'business-a', slug: 'salon', role: 'ADMIN' });
  const mutation = f.hooks.useTeamMemberAction('business-a');
  await assert.rejects(mutation.mutationFn({ type: 'role', id: f.member.id, role: 'ADMIN' }), /permiso/);
  await assert.rejects(mutation.mutationFn({ type: 'access', id: f.member.id }), /estado/);
  assert.equal(f.calls.length, 0);
  await mutation.mutationFn({ type: 'access', id: f.member.id, isActive: true });
  await mutation.mutationFn({ type: 'role', id: f.member.id, role: 'STAFF' });
  assert.equal(f.calls.length, 2);
});
test('member actions reject stale tenant sessions before sending a request', async () => {
  const f = fixture();
  const mutation = f.hooks.useTeamMemberAction('business-a');
  f.setTenant({ id: 'business-b', slug: 'other', role: 'OWNER' });
  await assert.rejects(mutation.mutationFn({ type: 'access', id: f.member.id, isActive: true }), /espacio seleccionado cambió/);
  assert.equal(f.calls.length, 0);
});
test('successful member changes preserve rows and invitations and update only the captured tenant', () => {
  const f = fixture();
  const mutation = f.hooks.useTeamMemberAction('business-a');
  const initial = f.getCache();
  f.setTenant({ id: 'business-b', slug: 'other', role: 'OWNER' });
  mutation.onSuccess({ success: true }, { type: 'access', id: f.member.id, isActive: true });
  assert.equal(f.getCache().members[0].isActive, true);
  assert.equal(initial.members[0].isActive, false);
  mutation.onSuccess({ success: true }, { type: 'role', id: f.member.id, role: 'STAFF' });
  mutation.onSuccess({ success: true }, { type: 'access', id: f.member.id, isActive: false });
  assert.equal(f.getCache().members.length, 1);
  assert.equal(f.getCache().members[0].role, 'STAFF');
  assert.equal(f.getCache().members[0].isActive, false);
  assert.equal(f.getCache().invitations, initial.invitations);
  assert.ok(f.invalidations.every((key) => key[1] === 'business-a'));
});
test('failed member updates preserve cache and refresh server state', async () => {
  const f = fixture();
  const initial = f.getCache();
  const failure = new Error('No puedes modificar tu propio acceso');
  f.fail(failure);
  const mutation = f.hooks.useTeamMemberAction('business-a');
  await assert.rejects(mutation.mutationFn({ type: 'access', id: f.member.id, isActive: true }), (error) => error === failure);
  mutation.onError();
  assert.equal(f.getCache(), initial);
  assert.deepEqual(f.invalidations, [['team', 'business-a']]);
});
