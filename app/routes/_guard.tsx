import { Outlet, useLocation, Navigate } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { ONBOARDING_STATUS_TO_ROUTE } from '@/shared/constants/onboarding';

export default function RouteGuard() {
  const { isAuthenticated, session } = useAuthStore();
  const location = useLocation();

  if (location.pathname === '/auth/signup' && new URLSearchParams(location.search).has('token'))
    return <Navigate to={`/auth/invitations${location.search}`} replace />;
  if (location.pathname.startsWith('/auth') && new URLSearchParams(location.search).has('invitationToken')) return <Outlet />;

  if (!isAuthenticated) {
    if (location.pathname.startsWith('/auth')) {
      return <Outlet />;
    }

    return <Navigate to="/auth/login" replace />;
  }

  const tenant = session?.activeTenant;

  if (!tenant) {
    if (location.pathname.startsWith('/onboarding')) {
      return <Outlet />;
    }
    return <Navigate to="/onboarding/welcome" replace />;
  }

  if (tenant.role === 'OWNER' && tenant.onboardingStatus !== 'COMPLETED') {
    if (location.pathname.startsWith('/onboarding')) {
      return <Outlet />;
    }

    const expectedRoute = ONBOARDING_STATUS_TO_ROUTE[tenant.onboardingStatus];
    return <Navigate to={expectedRoute} replace />;
  }

  if (tenant.onboardingStatus === 'COMPLETED') {
    const appRoot = `/${tenant.slug}`;

    if (location.pathname.startsWith(appRoot)) {
      return <Outlet />;
    }

    return <Navigate to={appRoot} replace />;
  }

  return <Navigate to="/404" replace />;
}
