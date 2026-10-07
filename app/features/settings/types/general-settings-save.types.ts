import type { ImageType, UploadResult } from '@/shared/media/types';
import type { TenantGeneralSettingsFormValues } from '../schemas/tenant-settings-schema';
import type { TenantSettingsResponse, UpdateGeneralSettingsPayload, UpdateGeneralSettingsResponse } from './settings.types';

export interface GeneralSettingsSaveOptions {
  values: TenantGeneralSettingsFormValues;
  previous: TenantSettingsResponse;
  uploads: Map<File, UploadResult>;
  assertCurrent: () => void;
  upload: (file: File, type: ImageType) => Promise<UploadResult>;
  save: (payload: UpdateGeneralSettingsPayload) => Promise<UpdateGeneralSettingsResponse>;
  remove: (publicId: string) => Promise<unknown>;
}
