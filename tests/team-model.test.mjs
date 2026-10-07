import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import ts from 'typescript';
const source = readFileSync(new URL('../app/features/settings/team/team-model.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { canManage, filterMembers, toTeamMember } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const members = [
  { id: 'membership-a', userId: 'account-a', name: 'Ana', email: 'ana@example.com', role: 'ADMIN', hasAccess: true },
  { id: 'membership-b', userId: 'account-b', name: 'Luis', email: 'luis@example.com', role: 'STAFF', hasAccess: false },
];
test('search and access filters compose and support empty results', () => {
  assert.equal(filterMembers(members, ' ANA@EXAMPLE ', 'active')[0].name, 'Ana');
  assert.equal(filterMembers(members, 'luis', 'inactive').length, 1);
  assert.equal(filterMembers(members, 'luis', 'active').length, 0);
  assert.equal(filterMembers(members, 'missing', 'all').length, 0);
  assert.equal(filterMembers(members, '', 'all').length, 2);
});
test('permission matrix protects owner and self and limits administrators to staff', () => {
  for (const role of ['OWNER', 'ADMIN', 'STAFF']) {
    const actor = { id: 'actor-user', role };
    assert.equal(canManage(actor, { id: 'actor-membership', userId: 'actor-user', role }), false);
    assert.equal(canManage(actor, { userId: 'other', role: 'OWNER' }), false);
    assert.equal(canManage(actor, { userId: 'other', role: 'ADMIN' }), role === 'OWNER');
    assert.equal(canManage(actor, { userId: 'other', role: 'STAFF' }), role !== 'STAFF');
  }
});

test('backend members retain separate membership/user IDs, account identity and inactive access', () => {
  const record = {
    id: 'membership-id',
    userId: 'account-id',
    role: 'ADMIN',
    isActive: false,
    user: { id: 'account-id', name: 'Actual Member', email: 'actual@example.com', avatarUrl: null },
    professional: { id: 'professional-id', name: 'Different Profile Name' },
  };
  const member = toTeamMember(record);
  assert.equal(member.id, 'membership-id');
  assert.equal(member.userId, 'account-id');
  assert.equal(member.name, 'Actual Member');
  assert.equal(member.hasAccess, false);
  assert.equal(canManage({ id: 'account-id', role: 'ADMIN' }, member), false);
  assert.equal(filterMembers([member], 'actual@', 'inactive').length, 1);
  assert.equal(filterMembers([member], 'diego', 'all').length, 0);
  assert.equal(toTeamMember({ ...record, user: { ...record.user, name: null } }).name, 'actual@example.com');
});
