import { httpClient } from '@/core/http/httpClient';
import type {
  CreateInvitePayload,
  CreateInviteResponse,
  AcceptInviteResponse,
  Invitation,
} from '../types/invitation.types';

export const invitationsApi = {
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

  accept: (token: string): Promise<AcceptInviteResponse> =>
    httpClient.get<AcceptInviteResponse>(`/invitations/accept/${token}`),
};
