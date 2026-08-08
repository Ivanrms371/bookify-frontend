import { httpClient } from '@/core/http/httpClient';
import type { CreateAppointmentInput } from '../schemas/create-appointment-schema';
import type { GetAllAppointmentsResponse, GetAllAppointmentsParams } from '../types/appointments-types';

export const appointmentsApi = {
  getAll: async (params: GetAllAppointmentsParams) => await httpClient.get<GetAllAppointmentsResponse>('/appointments', { params }),

  getById: (id: string) => {},

  create: (input: CreateAppointmentInput) => httpClient.post('/appointments', input),

  reschedule: () => {},

  cancel: () => {},
};
