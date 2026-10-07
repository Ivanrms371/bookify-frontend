import { useAuthStore } from '@/core/auth/use-auth-store';
import { ReportsOverview } from '@/features/reports/components/reports-overview';

const ReportsPage = () => {
  const tenant = useAuthStore((s) => s.session?.activeTenant);

  if (!tenant) return null;

  return <ReportsOverview />;
};

export default ReportsPage;
