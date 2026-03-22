import { apiClient } from "@/shared/api/client";

export interface WorkingHourInput {
  dayOfWeek: number;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  name?: string;
}

export interface CreateWorkingHoursBulkInput {
  workingHours: WorkingHourInput[];
}

export const availabilityApi = {
  createHours: async (businessId: string, data: CreateWorkingHoursBulkInput) => {
    const response = await apiClient.post(
      `/businesses/${businessId}/working-hours/bulk`,
      data
    );
    return response.data;
  },
};
