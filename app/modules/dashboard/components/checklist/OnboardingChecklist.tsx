import { cn } from "@/shared/lib/utils"
import { useChecklist } from "../../hooks/useChecklist"
import { ChecklistHeader } from "./ChecklistHeader"
import { ChecklistList } from "./ChecklistList"
import { ChecklistItem } from "./ChecklistItem"

export const OnboardingChecklist = () => {
  const {
    expanded,
    isExiting,
    hasExited,
    isLoading,
    isCompleted,
    onMouseEnter,
    onMouseLeave,
    completedCount,
    totalCount,
    stepsToRender,
    currentProgress,
    nextAvailableIndex,
  } = useChecklist()

  if (hasExited || isLoading || isCompleted) return null

  return (
    <div
      className={cn(
        "backdrop-blur-xl bg-linear-to-br from-mist-100 to-mist-300 dark:from-mist-800/40 dark:to-mist-800 shadow-md rounded-4xl p-7 max-w-lg w-full fixed z-50 bottom-8 right-8 overflow-hidden transition-all duration-500 ease-out",
        expanded ? "h-112" : "h-30",
        !isExiting && "hover:scale-105 duration-700",
        isExiting && "translate-x-full opacity-0 scale-95 pointer-events-none",
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ChecklistHeader currentStep={completedCount} totalSteps={totalCount} />
      <ChecklistList>
        {stepsToRender.map((step, index) => (
          <ChecklistItem
            isCompleted={currentProgress[step.id]}
            isNextStep={index === nextAvailableIndex}
            step={step}
          />
        ))}
      </ChecklistList>
    </div>
  )
}
