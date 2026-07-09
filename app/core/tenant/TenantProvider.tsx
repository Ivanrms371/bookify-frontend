import { Navigate, useParams } from 'react-router';
import { useAuthStore } from '@/core/auth/useAuthStore';

interface Props {
  children: React.ReactNode;
}

export function TenantProvider({ children }: Props) {
  const { slug } = useParams();
  const { tenant, isLoading, isAuthenticated } = useAuthStore();

  if (isLoading) return 'Loading...';

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  if (!tenant) return <Navigate to="/onboarding/welcome" replace />;

  if (slug && tenant.slug !== slug) return <Navigate to={`/${tenant.slug}`} replace />;

  return children;
}
