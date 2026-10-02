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

export type GetCustomerByIdResponse = Customer;

export type CustomerSearchItem = Pick<Customer, 'id' | 'name' | 'phoneNumber' | 'email'>;
export type GetCustomersSearchResponse = CustomerSearchItem[];
