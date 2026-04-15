import { authApi } from "@/modules/auth/api/auth.api";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { tenantApi } from "@/modules/tenant/api/tenant.api";
import { useTenantStore } from "@/modules/tenant/store/tenant.store";
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner";
import { AppShell } from "@/shared/components/layout/AppShell";
import { Outlet, redirect, useParams } from "react-router";

export async function clientLoader() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = await authApi.me();
    useAuthStore.getState().setSession({
      isAuthenticated: true,
      ...user,
    });
    useAuthStore.getState().setIsLoading(false);
    const params = useParams();

    if (!params.tenantId || params.tenantId === "undefined") {
      if (user.tenants && user.tenants.length === 0) {
        throw redirect("/onboarding");
      }
      throw redirect("/login");
    }
    const tenant = await tenantApi.getCurrentTenant(params.tenantId);
    // useTenantStore.getState().setSession({tenant})

    return { user, tenant };
  } catch (error) {
    const session = useAuthStore.getState().session;
    if (session && session.tenants && session.tenants.length === 0) {
      throw redirect("/onboarding");
    }
    throw redirect("/login");
  }
}

export function HydrateFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export default function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
