import { useGetChecklist } from "@/modules/onboarding/hooks/useGetChecklist"
import { useTenantStore } from "@/modules/tenant/store/tenant.store"
import { ALL_CHECKLIST_STEPS } from "../constants/checklist"

export const useChecklistData = () => {
  const currentTenant = useTenantStore((state) => state.currentTenant)
  const { data, isLoading } = useGetChecklist(currentTenant?.id)

  const currentProgress = (data?.steps as Record<string, boolean>) ?? {}

  const stepsToRender = ALL_CHECKLIST_STEPS.filter(
    (step) => step.id in currentProgress,
  )

  const completedCount = Object.values(currentProgress).filter(Boolean).length
  const totalCount = stepsToRender.length

  const nextAvailableIndex = stepsToRender.findIndex(
    (step) => !currentProgress[step.id],
  )

  return {
    data,
    isLoading,
    currentProgress,
    stepsToRender,
    completedCount,
    totalCount,
    nextAvailableIndex,
    isCompleted: data?.isCompleted ?? false,
  }
}
