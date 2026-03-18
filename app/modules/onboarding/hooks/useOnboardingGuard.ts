import { useNavigate } from "react-router";
import { useOnboardingStore } from "../store/onboarding-store";
import { useEffect } from "react";
import { onboardingApi } from "../api/onboarding.api";

export const useOnboardingGuard = () => {
  const { setBusinessId } = useOnboardingStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOnboardingStatus();
  }, []);

  const fetchOnboardingStatus = async () => {
    try {
      const status = await onboardingApi.getStatus();

      setBusinessId(status.businessId);

      if (status.step === "setup") {
        navigate("/onboarding", { replace: true });
        return;
      }
      if (status.step === "plan") {
        navigate("/onboarding/plan", { replace: true });
        return;
      }
      if (status.step === "complete") {
        navigate(`/dashboard/${status.businessId}`, { replace: true });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
};
