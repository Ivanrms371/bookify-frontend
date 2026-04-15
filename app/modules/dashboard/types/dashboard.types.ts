export interface DashboardOverview {
  totalRevenueMonth: number | string;
  totalRevenuePreviousMonth: number | string;
  appointmentsToday: number;
  newCustomersMonth: number;
  totalCustomersLifetime: number;
  totalAppointments: number;
  totalConfirmed: number;
  totalCancelled: number;
  totalCompleted: number;
  totalNoShow: number;
  totalCustomers: number;
}

export interface UpcomingAppointment {
  id: string;
  startTime: string; // ISO string
  customerName: string;
  customerPhone: string;
  staffName: string;
  confirmationCode: string;
  durationMinutes: number;
  total: number;
}

export interface UpcomingDashboardResponse {
  todayCount: number;
  appointments: UpcomingAppointment[];
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface QuotaMetric {
  used: number;
  limit: number;
  percentage: number;
}

export interface QuotaUsage {
  email: QuotaMetric;
  whatsapp: QuotaMetric;
  appointment: QuotaMetric;
  professional: QuotaMetric;
  periodMonth: number;
  periodYear: number;
}
