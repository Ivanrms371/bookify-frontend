import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"

export const calendarPlugins = [
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
]

export const calendarConfig = {
  initialView: "timeGridWeek",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "timeGridWeek,timeGridDay,listWeek",
  },
  buttonText: {
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    list: "Lista",
  },
  slotMinTime: "08:00:00",
  slotMaxTime: "20:00:00",
  slotDuration: "00:45:00",

  locale: "es",
  firstDay: 1,
  allDaySlot: false,
  nowIndicator: true,
  selectable: true,
  editable: true,
  slotEventOverlap: true,
  eventMaxStack: 3,
  contentHeight: 650,
}
