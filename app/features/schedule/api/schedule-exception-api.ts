import { httpClient } from '@/core/http/httpClient';
import type { ScheduleExceptionFormData } from '../schemas/schedule-exception-form-schema';
import type { ScheduleException } from '../types/schedule-exception.types';

export const scheduleExceptionApi = {
  getAll: (): Promise<ScheduleException[]> => httpClient.get<ScheduleException[]>('/schedule/exceptions'),

  getById: (id: string): Promise<ScheduleException> => httpClient.get<ScheduleException>(`/schedule/exceptions/${id}`),

  create: (formData: ScheduleExceptionFormData): Promise<ScheduleException> =>
    httpClient.post<ScheduleException>('/schedule/exceptions', formData),

  update: (id: string, formData: ScheduleExceptionFormData): Promise<ScheduleException> =>
    httpClient.patch<ScheduleException>(`/schedule/exceptions/${id}`, formData),

  delete: (id: string): Promise<void> => httpClient.delete(`/schedule/exceptions/${id}`),
};
