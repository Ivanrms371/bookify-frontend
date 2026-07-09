import { httpClient } from '@/core/http/httpClient';
import type { WorkspaceStepPayload } from '../schemas/workspace-step.schema';
import type { BusinessStepPayload } from '../schemas/business-step.schema';
import type { OnboardingStatusResponse } from '../schemas/onboarding-status.schema';
import type { TenantWorkingHoursSaveInput } from '@/features/tenant-working-hours/types/tenant-working-hours.types';
import type { ServicesStepPayload } from '../schemas/services-step.schema';
import type { TeamStepPayload } from '../schemas/team-step.schema';
import type { CustomizeStepPayload } from '../schemas/customize-step.schema';

export const onboardingService = {
  getStatus: () => httpClient.get<OnboardingStatusResponse>('/onboarding/status'),

  init: () => httpClient.post<OnboardingStatusResponse>('/onboarding/init'),

  updateWorkspace: (dto: WorkspaceStepPayload) => httpClient.patch<OnboardingStatusResponse>('/onboarding/workspace', dto),

  updateBusiness: (dto: BusinessStepPayload) => httpClient.patch<OnboardingStatusResponse>('/onboarding/business', dto),

  updateSchedule: (dto: TenantWorkingHoursSaveInput) => {
    console.log(dto);
    return httpClient.patch<OnboardingStatusResponse>('/onboarding/schedule', dto);
  },

  updateServices: (dto: ServicesStepPayload) => httpClient.patch<OnboardingStatusResponse>('/onboarding/services', dto),

  updateTeam: (dto: TeamStepPayload = { invitations: [] }) => httpClient.patch<OnboardingStatusResponse>('/onboarding/team', dto),

  updateCustomize: (dto: CustomizeStepPayload) => httpClient.patch<OnboardingStatusResponse>('/onboarding/customize', dto),

  confirm: () => httpClient.patch<OnboardingStatusResponse>('/onboarding/confirm'),
};
