import { cn } from "@/shared/lib/utils"

interface DateSelectorProps {
  dates: Date[]
  activeDate: Date
  onSelect: (date: Date) => void
  workingHours: any[]
  exceptions: any[]
  nextAvailableDate?: string
}

export const DateSelector = ({
  dates,
  activeDate,
  onSelect,
  workingHours,
  exceptions,
  nextAvailableDate,
}: DateSelectorProps) => {
  const formatDayName = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", { weekday: "short" })
      .format(date)
      .replace(".", "")
  }

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

  let nextAv = nextAvailableDate ? new Date(nextAvailableDate) : null
  if (nextAv) nextAv.setHours(0, 0, 0, 0)

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-medium text-mist-900 dark:text-white">
          Fecha
        </h3>
      </div>
      <div className="flex gap-2 overflow-x-auto mb-8 snap-x no-scrollbar shrink-0">
        {dates.map((date, i) => {
          const isToday = i === 0
          const isSelected = activeDate.toDateString() === date.toDateString()
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
              onClick={() => onSelect(date)}
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
                  isSelected && isDisponible && "text-mist-200 dark:text-mist-600",
                  isDisabled && "text-mist-400",
                  isDisponible && !isSelected && "text-mist-500",
                )}
              >
                {dayName}
              </span>
              <span
                className={cn(
                  "text-xl font-bold relative",
                  isSelected && isDisponible && "text-white dark:text-mist-900",
                  isDisabled && "text-mist-400",
                  isDisponible && !isSelected && "text-mist-900 dark:text-white",
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
  )
}
