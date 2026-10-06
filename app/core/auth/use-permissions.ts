import { useAuthStore } from './use-auth-store';
import { can, canAccessArea, canManageAppointment, type Permission } from './permissions';

export function usePermissions() {
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  return {
    can: (permission: Permission) => can(tenant, permission),
    canAccessArea: (area: string) => canAccessArea(tenant, area),
    canManageAppointment: (action: Parameters<typeof canManageAppointment>[1], professionalId: string | null | undefined) =>
      canManageAppointment(tenant, action, professionalId),
  };
}
