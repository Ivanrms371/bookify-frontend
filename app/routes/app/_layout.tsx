import { TenantProvider } from '@/core/tenant/TenantProvider';
import { AppShell } from '@/shared/components/layout/app-shell/app-shell';

export default function AppLayout() {
  return (
    <TenantProvider>
      <AppShell />
    </TenantProvider>
  );
}
