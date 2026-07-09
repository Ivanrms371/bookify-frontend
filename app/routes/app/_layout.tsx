import { TenantProvider } from '@/core/tenant/TenantProvider';
import { ThemeProvider } from '@/shared/providers';
import { AppShell } from '@/shared/components/layout/app-shell/app-shell';

export default function AppLayout() {
  return (
    <TenantProvider>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </TenantProvider>
  );
}
