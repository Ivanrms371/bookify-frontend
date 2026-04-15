import { usersApi } from "@/modules/auth/api/users.api"
import type { Route } from "./+types/dashboard.layout"
import { useAuthStore } from "@/modules/auth/store/auth-store"
import { AppShell } from "@/shared/components/layout/AppShell"
import { Outlet, redirect, useLoaderData } from "react-router"

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  try {
    const user = await usersApi.getMe()

    console.log(user)

    useAuthStore.getState().setSession({ ...user, isAuthenticated: true })

    if (user.tenants.length === 0) {
      throw redirect("/onboarding")
    }

    const tenantId = params.tenantId
    let tenant = user.tenants.find((b) => b.id === tenantId)

    if (!tenant) {
      tenant = user.tenants[0]
      throw redirect(`/dashboard/${tenant.id}`)
    }

    const { useTenantStore } =
      await import("@/modules/tenant/store/tenant.store")
    // Explicit cast since the array object acts as a basic/partial version of Tenant
    useTenantStore.getState().setCurrentTenant(tenant as any)

    return {
      user,
      tenant,
    }
  } catch (error: any) {
    if (error?.response?.status === 404 || error?.status === 404) {
      throw redirect("/onboarding")
    }
    throw redirect("/login")
  }
}

import { GlobalModalProvider } from "@/shared/components/providers/GlobalModalProvider"
import { OnboardingChecklist } from "@/modules/dashboard/components/checklist/OnboardingChecklist"

export default function DashboardLayout() {
  const { tenant, user } = useLoaderData<typeof clientLoader>()

  return (
    <AppShell>
      <Outlet context={{ tenant, user }} />
      <OnboardingChecklist />
      <GlobalModalProvider />
    </AppShell>
  )
}
