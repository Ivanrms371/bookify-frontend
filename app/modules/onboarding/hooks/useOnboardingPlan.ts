import { useCallback, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { onboardingApi } from "../api/onboarding.api";
import { useOnboardingStore } from "../store/onboarding-store";

export const useOnboardingPlan = () => {
  const navigate = useNavigate();
  const { tenantId } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    console.log(tenantId);
    if (!tenantId) {
      setError("No se ha encontrado el negocio en la URL.");
      return;
    }
    setIsLoading(true);
    setError(null);
    const plan = planId.toUpperCase() as "FREE" | "PRO" | "TEAM";
    const result = await onboardingApi.selectPlan(tenantId, plan);
    setIsLoading(false);
    console.log(result);
    if (result.error) {
      setError(result.error);
    } else {
      navigate(`/dashboard/${tenantId}`);
    }
  };

  return {
    handleSelectPlan,
    isLoading,
    error,
    tenantId,
  };
};
