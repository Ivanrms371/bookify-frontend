import { createContext, type ReactNode } from 'react';
import { useDashboardOverview } from '../hooks/useDashboardOverview';
import type { DashboardOverviewResponse } from '../types/dashboard.types';

interface DashboardContextProps {
  data: DashboardOverviewResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError, refetch } = useDashboardOverview();

  return <DashboardContext.Provider value={{ data, isLoading, isError, refetch }}>{children}</DashboardContext.Provider>;
};
