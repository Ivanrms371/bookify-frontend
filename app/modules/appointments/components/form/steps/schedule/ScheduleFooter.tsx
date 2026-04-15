import { Button } from "@/shared/components/form/Button"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"
import { formatAppointment } from "@/shared/utils/time"

interface ScheduleFooterProps {
  onBack: () => void
  onSave: () => void
  isSubmitting: boolean
  isValid: boolean
  mode: "create" | "reschedule"
  selectedDate: Date | null
  selectedTime: string | null
}

export const ScheduleFooter = ({
  onBack,
  onSave,
  isSubmitting,
  isValid,
  mode,
  selectedDate,
  selectedTime,
}: ScheduleFooterProps) => {
  return (
    <div className="p-6 shrink-0 border-t border-mist-200 dark:border-mist-800 bg-white dark:bg-mist-950 sticky bottom-0 z-20 flex justify-between items-center">
      <Button onClick={onBack} className="button-tertiary">
        Volver atrás
      </Button>
      <Button
        className="button-primary"
        disabled={!isValid || isSubmitting}
        onClick={onSave}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" className="mr-1" />
            {mode === "reschedule" ? "Reagendando..." : "Agendando..."}
          </div>
        ) : (isValid && selectedDate && selectedTime) ? (
          <>
            {mode === "reschedule" ? "Reagendar Cita" : "Confirmar Cita"}{" "}
            {formatAppointment(selectedDate, selectedTime, {
              dateStyle: "long",
            })}
          </>
        ) : (
          "Selecciona un horario"
        )}
      </Button>
    </div>
  )
}
