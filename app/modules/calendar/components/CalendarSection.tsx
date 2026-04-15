import { StaffFilter } from "./StaffFilter"
import { Calendar } from "./Calendar"
import { useCalendar } from "../hooks/useCalendar"

export const CalendarSection = () => {
  const { staffList, events, selectedStaff, setSelectedStaff, handleDatesSet, isLoading } = useCalendar()

  return (
    <div className="flex flex-col gap-5">
      <StaffFilter
        staffList={staffList}
        selectedStaff={selectedStaff}
        setSelectedStaff={setSelectedStaff}
      />
      {isLoading && <span className="text-xs text-mist-400 animate-pulse ml-2">Cargando eventos...</span>}
      <Calendar events={events} handleDatesSet={handleDatesSet} />
    </div>
  )
}
