import { useNavigate } from "react-router";
import { useOnboardingStore } from "../store/onboarding-store";
import { useEffect } from "react";
import { onboardingApi } from "../api/onboarding.api";

export const useOnboardingGuard = () => {
  const { setTenantId } = useOnboardingStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOnboardingStatus();
  }, []);

  const fetchOnboardingStatus = async () => {
    try {
      const status = await onboardingApi.getStatus();

      setTenantId(status.tenantId);

      if (status.step === "setup") {
        navigate("/onboarding", { replace: true });
        return;
      }
      if (status.step === "plan") {
        navigate("/onboarding/plan", { replace: true });
        return;
      }
      if (status.step === "complete") {
        navigate(`/dashboard/${status.tenantId}`, { replace: true });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
};
