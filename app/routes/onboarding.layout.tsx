import {
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import { TurnifyLogo } from "@/shared/components/_ui/TurnifyLogo";
import { onboardingApi } from "@/modules/onboarding/api/onboarding.api";
import { useOnboardingStore } from "@/modules/onboarding/store/onboarding-store";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { usersApi } from "@/modules/auth/api/users.api";
import { useEffect } from "react";

export async function clientLoader() {
  try {
    let session = useAuthStore.getState().session;

    if (!session) {
      const user = await usersApi.getMe();
      useAuthStore.getState().setSession({ ...user, isAuthenticated: true });
      session = useAuthStore.getState().session;
    }

    const status = await onboardingApi.getStatus();
    useOnboardingStore.getState().setTenantId(status.tenantId);

    if (status.step === "complete")
      return redirect(`/dashboard/${status.tenantId}`);

    return { status };
  } catch (error) {
    return redirect("/login");
  }
}
export default function OnboardingLayout() {
  const { status } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (status.step === "setup" && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
    if (status.step === "plan" && location.pathname !== "/onboarding/plan") {
      navigate("/onboarding/plan", { replace: true });
    }
  }, [status, location.pathname]);

  return (
    <div className="flex justify-center items-center min-h-screen pt-10 pb-20">
      <div className="max-w-7xl w-full px-4">
        <TurnifyLogo className="mb-8 size-20" center />
        <Outlet />
      </div>
    </div>
  );
}
