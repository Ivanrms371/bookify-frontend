export interface CalendarAppointment {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  customerName: string;
  confirmationCode: string;
  staff: {
    id: string;
    displayName: string;
    colorTheme: string | null;
    avatarUrl: string | null;
  } | null;
}

export interface GetAppointmentsParams {
  startDate: string;
  endDate: string;
  status?: string;
  staffId?: string;
}

export interface AppointmentDetail {
  id: string
  status: string
  startTime: string
  endTime: string
  durationMinutes: number
  customerName: string
  customerPhone: string
  customerEmail: string | null
  confirmationCode: string
  notes: string | null
  price: number
  staff: {
    id: string
    displayName: string
    colorTheme: string | null
    avatarUrl: string | null
  } | null
  service: {
    name: string
    price: number
    durationMinutes: number
  } | null
  customer: {
    totalAppointments: number
    completedAppointments: number
    cancelledAppointments: number
    noShowCount: number
  } | null
}
