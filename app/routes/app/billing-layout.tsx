import { Outlet } from 'react-router';
import { BillingShell } from '@/shared/components/layout/billing-shell';

export default function BillingLayout() {
  return <BillingShell><Outlet /></BillingShell>;
}
