import { authApi } from "@/modules/auth/api/auth.api";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { businessApi } from "@/modules/business/api/business.api";
import { useBusinessStore } from "@/modules/business/store/business.store";
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner";
import { AppShell } from "@/shared/components/layout/AppShell";
import { Outlet, redirect, useParams } from "react-router";

export async function clientLoader() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = await authApi.me();
    useAuthStore.getState().setSession({
      isAuthenticated: true,
      session: user,
    });
    useAuthStore.getState().setIsLoading(false);
    const params = useParams();

    if (!params.businessId) {
      throw redirect("/login"); // or 404
    }
    const business = await businessApi.getCurrentBusiness(params.businessId);
    // useBusinessStore.getState().setSession({business})

    return { user, business };
  } catch (error) {
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
