import { usersApi } from "@/modules/auth/api/users.api";
import type { Route } from "./+types/dashboard.layout";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { AppShell } from "@/shared/components/layout/AppShell";
import { Outlet, redirect, useLoaderData } from "react-router";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  try {
    const user = await usersApi.getMe();

    useAuthStore.getState().setSession({ ...user, isAuthenticated: true });

    if (user.businesses.length === 0) {
      throw redirect("/onboarding");
    }

    const businessId = params.businessId;
    let business = user.businesses.find((b) => b.id === businessId);

    if (!business) {
      business = user.businesses[0];
      throw redirect(`/dashboard/${business.id}`);
    }

    const { useBusinessStore } =
      await import("@/modules/business/store/business.store");
    // Explicit cast since the array object acts as a basic/partial version of Business
    useBusinessStore.getState().setCurrentBusiness(business as any);

    return {
      user,
      business,
    };
  } catch (error) {
    throw redirect("/login");
  }
}

import { GlobalModalProvider } from "@/shared/components/providers/GlobalModalProvider";
import { Checklist } from "@/modules/dashboard/components/checklist/Checklist";

export default function DashboardLayout() {
  const { business, user } = useLoaderData<typeof clientLoader>();

  return (
    <AppShell>
      <Outlet context={{ business, user }} />
      <Checklist />
      <GlobalModalProvider />
    </AppShell>
  );
}
