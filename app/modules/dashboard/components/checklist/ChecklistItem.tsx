import { useModalStore } from "@/shared/store/useModalStore"
import { LockClosedIcon } from "@heroicons/react/24/outline"
import { ArrowRightIcon, CheckIcon, PlusIcon } from "lucide-react"

interface ChecklistItemProps {
  step: {
    id: string
    text: string
  }
  isCompleted: boolean
  isNextStep: boolean
}

export const ChecklistItem = ({
  step,
  isCompleted,
  isNextStep,
}: ChecklistItemProps) => {
  const { openModal } = useModalStore()
  const isLocked = !isNextStep && !isCompleted

  return (
    <li
      className={`group flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-300 ${
        isCompleted
          ? "border-emerald-300 bg-emerald-100/80 dark:border-emerald-900/80 dark:bg-emerald-950/40 pointer-events-none"
          : isLocked
            ? "border-mist-200 bg-mist-50 opacity-60 dark:border-mist-800 dark:bg-mist-900 pointer-events-none"
            : "cursor-pointer border-mist-300 bg-mist-100 hover:border-mist-400 dark:border-mist-900/80 dark:bg-mist-950/40"
      }`}
      onClick={
        isLocked || isCompleted ? undefined : () => openModal(step.id as any)
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
  )
}
