export interface Customer {
  id: string
  tenantId: string
  name: string
  email: string
  phone: string
  phoneCountryCode: string
  address?: string | null
  city?: string | null
  notes?: string | null
  firstAppointmentAt?: string | null
  lastAppointmentAt?: string | null
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  noShowCount: number
  totalSpent: number
  blockedAt?: string | null
  createdAt: string
  updatedAt: string
}
