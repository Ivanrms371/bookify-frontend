import { useParams } from "react-router"
import {
  BanknotesIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline"
import { useDashboardOverview } from "../../hooks/useDashboardOverview"
import { StatsCard } from "@/shared/components/_ui/stats/StatsCard"
import { formatRevenue } from "@/shared/lib/utils"
import { StatsSkeleton } from "./StatsSkeleton"

export const DashboardStats = () => {
  const { tenantId } = useParams<{ tenantId: string }>()
  const { data, isLoading } = useDashboardOverview(tenantId)

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 mt-6 gap-4">
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <>
          <StatsCard
            title="Ganancias totales del mes"
            value={formatRevenue(data?.totalRevenueMonth ?? 0)}
            color="green"
            icon={BanknotesIcon}
          />
          <StatsCard
            title="Turnos hoy"
            value={String(data?.appointmentsToday ?? 0)}
            color="blue"
            icon={CalendarDaysIcon}
          />
          <StatsCard
            title="Clientes nuevos"
            value={String(data?.newCustomersMonth ?? 0)}
            color="blue"
            icon={UserPlusIcon}
          />
          <StatsCard
            title="Clientes totales"
            value={String(data?.totalCustomersLifetime ?? 0)}
            color="blue"
            icon={UsersIcon}
          />
        </>
      )}
    </div>
  )
}
