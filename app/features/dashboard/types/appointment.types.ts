export type AppointmentStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface AppointmentEmployee {
  id: string;
  avatarUrl: string | null;
  displayName: string;
  colorTheme: string | null;
}

export interface UpcomingAppointment {
  id: string;
  status: AppointmentStatus;
  startTime: string;
  endTime: string;
  customerName: string;
  confirmationCode: string;
  durationMinutes: number;
  employee: AppointmentEmployee;
  service?: {
    name: string;
    price: number;
  };
}
