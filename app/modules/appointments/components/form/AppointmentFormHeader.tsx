import { Heading } from "@/shared/components/typography/Heading"
import { useAppointmentForm } from "../../context/appointment-form.context"
import { cn } from "@/shared/lib/utils"
import { getInitials } from "@/shared/utils/string"

export const AppointmentFormHeader = () => {
  const { title, step, visibleSteps, customer } = useAppointmentForm()

  // We show customer info if we are NOT in reschedule mode BUT a customer is pre-selected
  // (which means it was started from a specific customer profile/action)
  // Or in any case where we skip step 1 but have a customer.
  const showCustomerInfo = !!customer && !visibleSteps.some(s => s.id === 1)

  return (
    <div className="px-3 lg:px-8 border-b border-mist-200 dark:border-mist-800 bg-white/50 dark:bg-mist-950/50 backdrop-blur-xl shrink-0 z-10 sticky top-0 py-8">
      <div className="flex flex-col gap-1 mb-6">
        <Heading as="h2" className="text-2xl font-bold tracking-tight text-mist-900 dark:text-white">
          {title}
        </Heading>
        
        {showCustomerInfo && (
          <div className="flex items-center gap-2 mt-1 px-1">
            <div className="size-6 rounded-full bg-mist-100 dark:bg-mist-800 flex items-center justify-center text-[10px] font-bold text-mist-600 dark:text-mist-400 uppercase">
              {getInitials(customer.name)}
            </div>
            <span className="text-sm font-medium text-mist-600 dark:text-mist-400 tracking-tight">
              {customer.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 w-full">
        {visibleSteps.map((s) => {
          const isActive = step === s.id
          const isPast = step > s.id

          return (
            <div key={s.id} className="flex flex-col gap-2 flex-1">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest pl-0.5 transition-all duration-300",
                  isActive
                    ? "text-mist-900 dark:text-white"
                    : isPast
                    ? "text-mist-500 dark:text-mist-400"
                    : "text-mist-400 dark:text-mist-600"
                )}
              >
                {s.name}
              </span>
              <div
                className={cn(
                  "h-1.5 w-full rounded-full transition-all duration-500",
                  isActive || isPast
                    ? "bg-mist-900 dark:bg-mist-100"
                    : "bg-mist-100 dark:bg-mist-800"
                )}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}