import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import { Button } from "@/shared/components/form/Button"
import { ArrowRightIcon, ClockIcon } from "@heroicons/react/20/solid"
import { formatAppointment } from "@/shared/utils/time"
import { useEffect, useState } from "react"
import { cn } from "@/shared/lib/utils"

import { useAppointmentForm } from "../../../context/appointment-form.context"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"

const getNextDays = (startDate: Date, daysToShow = 30): Date[] => {
  const result: Date[] = []
  let date = new Date(startDate)
  for (let i = 0; i < daysToShow; i++) {
    result.push(new Date(date)) // pushear copia del objeto
    date.setDate(date.getDate() + 1)
  }
  return result
}

export const ScheduleSelectionStep = () => {
  const {
    mode,
    staff,
    onBack,
    save: onSave,
    slots,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    nextAvailableDate,
    maxAdvancedDays = 30,
    workingHours = [],
    exceptions = [],
    isFetchingSlots,
    isSubmitting,
  } = useAppointmentForm()
  const formatDayName = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", { weekday: "short" })
      .format(date)
      .replace(".", "")
  }
  const [nextDays, setNextDays] = useState<Date[]>([])

  console.log("slots", slots)
  console.log("nextAvailableDate", nextAvailableDate)

  useEffect(() => {
    setNextDays(getNextDays(new Date(), maxAdvancedDays))
  }, [maxAdvancedDays])

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date())
    }
  }, [selectedDate, setSelectedDate])
  const handleSave = () => {
    onSave()
  }

  const isValid = selectedTime && selectedDate

  const isClosedDay = (date: Date, whs: any[], excs: any[]) => {
    const dayOfWeek = date.getDay()
    const isWorking = whs.some((wh) => wh.dayOfWeek === dayOfWeek)

    const activeException = excs.find((ex) => {
      const start = new Date(ex.startDate)
      const end = new Date(ex.endDate)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      return ex.daysOfWeek.includes(dayOfWeek) && date >= start && date <= end
    })

    if (activeException) return activeException.isClosed

    return !isWorking
  }

  const activeDate = selectedDate || new Date()
  const isTodayActive = activeDate.toDateString() === new Date().toDateString()
  let nextAv = nextAvailableDate ? new Date(nextAvailableDate) : null
  if (nextAv) nextAv.setHours(0, 0, 0, 0)

  return (
    <div className="flex flex-col h-full relative">
      <div className="px-3 py-4 lg:p-8 shrink-0 bg-white/80 dark:bg-mist-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Heading
              as="h3"
              className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white"
            >
              Establece el Horario
            </Heading>
            <Paragraph className="mt-2 text-lg text-mist-500">
              Disponibilidad para {staff?.displayName?.split(" ")[0]}
            </Paragraph>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 lg:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* DATE ROW */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xl font-medium text-mist-900 dark:text-white">
              Fecha
            </h3>
          </div>
          <div className="flex gap-2 overflow-x-auto mb-8 snap-x no-scrollbar shrink-0">
            {nextDays.map((date, i) => {
              const isToday = i === 0
              const isSelected =
                activeDate.toDateString() === date.toDateString()
              const dayName = formatDayName(date)
              const dayNumber = date.getDate()

              const isClosed = isClosedDay(date, workingHours, exceptions)
              let dateCopy = new Date(date)
              dateCopy.setHours(0, 0, 0, 0)

              const isAgotado =
                !isClosed && nextAv && dateCopy.getTime() < nextAv.getTime()
              const isDisponible = !isClosed && !isAgotado
              const isDisabled = isClosed || isAgotado

              return (
                <button
                  key={i}
                  disabled={isDisabled}
                  title={
                    isClosed
                      ? "Cerrado"
                      : isAgotado
                        ? "Agotado - Sin lugares"
                        : ""
                  }
                  onClick={() => {
                    setSelectedDate(date)
                    setSelectedTime(null)
                  }}
                  className={cn(
                    "snap-center shrink-0 w-16 h-20 flex flex-col items-center justify-center rounded-xl transition-all duration-300 border relative",
                    isClosed &&
                      "opacity-50 cursor-not-allowed bg-mist-50 dark:bg-mist-900/20 border-mist-100 dark:border-mist-800/50",
                    isAgotado &&
                      "opacity-50 cursor-not-allowed bg-mist-50 dark:bg-mist-900/40 border-mist-200 dark:border-mist-800",
                    isDisponible &&
                      isSelected &&
                      "bg-mist-900 dark:bg-mist-100 border-mist-900 dark:border-mist-100 text-white dark:text-mist-900 shadow-sm hover:opacity-90",
                    isDisponible &&
                      !isSelected &&
                      "bg-white dark:bg-transparent border-mist-200 dark:border-mist-800 hover:bg-mist-100 dark:hover:bg-mist-900/40 text-mist-700 dark:text-mist-300",
                  )}
                >
                  {isToday && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-bold uppercase mb-0.5",
                      isSelected &&
                        isDisponible &&
                        "text-mist-200 dark:text-mist-600",
                      isDisabled && "text-mist-400",
                      isDisponible && !isSelected && "text-mist-500",
                    )}
                  >
                    {dayName}
                  </span>
                  <span
                    className={cn(
                      "text-xl font-bold relative",
                      isSelected &&
                        isDisponible &&
                        "text-white dark:text-mist-900",
                      isDisabled && "text-mist-400",
                      isDisponible &&
                        !isSelected &&
                        "text-mist-900 dark:text-white",
                    )}
                  >
                    {isAgotado && (
                      <span className="absolute top-1/2 left-0 w-full h-[2px] bg-mist-300 dark:bg-mist-700 transform -translate-y-1/2 rotate-15"></span>
                    )}
                    {dayNumber}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="h-4" />
        </section>

        {/* TIME SLOTS GRID */}
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
                    onClick={() => setSelectedTime(slot)}
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
                No hay horarios disponibles para {staff?.displayName} este día.
              </p>
              {nextAvailableDate &&
                new Date(nextAvailableDate).toDateString() !==
                  activeDate.toDateString() && (
                  <Button
                    className="button-primary mt-4"
                    onClick={() => {
                      setSelectedDate(new Date(nextAvailableDate))
                      setSelectedTime(null)
                    }}
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
      </div>

      <div className="p-6 shrink-0 border-t border-mist-200 dark:border-mist-800 bg-white dark:bg-mist-950 sticky bottom-0 z-20 flex justify-between items-center">
        <Button onClick={onBack} className="button-tertiary">
          Volver atrás
        </Button>
        <Button
          className="button-primary"
          disabled={!isValid || isSubmitting}
          onClick={handleSave}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" className="mr-1" />
              {mode === "reschedule" ? "Reagendando..." : "Agendando..."}
            </div>
          ) : isValid ? (
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
    </div>
  )
}
