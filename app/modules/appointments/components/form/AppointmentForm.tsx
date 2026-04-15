import { useAppointmentForm } from "../../context/appointment-form.context"
import { CustomerSelectionStep } from "./steps/customer/CustomerSelectionStep"
import { ServiceSelectionStep } from "./steps/service/ServiceSelectionStep"
import { ProfessionalSelectionStep } from "./steps/professional/ProfessionalSelectionStep"
import { ScheduleSelectionStep } from "./steps/schedule/ScheduleSelectionStep"
import { AppointmentFormHeader } from "./AppointmentFormHeader"

export const AppointmentForm = () => {
  const { step } = useAppointmentForm()

  return (
    <div className="flex flex-col h-full bg-white dark:bg-transparent">
      <AppointmentFormHeader />
      <div className="flex-1 relative">
        {step === 1 && <CustomerSelectionStep />}
        {step === 2 && <ServiceSelectionStep />}
        {step === 3 && <ProfessionalSelectionStep />}
        {step === 4 && <ScheduleSelectionStep />}
      </div>
    </div>
  )
}
