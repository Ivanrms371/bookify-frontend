import type { LocationValues } from '@/shared/location/types/location.types';
import { httpClient } from '@/core/http/httpClient';
import type { ProfessionalStepPayload } from '../schemas/professional-step.schema';
import type { BusinessStepPayload } from '../schemas/business-step.schema';
import type { OnboardingStatusResponse } from '../schemas/onboarding-status.schema';
import type { SaveWorkingHours } from '@/features/schedule/schemas/schedule-form-schema';
import type { ServicesStepPayload } from '../schemas/services-step.schema';
import type { CustomizeStepPayload } from '../schemas/customize-step.schema';

export const onboardingApi = {
  getStatus: () => httpClient.get<OnboardingStatusResponse>('/onboarding/status'),

  init: () => httpClient.post<OnboardingStatusResponse>('/onboarding/init'),

  updateProfessional: (dto: ProfessionalStepPayload) => httpClient.patch<OnboardingStatusResponse>('/onboarding/professional', dto),

  updateBusiness: (dto: BusinessStepPayload) => httpClient.patch<OnboardingStatusResponse>('/onboarding/business', dto),

  updateLocation: ({ currency: _currency, timeZone: _timeZone, ...location }: LocationValues) =>
    httpClient.patch<OnboardingStatusResponse>('/onboarding/location', location),

  updateSchedule: (dto: SaveWorkingHours) => {
    return httpClient.patch<OnboardingStatusResponse>('/onboarding/schedule', dto);
  },

  updateServices: (dto: ServicesStepPayload) => httpClient.patch<OnboardingStatusResponse>('/onboarding/services', dto),

  updateCustomize: (dto: CustomizeStepPayload) => httpClient.patch<OnboardingStatusResponse>('/onboarding/customize', dto),

  confirm: () => httpClient.patch<OnboardingStatusResponse>('/onboarding/confirm'),
};
