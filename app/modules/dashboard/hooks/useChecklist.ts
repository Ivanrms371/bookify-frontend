import { useChecklistData } from "./useChecklistData"
import { useChecklistUI } from "./useChecklistUI"

export const useChecklist = () => {
  const checklistData = useChecklistData()
  const checklistUI = useChecklistUI(checklistData.isCompleted)
  return {
    ...checklistData,
    ...checklistUI,
  }
}
