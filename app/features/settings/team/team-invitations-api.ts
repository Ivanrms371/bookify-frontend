import { httpClient } from '@/core/http/httpClient';
import type { TeamRole } from './team-model';
import type { TeamInvitationRecord, TeamResponseRecord } from './team-invitation.types';

export const teamInvitationsApi = {
  getTeam: (tenantId: string) => httpClient.get<TeamResponseRecord>('/team', { expectedTenantId: tenantId }),
  updateMember: (tenantId: string, id: string, payload: { role?: TeamRole; isActive?: boolean }) =>
    httpClient.patch<{ success: true }>(`/team/members/${id}`, payload, { expectedTenantId: tenantId, skipAuthRetry: true }),
  invite: (tenantId: string, payload: { email: string; role: TeamRole }) =>
    httpClient.post<TeamInvitationRecord>('/team/members/invite', payload, { expectedTenantId: tenantId, skipAuthRetry: true }),
  resend: (tenantId: string, id: string) =>
    httpClient.post<TeamInvitationRecord>(`/team/invitations/${id}/resend`, undefined, { expectedTenantId: tenantId, skipAuthRetry: true }),
  cancel: (tenantId: string, id: string) =>
    httpClient.delete<{ success: true }>(`/team/invitations/${id}`, { expectedTenantId: tenantId, skipAuthRetry: true }),
};
