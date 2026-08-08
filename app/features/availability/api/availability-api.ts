import { httpClient } from '@/core/http/httpClient';
import type { GetAvailabilityProfessionalParams, GetAvailabilityProfessionalResponse } from '../types/availability-types';

export const availabilityApi = {
  getAvailabilityProfessional: (professionalId: string, params: GetAvailabilityProfessionalParams) =>
    httpClient.get<GetAvailabilityProfessionalResponse>(`/availability/professionals/${professionalId}`, { params }),
};
