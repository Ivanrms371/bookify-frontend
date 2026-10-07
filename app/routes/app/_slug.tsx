import { Navigate, Outlet, useLocation, useParams } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { canAccessArea } from '@/core/auth/permissions';

export default function SlugLayout() {
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const { slug } = useParams();
  const { pathname } = useLocation();
  if (!tenant || tenant.slug !== slug) return null;
  const area = pathname.split('/')[2] ?? '';
  if (!canAccessArea(tenant, area)) {
    if (canAccessArea(tenant, 'calendar')) return <Navigate to={`/${tenant.slug}/calendar`} replace />;
    return <p role="alert" className="p-6">No tienes acceso a esta sección. Vuelve a iniciar sesión para actualizar tus permisos.</p>;
  }
  return <Outlet />;
}
