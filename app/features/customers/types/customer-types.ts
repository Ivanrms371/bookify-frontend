export type Customer = {
  id: string;
  name: string;
  phoneNumber: string;
  phoneCountryCode: string;
  email: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  firstAppointmentAt: string | null;
  lastAppointmentAt: string | null;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  totalSpent: number;
};

export type CustomerBasic = {
  id: string;
  name: string;
  phoneNumber: string;
  phoneCountryCode: string;
  email: string | null;
  notes: string | null;
  firstAppointmentAt: string | null;
  lastAppointmentAt: string | null;
  totalSpent: string;
  lastVisitAt: string | null;
  nextAppointmentAt: string | null;
  blockedAt: string | null;
};

export type GetAllCustomersResponse = {
  data: CustomerBasic[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
};

export interface GetAllCustomersParams {
  query?: string;
  status?: 'all' | 'unblocked' | 'blocked';
  bookingActivity?: 'all' | 'upcoming' | 'never-booked';
  orderBy?: 'name' | 'createdAt' | 'lastVisitAt' | 'totalSpent';
  order?: 'asc' | 'desc';
  skip?: number;
  take?: number;
}

// The ID endpoint returns the persisted customer, or null when unavailable.
export type CustomerDetail = Omit<Customer, 'email' | 'noShowAppointments' | 'totalSpent'> & {
  email: string | null;
  noShowCount: number;
  totalSpent: string;
  blockedAt: string | null;
  blockedReason: string | null;
};
export type GetCustomerByIdResponse = CustomerDetail | null;

export type CustomerSearchItem = Pick<Customer, 'id' | 'name' | 'phoneNumber' | 'email'>;
export type GetCustomersSearchResponse = CustomerSearchItem[];
