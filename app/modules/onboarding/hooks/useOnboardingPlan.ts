import { useCallback, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { onboardingApi } from "../api/onboarding.api";
import { useOnboardingStore } from "../store/onboarding-store";

export const useOnboardingPlan = () => {
  const navigate = useNavigate();
  const { businessId } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    console.log(businessId);
    if (!businessId) {
      setError("No se ha encontrado el negocio en la URL.");
      return;
    }
    setIsLoading(true);
    setError(null);
    const planType = planId.toUpperCase() as "FREE" | "PRO" | "TEAM";
    const result = await onboardingApi.selectPlan(businessId, planType);
    setIsLoading(false);
    console.log(result);
    if (result.error) {
      setError(result.error);
    } else {
      navigate(`/dashboard/${businessId}`);
    }
  };

  return {
    handleSelectPlan,
    isLoading,
    error,
    businessId,
  };
};
