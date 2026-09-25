export type AppointmentStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface AppointmentProfessional {
  id: string;
  avatarUrl: string | null;
  name: string | null;
  colorTheme: string | null;
}

export interface UpcomingAppointment {
  id: string;
  status: AppointmentStatus;
  startsAt: string;
  endsAt: string;
  customerName: string;
  confirmationCode: string;
  durationMinutes: number;
  professional: AppointmentProfessional;
  service?: {
    name: string;
    price: number;
  };
}
