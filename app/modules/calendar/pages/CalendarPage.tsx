import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import "../styles/calendar.css";
import { Button } from "@/shared/components/form/Button";

// ─── Mock staff ──────────────────────────────────────────────────────
const STAFF = [
  {
    id: "s1",
    name: "Carlos R.",
    color: "#6366f1",
    lightBg: "#c7d2fe", // mist-200
    darkBg: "#312e81", // mist-950
  },
  {
    id: "s2",
    name: "Ana M.",
    color: "#8b5cf6",
    lightBg: "#ddd6fe", // purple-200
    darkBg: "#3b0764", // purple-950
  },
  {
    id: "s3",
    name: "Diego L.",
    color: "#3b82f6",
    lightBg: "#bfdbfe", // blue-200
    darkBg: "#172554", // blue-950
  },
  {
    id: "s4",
    name: "Sofía P.",
    color: "#14b8a6",
    lightBg: "#99f6e4", // teal-200
    darkBg: "#134e4a", // teal-950
  },
];

const SERVICES = [
  "Corte clásico",
  "Barba completa",
  "Corte + Barba",
  "Tinte",
  "Alisado",
  "Tratamiento capilar",
  "Mechas",
  "Lavado + Secado",
];

const CLIENTS = [
  "María González",
  "Juan Pérez",
  "Lucía Fernández",
  "Santiago Martínez",
  "Valentina López",
  "Martín Rodríguez",
  "Camila Torres",
  "Andrés Sánchez",
  "Isabella Ramírez",
  "Mateo Herrera",
  "Carolina Díaz",
  "Felipe Morales",
];

// ─── Types ──────────────────────────────────────────────────────────
interface AppointmentMeta {
  staffId: string;
  staffName: string;
  staffColor: string;
  service: string;
  client: string;
  duration: number;
  confirmed: boolean;
}

// ─── Generate mock events (non-overlapping per staff) ───────────────
function generateMockEvents(): (EventInput & {
  extendedProps: AppointmentMeta;
})[] {
  const events: (EventInput & { extendedProps: AppointmentMeta })[] = [];

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  let id = 1;

  for (let day = 0; day < 6; day++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + day);

    for (const [staffIdx, staff] of STAFF.entries()) {
      // Stagger each staff member's start time so they don't all overlap
      let cursor = 9 * 60 + staffIdx * 30;
      const endOfDay = 18 * 60;
      const count = 2 + Math.floor(Math.random() * 3); // 2-4 appointments

      for (let a = 0; a < count && cursor < endOfDay; a++) {
        // Random gap between appointments
        cursor += Math.floor(Math.random() * 3) * 30;
        if (cursor >= endOfDay) break;

        const duration = 30; // fixed 30min so events stay compact
        const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
        const client = CLIENTS[Math.floor(Math.random() * CLIENTS.length)];

        const start = new Date(date);
        start.setHours(Math.floor(cursor / 60), cursor % 60, 0, 0);

        const end = new Date(start);
        end.setMinutes(end.getMinutes() + duration);

        events.push({
          id: String(id++),
          title: `${client}`,
          start: start.toISOString(),
          end: end.toISOString(),
          extendedProps: {
            staffId: staff.id,
            staffName: staff.name,
            staffColor: staff.color,
            service,
            client,
            duration,
            confirmed: Math.random() > 0.2,
          },
        });

        cursor += duration;
      }
    }
  }

  return events;
}

