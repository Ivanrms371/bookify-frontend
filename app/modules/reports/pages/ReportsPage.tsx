// src/features/reports/hooks/useStaffReports.ts
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useTenant } from '@/shared/context/tenant.context';
import { ReportsOwnerView } from '../views/ReportsOwnerView';
import { ReportsAdminView } from '../views/ReportsAdminView';
import { ReportsStaffView } from '../views/ReportsStaffView';

export default function ReportsPage() {
  const { session } = useAuth();
  const { tenantId } = useTenant();

  const tenant = session?.tenants.find(t => t.id === tenantId);
  
  if(tenant?.membership === 'OWNER') {
    return <ReportsOwnerView />
  }

  if(tenant?.membership === 'ADMIN') {
    return <ReportsAdminView />
  }

  if(tenant?.membership === 'STAFF') {
    return <ReportsStaffView />
  }

  return null
};