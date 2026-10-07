import { can, type Permission } from '@/core/auth/permissions';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { ApiError } from '@/core/error/api-error';

export function isSettingsTenantCurrent(tenantId: string) {
  const tenant = useAuthStore.getState().session?.activeTenant;
  if (!tenant || tenant.id !== tenantId) return false;
  if (typeof window === 'undefined') return true;
  return window.location.pathname.split('/')[1] === tenant.slug;
}

export function requireSettingsTenant(tenantId: string, permission?: Permission) {
  if (permission && !can(useAuthStore.getState().session?.activeTenant, permission))
    throw new ApiError('No tienes permiso para modificar estos ajustes.');
  if (!isSettingsTenantCurrent(tenantId)) throw new ApiError('El negocio cambió. Vuelve a abrir el formulario.');
}
