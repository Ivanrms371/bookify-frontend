import type Decimal from 'decimal.js';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export type DiscountType = 'FIXED' | 'PERCENTAGE';

export type GetAllAppointmentsParams = {
  query?: string;
  orderBy?: 'startsAt' | 'createdAt';
  state?: AppointmentStatus;
  order?: 'asc' | 'desc';
  skip?: number;
  take?: number;
  professionalId?: string;
  date?: string;
};

export type GetAllAppointmentsResponse = {
  data: Appointment[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
};

export type Appointment = {
  id: string;
  serviceId: string;
  customerId: string;
  professionalId: string;
  status: AppointmentStatus;
  timeZone?: string | null;
  formattedStartsAt?: { date: string; time: string } | null;
  startsAt: string;
  endsAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  notes?: string | null;
  internalNotes?: string | null;
  confirmationCode: string | null;
  price: Decimal;
  discountType?: DiscountType | null;
  discountAmount?: Decimal | null;
  durationMinutes: number;
  professionalName: string | null;
  professionalEmail?: string | null;
  professionalPhone?: string | null;
  professionalPhoneCountryCode?: string | null;
  professionalAvatar: string | null;
  professionalBio: string | null;
  serviceName: string | null;
  serviceDuration: number | null;
  servicePrice: Decimal | null;
};

export type UpdateAppointmentInput = {
  customerId: string;
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
};
