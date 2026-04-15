
export interface ReportsQuery {
  startDate: string;
  endDate: string;
  limit?: number;
  staffId?: string;
}

export interface FinancialSummary {
  grossRevenue: number;
  totalCommissions: number;
  netRevenue: number;
}

export interface StaffPerformance {
  staffId: string;
  name: string;
  commissionPercent: number;
  generatedRevenue: number;
  amountToPay: number;
  isOwner: boolean;
}

export interface TopService {
  serviceId: string;
  serviceName: string;
  revenue: number;
  count: number;
}

export interface CustomerReport {
  customerId: string;
  customerName: string;
  customerPhone: string;
  appointmentsCount: number;
  totalAmount: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
}

export interface MyPerformance {
  staffId: string;
  displayName: string;
  period: {
    startDate: string;
    endDate: string;
  };
  stats: {
    completedAppointments: number;
    generatedRevenue: number;
    activeDays: number;
    myCommission: number;
    commissionPercent?: number;
  };
}
