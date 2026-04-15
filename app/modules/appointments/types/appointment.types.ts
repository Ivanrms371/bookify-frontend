export interface GetAppointmentsParams {
  query?: string
  status?: string
  startDate?: string
  endDate?: string
  staffId?: string
  customerId?: string
  skip?: number
  take?: number
  orderBy?: "name" | "startTime" | "createdAt"
  order?: "asc" | "desc"
}

export interface Appointment {
  id: string
  startTime: string
  endTime: string
  durationMinutes: number
  customerName: string
  confirmationCode: string
  status: string
  staff: {
    id: string
    displayName: string
    colorTheme: string | null
    avatarUrl: string | null
  } | null
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
