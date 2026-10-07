import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { ApiError } from '@/core/error/api-error';
import { canManage } from './team-model';
import { teamInvitationsApi } from './team-invitations-api';
import type { InvitationAction, MemberAction, TeamResponseRecord } from './team-invitation.types';

const invitationSchema = z.object({
  email: z.string().trim().toLowerCase().email('Ingresa un correo válido.'),
  role: z.enum(['ADMIN', 'STAFF']),
});
export const teamInvitationsKey = (tenantId: string) => ['team', tenantId] as const;

export function useTeamData(tenantId: string, enabled: boolean) {
  return useQuery({
    queryKey: teamInvitationsKey(tenantId),
    enabled,
    queryFn: () => teamInvitationsApi.getTeam(tenantId),
  });
}

function requireTeamManager(tenantId: string) {
  const session = useAuthStore.getState().session;
  const tenant = session?.activeTenant;
  if (
    !session ||
    tenant?.id !== tenantId ||
    !['OWNER', 'ADMIN'].includes(tenant.role) ||
    window.location.pathname.split('/')[1] !== tenant.slug
  ) {
    throw new ApiError('El espacio seleccionado cambió. Volvé a abrir el formulario.');
  }
  return { session, tenant };
}

export function useTeamInvitationAction(tenantId: string) {
  const queries = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (action: InvitationAction) => {
      const { tenant } = requireTeamManager(tenantId);
      if (action.type === 'invite') {
        const result = invitationSchema.safeParse(action);
        if (!result.success) throw new ApiError(result.error.issues[0]?.message ?? 'Revisa los datos de la invitación.');
        if (tenant.role === 'ADMIN' && result.data.role !== 'STAFF') throw new ApiError('Solo puedes invitar personal.');
        return teamInvitationsApi.invite(tenantId, result.data);
      }
      return action.type === 'resend' ? teamInvitationsApi.resend(tenantId, action.id) : teamInvitationsApi.cancel(tenantId, action.id);
    },
    onSuccess: () => {
      // Refetch failures must not turn a committed action into a failed submission.
      for (const key of [teamInvitationsKey(tenantId), ['professionals', tenantId], ['professional', tenantId]]) {
        void queries.invalidateQueries({ queryKey: key });
      }
    },
    onError: () => {
      // Refresh stale invitations after conflicts or permission changes.
      void queries.invalidateQueries({ queryKey: teamInvitationsKey(tenantId) });
    },
  });
}

export function useTeamMemberAction(tenantId: string) {
  const queries = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (action: MemberAction) => {
      const { session, tenant } = requireTeamManager(tenantId);
      const member = queries.getQueryData<TeamResponseRecord>(teamInvitationsKey(tenantId))?.members.find((item) => item.id === action.id);
      if (!member || !canManage({ id: session.id, role: tenant.role }, member)) {
        throw new ApiError('No puedes modificar a este miembro. Actualiza el equipo y vuelve a intentarlo.');
      }
      if (action.type === 'role') {
        if (!['ADMIN', 'STAFF'].includes(action.role) || (tenant.role === 'ADMIN' && action.role !== 'STAFF')) {
          throw new ApiError('No tienes permiso para asignar este rol.');
        }
        return teamInvitationsApi.updateMember(tenantId, action.id, { role: action.role });
      }
      if (typeof action.isActive !== 'boolean') throw new ApiError('Selecciona un estado de acceso válido.');
      return teamInvitationsApi.updateMember(tenantId, action.id, { isActive: action.isActive });
    },
    onSuccess: (_result, action) => {
      queries.setQueryData<TeamResponseRecord>(
        teamInvitationsKey(tenantId),
        (current) =>
          current && {
            ...current,
            members: current.members.map((member) =>
              member.id !== action.id
                ? member
                : action.type === 'role'
                  ? { ...member, role: action.role }
                  : { ...member, isActive: action.isActive },
            ),
          },
      );
      for (const key of [teamInvitationsKey(tenantId), ['professionals', tenantId], ['professional', tenantId]]) {
        void queries.invalidateQueries({ queryKey: key });
      }
    },
    onError: () => {
      void queries.invalidateQueries({ queryKey: teamInvitationsKey(tenantId) });
    },
  });
}
