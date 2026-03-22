import { Button } from "@/shared/components/form/Button";
import type { OnboardingPlan } from "../data/onboarding-plans.data";
import { twMerge } from "tailwind-merge";
import { CheckIcon } from "@heroicons/react/24/outline";

interface OnboardingPlanCardProps {
  plan: OnboardingPlan;
  onSelect: (planId: string) => void;
}

export function OnboardingPlanCard({
  plan,
  onSelect,
}: OnboardingPlanCardProps) {
  const { buttonText, description, features, id, name, price, isPopular } =
    plan;

  return (
    <div
      className={twMerge(
        "relative flex flex-col rounded-3xl bg-white dark:bg-mist-950 p-8 transition shadow-sm max-w-lg w-full mx-auto dark:shadow-none dark:border dark:border-mist-900",
        isPopular && "border-2 dark:border-mist-600 xl:scale-105 shadow-md",
      )}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-mist-900 text-mist-50 dark:bg-mist-100 dark:text-mist-900 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase">
          Más Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-3xl font-bold text-mist-900 dark:text-mist-100">
          {name}
        </h3>
        <p className="text-mist-500 dark:text-mist-400 mt-2">{description}</p>
      </div>

      <div className={`mb-6 ${isPopular ? "flex items-end gap-1" : ""}`}>
        <span className="text-5xl font-extrabold text-mist-800 dark:text-mist-100">
          ${plan.price}
        </span>
        <span className="text-mist-500 dark:text-mist-400 font-medium">
          /mes
        </span>
      </div>

      <ul className="flex flex-col gap-4 mb-8 grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div
              className={twMerge(
                "shrink-0 p-1 rounded-full",
                isPopular
                  ? "bg-mist-800 dark:bg-mist-100"
                  : "bg-mist-100 dark:bg-mist-800",
              )}
            >
              <CheckIcon
                className={twMerge(
                  "size-4",
                  isPopular
                    ? "text-mist-100 dark:text-mist-800"
                    : "text-mist-800 dark:text-mist-100",
                )}
              />
            </div>
            <span
              className={"text-sm font-medium text-mist-700 dark:text-mist-500"}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onSelect(id)}
        className={isPopular ? "button-primary" : "button-secondary"}
      >
        {buttonText}
      </Button>
    </div>
  );
}
