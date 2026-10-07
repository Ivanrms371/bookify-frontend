import type { GeneralSettingsSaveOptions } from '../types/general-settings-save.types';
import type { UpdateGeneralSettingsPayload } from '../types/settings.types';

// Upload first, persist references second, remove replaced assets only after commit.
// Keep staged uploads on failure so retry does not upload the same files again.
export async function saveGeneralSettings(options: GeneralSettingsSaveOptions) {
  const { values, previous, uploads, assertCurrent, upload, save, remove } = options;
  assertCurrent();
  const { logoFile, coverFile, ...fields } = values;
  const payload: UpdateGeneralSettingsPayload = { ...fields };
  const retired: string[] = [];
  for (const [file, type, oldId] of [
    [logoFile, 'logo', previous.logoPublicId],
    [coverFile, 'cover', previous.coverPublicId],
  ] as const) {
    if (file === undefined) continue;
    let asset = null;
    if (file instanceof File) {
      const limit = type === 'logo' ? 2 : 5;
      if (!file.type.startsWith('image/') || file.size > limit * 1024 * 1024)
        throw new Error(`Selecciona una imagen de hasta ${limit} MB para ${type === 'logo' ? 'el logo' : 'la portada'}.`);
      assertCurrent();
      asset = uploads.get(file) ?? (await upload(file, type));
      uploads.set(file, asset);
    }
    const prefix = type === 'logo' ? 'logo' : 'cover';
    payload[`${prefix}Url`] = asset?.url ?? null;
    payload[`${prefix}PublicId`] = asset?.publicId ?? null;
    if (oldId && oldId !== asset?.publicId) retired.push(oldId);
  }
  assertCurrent();
  await save(payload);
  let cleanupFailed = false;
  for (const oldId of retired) {
    try {
      assertCurrent();
      await remove(oldId);
    } catch {
      cleanupFailed = true;
    }
  }
  uploads.clear();
  return { payload, cleanupFailed };
}
