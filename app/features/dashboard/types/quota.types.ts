export interface QuotaItem {
  count: number;
  limit: number;
  percentage: number;
}

export interface DashboardQuota {
  emails: QuotaItem;
  whatsapp: QuotaItem;
  appointments: QuotaItem;
  professionals: QuotaItem;
}
