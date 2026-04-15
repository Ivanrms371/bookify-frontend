import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import { useEffect, useState } from "react"
import { useAppointmentForm } from "../../../../context/appointment-form.context"
import { DateSelector } from "./DateSelector"
import { TimeSlotsGrid } from "./TimeSlotsGrid"
import { ScheduleFooter } from "./ScheduleFooter"

const getNextDays = (startDate: Date, daysToShow = 30): Date[] => {
  const result: Date[] = []
  let date = new Date(startDate)
  for (let i = 0; i < daysToShow; i++) {
    result.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return result
}

export const ScheduleSelectionStep = () => {
  const {
    mode,
    staff,
    onBack,
    save,
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

  const [nextDays, setNextDays] = useState<Date[]>([])

  useEffect(() => {
    setNextDays(getNextDays(new Date(), maxAdvancedDays))
  }, [maxAdvancedDays])

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date())
    }
  }, [selectedDate, setSelectedDate])

  const isValid = !!(selectedTime && selectedDate)

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
        <DateSelector
          dates={nextDays}
          activeDate={selectedDate || new Date()}
          onSelect={(date) => {
            setSelectedDate(date)
            setSelectedTime(null)
          }}
          workingHours={workingHours}
          exceptions={exceptions}
          nextAvailableDate={nextAvailableDate}
        />

        <TimeSlotsGrid
          slots={slots}
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
          isFetchingSlots={isFetchingSlots}
          staffName={staff?.displayName}
          nextAvailableDate={nextAvailableDate}
          activeDate={selectedDate || new Date()}
          onNextAvailableDateClick={(date) => {
            setSelectedDate(date)
            setSelectedTime(null)
          }}
        />
      </div>

      <ScheduleFooter
        onBack={onBack}
        onSave={save}
        isSubmitting={isSubmitting}
        isValid={isValid}
        mode={mode}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  )
}
