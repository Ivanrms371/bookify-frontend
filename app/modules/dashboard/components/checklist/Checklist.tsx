import {
  CheckIcon,
  PlusIcon,
  ArrowRightIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useModalStore } from "@/shared/store/useModalStore";
import { useBusinessStore } from "@/modules/business/store/business.store";
import { useGetChecklist } from "@/modules/onboarding/hooks/useGetChecklist";
import { useEffect, useState, useRef } from "react";
import { twMerge } from "tailwind-merge";

const ALL_CHECKLIST_STEPS = [
  { id: "address", text: "Agrega la dirección de tu negocio" },
  { id: "availability", text: "Define tus horarios de atención" },
  { id: "businessImages", text: "Agrega logo e imagen de portada" },
  { id: "serviceCreate", text: "Agrega tu primer servicio" },
  { id: "inviteTeam", text: "Invita a tu equipo (opcional)" },
  { id: "publishBusiness", text: "Publica tu negocio" },
] as const;

const EXIT_ANIMATION_MS = 500;

export const Checklist = () => {
  const { openModal } = useModalStore();
  const [expanded, setExpanded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [hasExited, setHasExited] = useState(false);
  const wasVisibleRef = useRef(false);
  const currentBusiness = useBusinessStore((state) => state.currentBusiness);
  const { data: checklistData, isLoading } = useGetChecklist(
    currentBusiness?.id,
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isCompleted = checklistData?.isCompleted ?? false;

  useEffect(() => {
    if (isCompleted && wasVisibleRef.current) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setHasExited(true);
      }, EXIT_ANIMATION_MS);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  const onMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setExpanded(true);
  };

  const onMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setExpanded(false), 5000);
  };

  if (isLoading || !checklistData) return null;

  if (!isCompleted) wasVisibleRef.current = true;
  if (hasExited || (isCompleted && !wasVisibleRef.current)) return null;

  const currentProgress = checklistData.steps as Record<string, boolean>;

  const stepsToRender = ALL_CHECKLIST_STEPS.filter(
    (step) => step.id in currentProgress,
  );

  const completedCount = Object.values(currentProgress).filter(Boolean).length;
  const totalCount = stepsToRender.length;

  const nextAvailableIndex = stepsToRender.findIndex(
    (step) => !currentProgress[step.id],
  );

  return (
    <div
      className={twMerge(
        "backdrop-blur-xl bg-linear-to-br from-mist-100 to-mist-300 dark:from-mist-800/40 dark:to-mist-800 shadow-md rounded-4xl p-7 max-w-lg w-full fixed bottom-8 right-8 overflow-hidden transition-all duration-500 ease-out",
        expanded ? "h-112" : "h-30",
        !isExiting && "hover:scale-105 duration-700",
        isExiting && "translate-x-full opacity-0 scale-95 pointer-events-none",
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex mb-4 gap-4 justify-between">
        <div>
          <h2 className="text-mist-800 dark:text-mist-50 text-2xl font-semibold">
            Incorporación
          </h2>
          <p className="text-mist-700 dark:text-mist-400 font-medium">
            Completa los últimos pasos para comenzar a recibir reservas.
          </p>
        </div>
        <div
          className="flex items-center justify-center min-w-10 min-h-10 h-10 rounded-full 
      bg-linear-to-tr bg-mist-900 dark:bg-mist-100 shadow-sm"
        >
          <span className="text-mist-100 dark:text-mist-900 text-sm font-semibold">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>
      <ul className="space-y-2">
        {stepsToRender.map((step, index) => {
          const isCompleted = currentProgress[step.id];
          const isNextStep = index === nextAvailableIndex;
          const isLocked = !isNextStep && !isCompleted;

          return (
            <li
              key={step.id}
              className={`group flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                isCompleted
                  ? "border-emerald-300 bg-emerald-100/80 dark:border-emerald-900/80 dark:bg-emerald-950/40 pointer-events-none"
                  : isLocked
                    ? "border-mist-200 bg-mist-50 opacity-60 dark:border-mist-800 dark:bg-mist-900 pointer-events-none"
                    : "cursor-pointer border-mist-300 bg-mist-100 hover:border-mist-400 dark:border-mist-900/80 dark:bg-mist-950/40"
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
                        ? "border-mist-300 bg-mist-200 dark:border-mist-700 dark:bg-mist-800"
                        : "border-mist-300 group-hover:border-mist-600 dark:border-mist-800"
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className="size-4 text-white" />
                  ) : isLocked ? (
                    <LockClosedIcon className="size-4 text-mist-400" />
                  ) : (
                    <PlusIcon className="size-4 text-transparent" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isCompleted
                      ? "text-emerald-600 line-through dark:text-emerald-500"
                      : isLocked
                        ? "text-mist-400 dark:text-mist-500"
                        : "text-mist-700 dark:text-mist-300"
                  }`}
                >
                  {step.text}
                </span>
              </div>
              {!isCompleted && !isLocked && (
                <ArrowRightIcon className="size-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-mist-500" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
