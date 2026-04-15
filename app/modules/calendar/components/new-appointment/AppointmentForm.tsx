import { Heading } from "@/shared/components/typography/Heading"
import { steps } from "../../constants/steps"
import { useAppointmentForm } from "../../context/appointment-form.context"
import { CustomerSelectionStep } from "./steps/CustomerSelectionStep"
import { ServiceSelectionStep } from "./steps/ServiceSelectionStep"
import { ProfessionalSelectionStep } from "./steps/ProfessionalSelectionStep"
import { ScheduleSelectionStep } from "./steps/ScheduleSelectionStep"

interface Props {
  title: string
}

export const AppointmentForm = ({ title }: Props) => {
  const { step, mode } = useAppointmentForm()

  // In reschedule mode, filter out step 1 (Cliente)
  const visibleSteps = mode === "reschedule" ? steps.filter((s) => s.num !== 1) : steps

  return (
    <div className="w-full max-w-3xl flex flex-col min-h-full h-full bg-mist-50/30 dark:bg-mist-950">
      {/* Header Stepper UI */}
      <div className="px-3 lg:px-8 border-b border-mist-200 dark:border-mist-800 bg-white/50 dark:bg-mist-950/50 backdrop-blur-xl shrink-0 z-10 sticky top-0 py-6">
        <Heading as="h2" className="mb-5 text-2xl font-semibold tracking-tight">
          {title}
        </Heading>
        <div className="flex items-center gap-2 w-full">
          {visibleSteps.map((s) => {
            const isActive = step === s.num
            const isPast = step > s.num

            return (
              <div key={s.num} className="flex flex-col gap-1.5 flex-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest pl-0.5 transition-colors duration-300 ${
                    isActive
                      ? "text-mist-900 dark:text-white"
                      : isPast
                        ? "text-mist-500 dark:text-mist-400"
                        : "text-mist-400 dark:text-mist-600"
                  }`}
                >
                  {s.label}
                </span>
                <div
                  className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                    isActive || isPast
                      ? "bg-mist-900 dark:bg-mist-100"
                      : "bg-mist-100 dark:bg-mist-800"
                  }`}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Sliding Wrapper */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <div
          className="flex h-full w-[400%] transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(step - 1) * 25}%)` }}
        >
          {/* Step 1: Client */}
          <div className="w-1/4 h-full relative flex flex-col">
            <CustomerSelectionStep />
          </div>

          {/* Step 2: Service */}
          <div className="w-1/4 h-full relative flex flex-col">
            <ServiceSelectionStep />
          </div>

          {/* Step 3: Professional */}
          <div className="w-1/4 h-full relative flex flex-col">
            <ProfessionalSelectionStep />
          </div>

          {/* Step 4: Schedule */}
          <div className="w-1/4 h-full relative flex flex-col">
            <ScheduleSelectionStep />
          </div>
        </div>
      </div>
    </div>
  )
}
