import { apiClient } from "@/shared/api/client";

export interface BulkInviteData {
  emails: string[];
}

export const staffApi = {
  inviteStaff: async (businessId: string, data: BulkInviteData) => {
    const response = await apiClient.post(
      `/business/${businessId}/invitations/bulk`,
      data,
    );
    return response.data;
  },
};
