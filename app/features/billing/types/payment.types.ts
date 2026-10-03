export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export interface BillingPayment {
  id: string;
  referenceCode: string;
  date: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  invoiceAvailable: boolean;
}

export interface PaymentHistory {
  items: BillingPayment[];
  meta: { page: number; pageSize: number; total: number };
}

export interface PaymentPagination {
  page: number;
  pageSize: number;
}
