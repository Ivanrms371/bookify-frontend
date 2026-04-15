import { RevenueSection } from "./RevenueSection"
import { UpcomingAppointmentsSection } from "./UpcomingAppointmentsSection"

export const DashboardOverview = () => {
  return (
    <div className="grid lg:grid-cols-12 mt-4 gap-4">
      <RevenueSection />
      <UpcomingAppointmentsSection />
    </div>
  )
}
