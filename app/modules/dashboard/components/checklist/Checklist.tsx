import {
  CheckIcon,
  PlusIcon,
  ArrowRightIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useModalStore } from "@/shared/store/useModalStore";
import { useBusinessStore } from "@/modules/business/store/business.store";
import { useEffect, useState, useRef } from "react";
import { twMerge } from "tailwind-merge";

const CHECKLIST_STEPS = [
  { id: "address", text: "Agrega la dirección de tu negocio" },
  { id: "availability", text: "Define tus horarios de atención" },
  { id: "businessImages", text: "Agrega logo e imagen de portada" },
  { id: "serviceCreate", text: "Agrega tu primer servicio" },
  { id: "inviteTeam", text: "Invita a tu equipo (opcional)" },
  { id: "publishBusiness", text: "Publica tu negocio" },
] as const;

export const Checklist = () => {
  const { openModal } = useModalStore();
  const [expanded, setExpanded] = useState(false);
  const currentBusiness = useBusinessStore((state) => state.currentBusiness);

  const currentProgress: Record<string, boolean> = {
    address: !!currentBusiness?.addressLine1,
    availability: !!currentBusiness?.onboardingSteps?.workingHours,
    businessImages: !!(currentBusiness?.logoUrl || currentBusiness?.coverUrl),
    serviceCreate: !!currentBusiness?.onboardingSteps?.service,
    inviteTeam: !!currentBusiness?.onboardingSteps?.team,
    publishBusiness: !!currentBusiness?.onboardingSteps?.published,
  };

  const completedCount = Object.values(currentProgress).filter(Boolean).length;
  const totalCount = CHECKLIST_STEPS.length;

  const nextAvailableIndex = CHECKLIST_STEPS.findIndex(
    (step) => !currentProgress[step.id],
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setExpanded(true);
  };

  const onMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setExpanded(false), 5000);
  };

  return (
    <div
      className={twMerge(
        "backdrop-blur-xl bg-linear-to-br from-indigo-200 to-purple-200  dark:from-indigo-800/20 dark:to-purple-800/20 shadow-md rounded-4xl p-7 max-w-lg w-full fixed bottom-8 right-8 transition-all duration-700 hover:scale-105 overflow-hidden",
        expanded ? "h-128" : "h-30",
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex mb-4 gap-4 justify-between">
        <div>
          <h2 className="text-gray-800 dark:text-gray-50 text-2xl font-semibold">
            Incorporación
          </h2>
          <p className="text-gray-700 dark:text-gray-400 font-medium">
            Completa los últimos pasos para comenzar a recibir reservas.
          </p>
        </div>
        <div
          className="flex items-center justify-center min-w-10 min-h-10 h-10 rounded-full 
      bg-linear-to-tr bg-gray-900 dark:bg-gray-100 shadow-sm"
        >
          <span className="text-gray-100 dark:text-gray-900 text-sm font-semibold">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>
      <ul className="space-y-2">
        {CHECKLIST_STEPS.map((step, index) => {
          const isCompleted = currentProgress[step.id];
          const isNextStep = index === nextAvailableIndex;
          const isLocked = false;

          return (
            <li
              key={step.id}
              className={`group flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                isCompleted
                  ? "border-emerald-300 bg-emerald-100/80 dark:border-emerald-900/80 dark:bg-emerald-950/40 pointer-events-none"
                  : isLocked
                    ? "border-gray-200 bg-gray-50 opacity-60 dark:border-gray-800 dark:bg-gray-900 pointer-events-none"
                    : "cursor-pointer border-gray-300 bg-gray-100 hover:border-gray-400 dark:border-gray-900/80 dark:bg-gray-950/40"
              }`}
              onClick={
                isLocked || isCompleted
                  ? undefined
                  : () => openModal(step.id as any)
              }
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-6 items-center justify-center rounded-full border p-0.5 ${
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500"
                      : isLocked
                        ? "border-gray-300 bg-gray-200 dark:border-gray-700 dark:bg-gray-800"
                        : "border-gray-300 group-hover:border-gray-600 dark:border-gray-800"
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className="size-4 text-white" />
                  ) : isLocked ? (
                    <LockClosedIcon className="size-4 text-gray-400" />
                  ) : (
                    <PlusIcon className="size-4 text-transparent" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isCompleted
                      ? "text-emerald-600 line-through dark:text-emerald-500"
                      : isLocked
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {step.text}
                </span>
              </div>
              {!isCompleted && !isLocked && (
                <ArrowRightIcon className="size-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-gray-500" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
