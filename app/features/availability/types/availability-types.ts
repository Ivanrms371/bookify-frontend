export interface GetAvailabilityProfessionalParams {
  serviceId: string | null;
  date: string | null;
}

export interface GetAvailabilityProfessionalResponse {
  slots: string[];
  nextAvailableDate?: string;
  date: string;
}

export type AppointmentAvailabilitySlotStatus = 'available' | 'busy' | 'past';

export interface AppointmentAvailabilitySlot {
  time: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentAvailabilitySlotStatus;
}

export interface AppointmentAvailabilityDay {
  date: string;
  hasAvailability: boolean;
  reason: string;
  message?: string;
  slots: AppointmentAvailabilitySlot[];
}

export interface GetAppointmentAvailabilityParams {
  serviceId: string | null;
  professionalId: string | null;
  startDate: string;
  endDate?: string;
}

export interface GetAppointmentAvailabilityResponse {
  timeZone: string;
  days: AppointmentAvailabilityDay[];
}
