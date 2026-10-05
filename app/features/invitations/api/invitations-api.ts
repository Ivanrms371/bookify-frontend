import { httpClient } from '@/core/http/httpClient';
import type { CreateInvitePayload, CreateInviteResponse, AcceptInviteResponse, Invitation } from '../types/invitation.types';

import type { InvitationValidation } from '../types/invitation-journey.types';

export const invitationsApi = {
  validate: (token: string) =>
    httpClient.get<InvitationValidation>(`/invitations/validate/${encodeURIComponent(token)}`, { skipAuthRetry: true }),
  getAll: async (): Promise<Invitation[]> => {
    const res = await httpClient.get<any>('/invitations');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  },

  invite: (payload: CreateInvitePayload): Promise<CreateInviteResponse> =>
    httpClient.post<CreateInviteResponse>('/invitations/invite', payload),

  update: (id: string, payload: CreateInvitePayload): Promise<CreateInviteResponse> =>
    httpClient.put<CreateInviteResponse>(`/invitations/${id}`, payload),

  cancel: (id: string): Promise<{ success: boolean }> => httpClient.patch<{ success: boolean }>(`/invitations/${id}/cancel`),

  accept: (token: string): Promise<AcceptInviteResponse> =>
    httpClient.post<AcceptInviteResponse>(`/invitations/accept/${encodeURIComponent(token)}`, undefined, { skipAuthRetry: true }),
};
