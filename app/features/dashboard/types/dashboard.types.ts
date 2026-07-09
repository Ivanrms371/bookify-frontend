import type { DashboardChartEntry } from './chart.types';
import type { DashboardLifetime } from './lifetime.types';
import type { UpcomingAppointment } from './appointment.types';
import type { DashboardQuota } from './quota.types';

export interface DashboardStats {
  revenue: { current: number; trend: string };
  appointmentsToday: { current: number; trend: string };
  newCustomers: { current: number; trend: string };
  totalCustomers: { current: number };
}

export interface DashboardOverviewResponse {
  chart: DashboardChartEntry[];
  lifetime: DashboardLifetime;
  monthStats: DashboardChartEntry[];
  upcomingAppointments: UpcomingAppointment[];
  quota: DashboardQuota;
  stats: DashboardStats;
}

export type { DashboardChartEntry } from './chart.types';
export type { DashboardLifetime } from './lifetime.types';
export type { UpcomingAppointment, AppointmentEmployee, AppointmentStatus } from './appointment.types';
export type { DashboardQuota, QuotaItem } from './quota.types';
