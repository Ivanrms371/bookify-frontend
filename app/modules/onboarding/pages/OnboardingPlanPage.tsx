import { ONBOARDING_PLANS } from "../data/onboarding-plans.data";
import { OnboardingPlanCard } from "../components/OnboardingPlanCard";
import { useOnboardingPlan } from "../hooks/useOnboardingPlan";

export default function OnboardingPlanPage() {
  const { handleSelectPlan } = useOnboardingPlan();
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4 max-w-3xl mx-auto">
        Elige tu plan
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg text-center max-w-2xl mx-auto">
        Selecciona el plan que mejor se adapte a las necesidades de tu negocio
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {ONBOARDING_PLANS.map((plan) => (
          <OnboardingPlanCard
            key={plan.id}
            plan={plan}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>
    </>
  );
}
