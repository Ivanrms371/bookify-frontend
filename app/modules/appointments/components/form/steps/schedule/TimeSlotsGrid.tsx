import { ClockIcon } from "@heroicons/react/24/outline"
import { Button } from "@/shared/components/form/Button"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"

interface TimeSlotsGridProps {
  slots: string[]
  selectedTime: string | null
  onTimeSelect: (time: string) => void
  isFetchingSlots: boolean
  staffName?: string
  nextAvailableDate?: string
  activeDate: Date
  onNextAvailableDateClick: (date: Date) => void
}

export const TimeSlotsGrid = ({
  slots,
  selectedTime,
  onTimeSelect,
  isFetchingSlots,
  staffName,
  nextAvailableDate,
  activeDate,
  onNextAvailableDateClick,
}: TimeSlotsGridProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-mist-900 dark:text-white">
          Horarios
        </h3>
        <span className="text-sm font-medium bg-mist-50 dark:bg-mist-900/50 border border-mist-200 dark:border-mist-800 text-mist-600 dark:text-mist-400 px-2.5 py-1 rounded-md">
          {slots?.length || 0} turnos
        </span>
      </div>

      {isFetchingSlots ? (
        <div className="flex flex-col items-center justify-center py-2 text-center">
          <LoadingSpinner size="md" className="mb-6" />
          <p className="text-sm font-medium text-mist-500 dark:text-mist-400">
            Buscando horarios disponibles...
          </p>
        </div>
      ) : slots?.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
          {slots.map((slot: string) => {
            const isSelected = selectedTime === slot
            return (
              <button
                key={slot}
                onClick={() => onTimeSelect(slot)}
                className={`h-10 rounded-lg text-center font-medium text-sm transition-all duration-300 border ${
                  isSelected
                    ? "bg-mist-900 dark:bg-mist-100 border-mist-900 dark:border-mist-100 text-white dark:text-mist-900 shadow-sm"
                    : "bg-white dark:bg-transparent border-mist-200 dark:border-mist-800 text-mist-700 dark:text-mist-300 hover:border-mist-300 dark:hover:border-mist-600 hover:bg-mist-100 dark:hover:bg-mist-900/40"
                }`}
              >
                {slot}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="p-4 rounded-full bg-mist-100 dark:bg-mist-900/40 mb-4">
            <ClockIcon className="size-8 text-mist-400 dark:text-mist-500" />
          </div>
          <h3 className="text-mist-800 dark:text-mist-200 font-semibold mb-1 text-lg">
            Sin disponibilidad
          </h3>

          <p className="text-sm text-mist-500 dark:text-mist-400 font-medium max-w-sm">
            No hay horarios disponibles para {staffName} este día.
          </p>
          {nextAvailableDate &&
            new Date(nextAvailableDate).toDateString() !==
              activeDate.toDateString() && (
              <Button
                className="button-primary mt-4"
                onClick={() => onNextAvailableDateClick(new Date(nextAvailableDate))}
              >
                Ir al próximo día libre,{" "}
                {new Intl.DateTimeFormat("es-ES", {
                  dateStyle: "long",
                }).format(new Date(nextAvailableDate))}
              </Button>
            )}
        </div>
      )}
    </section>
  )
}
