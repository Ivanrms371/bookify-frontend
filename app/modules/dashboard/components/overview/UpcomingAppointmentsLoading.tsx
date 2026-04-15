import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"

export const UpcomingAppointmentsLoading = () => {
  return (
    <div className="col-span-5 flex items-center justify-center min-h-[400px]">
      <LoadingSpinner />
    </div>
  )
}
