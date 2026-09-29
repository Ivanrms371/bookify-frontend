import { httpClient } from '@/core/http/httpClient';
import type {
  GetAppointmentAvailabilityParams,
  GetAppointmentAvailabilityResponse,
  GetAvailabilityProfessionalParams,
  GetAvailabilityProfessionalResponse,
} from '../types/availability-types';

export const availabilityApi = {
  getAvailabilityProfessional: (professionalId: string, params: GetAvailabilityProfessionalParams) =>
    httpClient.get<GetAvailabilityProfessionalResponse>(`/availability/professionals/${professionalId}`, { params }),

  getAppointmentAvailability: (params: GetAppointmentAvailabilityParams) =>
    httpClient.get<GetAppointmentAvailabilityResponse>('/availability/appointments', { params }),
};
