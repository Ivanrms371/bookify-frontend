import { useEffect, useState, useMemo } from "react"
import type { EventInput } from "@fullcalendar/core"
import { endOfWeek, startOfWeek } from "date-fns"
import { useTenant } from "@/shared/context/tenant.context"
import { useDarkModeStore } from "@/shared/store/useDarkModeStore"
import { useStaffs } from "@/modules/staff/hooks/useStaffs"
import { useCalendarAppointments } from "@/modules/appointments/hooks/useCalendarAppointments"
import { mapAppointmentsToEvents } from "../utils/calendar.mapper"

export const useCalendar = () => {
  const { tenantId } = useTenant()
  const { isDark } = useDarkModeStore()
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date()

    return {
      startDate: startOfWeek(now, { weekStartsOn: 1 }).toISOString(),
      endDate: endOfWeek(now, { weekStartsOn: 1 }).toISOString(),
    }
  })
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const { data: staffList } = useStaffs()

  const { data: appointments, isLoading } = useCalendarAppointments({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    ...(selectedStaff && { staffId: selectedStaff }),
  })

  const events = useMemo(() => {
    return mapAppointmentsToEvents(appointments ?? [], isDark)
  }, [appointments, isDark])

  const handleDatesSet = (arg: any) => {
    const newStart = arg.start.toISOString()
    const newEnd = arg.end.toISOString()

    setTimeout(() => {
      setDateRange((prev) => {
        if (prev.startDate !== newStart || prev.endDate !== newEnd) {
          return { startDate: newStart, endDate: newEnd }
        }
        return prev
      })
    }, 0)
  }



  useEffect(() => {
    staffList?.length === 1 && setSelectedStaff(staffList[0].id)
  }, [staffList])

  useEffect(() => {
    document.title = "Calendario - Bookify"
  }, [])

  return {
    staffList: staffList ?? [],
    events,
    isLoading,
    handleDatesSet,
    setSelectedStaff,
    selectedStaff,
    selectedEventId,
    setSelectedEventId,
  }
}
