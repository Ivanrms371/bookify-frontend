import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useDailyRevenue } from "@/modules/dashboard/hooks/useDailyRevenue";
import { useDashboardOverview } from "@/modules/dashboard/hooks/useDashboardOverview";
import {
  UpcomingAppointments,
  type UpcomingAppointment,
} from "@/shared/components/_ui/appointments/UpcomingAppointments";
import { UpcomingAppointmentsTable } from "@/shared/components/_ui/appointments/UpcomingAppointmentsTable";
import { RevenueChart } from "@/shared/components/_ui/charts/RevenueChart";
import { RevenueChartSkeleton } from "@/shared/components/_ui/charts/RevenueChartSkeleton";
import {
  QuotaUsageCards,
  QuotaUsageSkeleton,
} from "@/shared/components/_ui/quota/QuotaUsageCards";
import { StatsCard } from "@/shared/components/_ui/stats/StatsCard";
import { StatsSkeletonCard } from "@/shared/components/_ui/stats/StatsSkeletonCard";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { CalendarIcon } from "lucide-react";
import { useParams } from "react-router";
import { useQuotaUsage } from "@/modules/dashboard/hooks/useQuotaUsage";
import { useEffect } from "react";

function formatRevenue(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return "$0";

  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1).replace(".0", "").replace(".", ",")}M`;
  }

  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(1).replace(".0", "").replace(".", ",")}K`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

// TODO: Replace with real data from backend
const MOCK_APPOINTMENTS: UpcomingAppointment[] = [
  {
    id: "1",
    startTime: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    customerName: "María González",
    customerPhone: "+598 99 123 456",
    staffName: "Carlos R.",
    confirmationCode: "A1B2C3",
    durationMinutes: 45,
    total: 1200,
  },
  {
    id: "2",
    startTime: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    customerName: "Juan Pérez",
    customerPhone: "+598 99 654 321",
    staffName: "Ana M.",
    confirmationCode: "D4E5F6",
    durationMinutes: 30,
    total: 800,
  },
  {
    id: "3",
    startTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    customerName: "Lucía Fernández",
    customerPhone: "+598 99 111 222",
    staffName: "Carlos R.",
    confirmationCode: "G7H8I9",
    durationMinutes: 60,
    total: 1500,
  },
  {
    id: "4",
    startTime: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
    customerName: "Santiago Martínez",
    customerPhone: "+598 99 333 444",
    staffName: "Ana M.",
    confirmationCode: "J1K2L3",
    durationMinutes: 90,
    total: 2200,
  },
  {
    id: "5",
    startTime: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    customerName: "Valentina López",
    customerPhone: "+598 99 555 666",
    staffName: "Carlos R.",
    confirmationCode: "M4N5O6",
    durationMinutes: 45,
    total: 950,
  },
  {
    id: "6",
    startTime: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    customerName: "Martín Rodríguez",
    customerPhone: "+598 99 777 888",
    staffName: "Ana M.",
    confirmationCode: "P7Q8R9",
    durationMinutes: 30,
    total: 700,
  },
  {
    id: "7",
    startTime: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    customerName: "Martín Rodríguez",
    customerPhone: "+598 99 777 888",
    staffName: "Ana M.",
    confirmationCode: "P7Q8R9",
    durationMinutes: 30,
    total: 700,
  },
  {
    id: "8",
    startTime: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    customerName: "Martín Rodríguez",
    customerPhone: "+598 99 777 888",
    staffName: "Ana M.",
    confirmationCode: "P7Q8R9",
    durationMinutes: 30,
    total: 700,
  },
  {
    id: "9",
    startTime: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    customerName: "Martín Rodríguez",
    customerPhone: "+598 99 777 888",
    staffName: "Ana M.",
    confirmationCode: "P7Q8R9",
    durationMinutes: 30,
    total: 700,
  },
  {
    id: "10",
    startTime: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    customerName: "Martín Rodríguez",
    customerPhone: "+598 99 777 888",
    staffName: "Ana M.",
    confirmationCode: "P7Q8R9",
    durationMinutes: 30,
    total: 700,
  },
];

export default function DashboardPage() {
  const { session } = useAuth();
  const { businessId } = useParams<{ businessId: string }>();
  const { data: overview, isLoading } = useDashboardOverview(businessId);
  const { data: revenueData, isLoading: isLoadingChart } =
    useDailyRevenue(businessId);
  const { data: quotaData, isLoading: isLoadingQuota } =
    useQuotaUsage(businessId);

  useEffect(() => {
    document.title = `Dashboard - ${session?.businesses[0].name}`;
  }, [session]);

  const firstName = session?.name?.split(" ")[0];

  return (
    <>
      <h1 className="text-2xl font-bold text-mist-800 dark:text-mist-200">
        Hola {firstName} 👋
      </h1>

      <p className="text-mist-500 dark:text-mist-400 mb-4 font-medium">
        Aquí tienes un resumen de tu negocio.
      </p>

      <div className="grid grid-cols-12 mt-6 gap-4">
        {isLoading ? (
          <>
            <StatsSkeletonCard />
            <StatsSkeletonCard />
            <StatsSkeletonCard />
            <StatsSkeletonCard />
          </>
        ) : (
          <>
            <StatsCard
              title="Ganancias totales del mes"
              value={formatRevenue(overview?.totalRevenueMonth ?? 0)}
              color="green"
              icon={BanknotesIcon}
            />
            <StatsCard
              title="Turnos hoy"
              value={String(overview?.appointmentsToday ?? 0)}
              color="blue"
              icon={CalendarIcon}
            />
            <StatsCard
              title="Clientes nuevos"
              value={String(overview?.newCustomersMonth ?? 0)}
              color="blue"
              icon={UserPlusIcon}
            />
            <StatsCard
              title="Clientes totales"
              value={String(overview?.totalCustomersLifetime ?? 0)}
              color="blue"
              icon={UsersIcon}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-12 mt-4 gap-4">
        {isLoadingChart ? (
          <RevenueChartSkeleton />
        ) : (
          <RevenueChart data={revenueData ?? []} />
        )}

        <UpcomingAppointmentsTable appointments={MOCK_APPOINTMENTS} />
      </div>

      {/**Aqui */}
      <div className="grid grid-cols-12 mt-4 gap-4">
        {isLoadingQuota ? (
          <QuotaUsageSkeleton />
        ) : quotaData ? (
          <QuotaUsageCards quota={quotaData} />
        ) : null}
      </div>
    </>
  );
}