// ─── Component ──────────────────────────────────────────────────────
export default function CalendarPage() {
  const [mockEvents] = useState(() => generateMockEvents());
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<
    (typeof mockEvents)[0] | null
  >(null);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  // Sync with document dark mode class
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const filteredEvents = useMemo(() => {
    const base = !selectedStaff
      ? mockEvents
      : mockEvents.filter((e) => e.extendedProps.staffId === selectedStaff);

    return base.map((e) => {
      const staff = STAFF.find((s) => s.id === e.extendedProps.staffId)!;
      const bgColor = isDarkMode ? staff.darkBg : staff.lightBg;
      return {
        ...e,
        backgroundColor: bgColor,
        borderColor: staff.color,
        textColor: isDarkMode ? "#f3f4f6" : "#374151",
        color: bgColor, // shorthand/fallback for some FC views
      };
    });
  }, [mockEvents, selectedStaff, isDarkMode]);

  const handleEventClick = (info: EventClickArg) => {
    const found = mockEvents.find((e) => e.id === info.event.id);
    setSelectedEvent(found ?? null);
  };

  useEffect(() => {
    document.title = "Calendario - Turnify";
  }, []);

  // Today string for filtering
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-mist-800 dark:text-mist-200">
            Calendario
          </h1>
          <p className="text-mist-500 dark:text-mist-400 font-medium mt-1">
            Gestiona las citas de tu equipo.
          </p>
        </div>
        <Button className="button-primary">+ Nueva cita</Button>
      </div>

      {/* ─── Staff filter ───────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedStaff(null)}
          className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all cursor-pointer ${
            selectedStaff === null
              ? "bg-mist-900 text-white dark:bg-mist-100 dark:text-mist-900"
              : "bg-white text-mist-600 hover:bg-mist-200 dark:bg-mist-900/80 dark:text-mist-400 dark:hover:bg-mist-800"
          }`}
        >
          Todos
        </button>
        {STAFF.map((s) => (
          <button
            key={s.id}
            onClick={() =>
              setSelectedStaff(selectedStaff === s.id ? null : s.id)
            }
            className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              selectedStaff === s.id
                ? "bg-mist-900 text-white dark:bg-mist-100 dark:text-mist-900"
                : "bg-white text-mist-600 hover:bg-mist-200 dark:bg-mist-900/80 dark:text-mist-400 dark:hover:bg-mist-800"
            }`}
          >
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.name}
          </button>
        ))}
      </div>

      {/* ─── Calendar + Detail panel ────────────────────────────── */}
      <div className="flex gap-5 relative">
        {/* Calendar */}
        <div className="flex-1 bg-white dark:bg-transparent dark:border dark:border-mist-900/70 rounded-4xl p-6 min-h-0">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
            ]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              list: "Lista",
            }}
            locale="es"
            firstDay={1}
            slotMinTime="08:00:00"
            slotMaxTime="21:00:00"
            slotDuration="00:30:00"
            allDaySlot={false}
            nowIndicator={false}
            slotEventOverlap={false}
            eventMaxStack={2}
            dayMaxEvents={true}
            dayMaxEventRows={3}
            eventDisplay="block"
            height="auto"
            contentHeight={650}
            events={filteredEvents}
            eventClick={handleEventClick}
            eventContent={(arg) => {
              const meta = arg.event.extendedProps as AppointmentMeta;
              const isMonthView = arg.view.type === "dayGridMonth";

              return (
                <div
                  className="flex flex-col gap-0.5 overflow-hidden px-1 py-0.5 w-full"
                  style={{ color: arg.event.textColor }}
                >
                  <span className="font-semibold truncate text-xs leading-tight">
                    {meta.client}
                  </span>
                  {!isMonthView && (
                    <span className="truncate text-xs opacity-70 leading-tight">
                      {meta.service}
                    </span>
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* ─── Detail sidebar ─────────────────────────────────── */}
        <div className="w-80 shrink-0 flex flex-col gap-4 sticky top-24 h-fit">
          {/* Selected event detail */}
          <div className="bg-white dark:bg-transparent dark:border dark:border-mist-900/70 rounded-4xl p-6">
            <h3 className="text-sm font-semibold text-mist-500 dark:text-mist-400 uppercase tracking-wide mb-4">
              Detalle de cita
            </h3>
            {selectedEvent ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{
                      backgroundColor: selectedEvent.extendedProps.staffColor,
                    }}
                  >
                    {selectedEvent.extendedProps.client
                      .split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-mist-800 dark:text-mist-200">
                      {selectedEvent.extendedProps.client}
                    </p>
                    <p className="text-sm text-mist-500 dark:text-mist-400">
                      {selectedEvent.extendedProps.service}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-mist-100 dark:bg-mist-800" />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-mist-400 dark:text-mist-500">Hora</p>
                    <p className="font-medium text-mist-800 dark:text-mist-200">
                      {selectedEvent.start
                        ? new Date(
                            selectedEvent.start as string,
                          ).toLocaleTimeString("es", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-mist-400 dark:text-mist-500">Duración</p>
                    <p className="font-medium text-mist-800 dark:text-mist-200">
                      {selectedEvent.extendedProps.duration} min
                    </p>
                  </div>
                  <div>
                    <p className="text-mist-400 dark:text-mist-500">
                      Profesional
                    </p>
                    <p className="font-medium text-mist-800 dark:text-mist-200">
                      {selectedEvent.extendedProps.staffName}
                    </p>
                  </div>
                  <div>
                    <p className="text-mist-400 dark:text-mist-500">Estado</p>
                    <p
                      className={`font-medium ${
                        selectedEvent.extendedProps.confirmed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {selectedEvent.extendedProps.confirmed
                        ? "Confirmada"
                        : "Pendiente"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button className="button-secondary py-2 px-4 text-xs flex-1">
                    Reagendar
                  </button>
                  <button className="button-primary py-2 px-4 text-xs flex-1">
                    Completar
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="size-12 rounded-full bg-mist-100 dark:bg-mist-800 mx-auto mb-3 flex items-center justify-center">
                  <svg
                    className="size-6 text-mist-400 dark:text-mist-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                </div>
                <p className="text-sm text-mist-500 dark:text-mist-400">
                  Selecciona una cita para ver los detalles
                </p>
              </div>
            )}
          </div>

          {/* Staff summary */}
          <div className="bg-white dark:bg-transparent dark:border dark:border-mist-900/70 rounded-4xl p-6">
            <h3 className="text-sm font-semibold text-mist-500 dark:text-mist-400 uppercase tracking-wide mb-4">
              Equipo hoy
            </h3>
            <div className="flex flex-col gap-3">
              {STAFF.map((s) => {
                const staffEvents = mockEvents.filter(
                  (e) =>
                    e.extendedProps.staffId === s.id &&
                    (e.start as string).startsWith(todayStr),
                );
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="size-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: s.color }}
                      >
                        {s.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </div>
                      <span className="text-sm font-medium text-mist-700 dark:text-mist-300">
                        {s.name}
                      </span>
                    </div>
                    <span className="text-sm tabular-nums font-medium text-mist-400 dark:text-mist-500">
                      {staffEvents.length} citas
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white dark:bg-transparent dark:border dark:border-mist-900/70 rounded-4xl p-6">
            <h3 className="text-sm font-semibold text-mist-500 dark:text-mist-400 uppercase tracking-wide mb-4">
              Resumen semanal
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-semibold font-mono text-mist-900 dark:text-mist-100">
                  {mockEvents.length}
                </p>
                <p className="text-xs text-mist-400 dark:text-mist-500">
                  Total citas
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold font-mono text-mist-900 dark:text-mist-100">
                  {mockEvents.filter((e) => e.extendedProps.confirmed).length}
                </p>
                <p className="text-xs text-mist-400 dark:text-mist-500">
                  Confirmadas
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                  {Math.round(
                    (mockEvents.filter((e) => e.extendedProps.confirmed)
                      .length /
                      mockEvents.length) *
                      100,
                  )}
                  %
                </p>
                <p className="text-xs text-mist-400 dark:text-mist-500">
                  Tasa confirm.
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold font-mono text-mist-900 dark:text-mist-100">
                  {new Set(mockEvents.map((e) => e.extendedProps.staffId)).size}
                </p>
                <p className="text-xs text-mist-400 dark:text-mist-500">
                  Staff activo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
