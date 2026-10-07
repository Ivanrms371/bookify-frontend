const assert = require('node:assert/strict');
const { test } = require('node:test');
const { load } = require('./load.cjs');
const { saveGeneralSettings } = load('features/settings/utils/save-general-settings.ts');
function fixture() {
  const calls = [],
    uploads = new Map();
  const file = new File(['image'], 'logo.png', { type: 'image/png' });
  const options = {
    values: { name: 'Salon', slug: 'salon', timeZone: 'America/Montevideo', logoFile: file },
    previous: { logoPublicId: 'a/logo/old', logoUrl: 'old', coverPublicId: null, coverUrl: null },
    uploads,
    assertCurrent() {},
    upload: async () => {
      calls.push('upload');
      return { url: 'new', publicId: 'a/logo/new' };
    },
    save: async (payload) => {
      calls.push('save');
      assert.equal(payload.logoUrl, 'new');
    },
    remove: async (id) => {
      calls.push(`delete:${id}`);
    },
  };
  return { options, calls, file };
}
test('replacement uploads then commits new references before deleting old assets', async () => {
  const { options, calls } = fixture();
  await saveGeneralSettings(options);
  assert.deepEqual(calls, ['upload', 'save', 'delete:a/logo/old']);
});
test('failed upload/save preserves old image and staged uploads are reused on retry', async () => {
  const { options, calls } = fixture();
  const originalSave = options.save;
  options.save = async () => {
    calls.push('failed-save');
    throw new Error('server');
  };
  await assert.rejects(saveGeneralSettings(options));
  assert.equal(
    calls.some((call) => call.startsWith('delete')),
    false,
  );
  options.save = originalSave;
  await saveGeneralSettings(options);
  assert.equal(calls.filter((call) => call === 'upload').length, 1);
});
test('image removal persists null references before deletion; cleanup failure does not misreport a committed save', async () => {
  const { options, calls } = fixture();
  options.values.logoFile = null;
  options.save = async (payload) => {
    calls.push('save');
    assert.equal(payload.logoUrl, null);
    assert.equal(payload.logoPublicId, null);
  };
  options.remove = async () => {
    calls.push('cleanup');
    throw new Error('provider');
  };
  const result = await saveGeneralSettings(options);
  assert.deepEqual(calls, ['save', 'cleanup']);
  assert.equal(result.cleanupFailed, true);
});
test('a tenant switch after upload aborts the save and never deletes existing assets', async () => {
  const { options, calls } = fixture();
  let current = true;
  const upload = options.upload;
  options.upload = async () => {
    const asset = await upload();
    current = false;
    return asset;
  };
  options.assertCurrent = () => {
    if (!current) throw new Error('changed tenant');
  };
  await assert.rejects(saveGeneralSettings(options), /changed tenant/);
  assert.deepEqual(calls, ['upload']);
});
