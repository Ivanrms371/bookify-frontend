import { StatsGrid } from './StatsGrid';
import { RevenueChart } from './RevenueChart';
import { DashboardProvider } from '../context/DashboardContext';
import { UpcomingAppointments } from './UpcomingAppointments';

export const DashboardOverview = () => {
  return (
    <DashboardProvider>
      <div className="flex min-h-0 flex-1 flex-col gap-2 sm:gap-4 pb-2.5">
        <StatsGrid />

        <div className="grid min-h-0 flex-1 grid-cols-12 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-2 sm:gap-4 lg:grid-rows-1">
          <div className="col-span-full flex min-h-0 h-full lg:col-span-7">
            <RevenueChart />
          </div>
          <div className="col-span-full flex min-h-0 h-full lg:col-span-5">
            <UpcomingAppointments />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};
