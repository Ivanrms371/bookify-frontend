import * as React from "react"
import { subDays, format } from "date-fns"
import { useOwnerReports } from "../hooks/useOwnerReports"
import { useOwnerTopServices } from "../hooks/owner/useOwnerTopServices"
import { useOwnerCustomerInsights } from "../hooks/owner/useOwnerCustomerInsights"
import { useOwnerMyPerformance } from "../hooks/owner/useOwnerMyPerformance"
import { useOwnerMyRevenueChart } from "../hooks/owner/useOwnerRevenueCharts"
import { RevenueChart } from "@/shared/components/_ui/charts/RevenueChart"
import { RevenueChartSkeleton } from "@/shared/components/_ui/charts/RevenueChartSkeleton"
import { CustomerInsightsList } from "../components/tables/CustomerInsightsList"
import { StatsCard } from "@/shared/components/_ui/stats/StatsCard"
import { 
  TrophyIcon, 
  UsersIcon, 
  ChartBarIcon, 
  CalendarIcon 
} from "@heroicons/react/24/outline"
import { formatRevenue, cn } from "@/shared/lib/utils"
import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"

export const ReportsOwnerView = () => {
  const [filterType, setFilterType] = React.useState<"week" | "month">("month")
  
  const [dateRange, setDateRange] = React.useState(() => ({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  }))

  const handleFilterChange = (type: "week" | "month") => {
    setFilterType(type)
    if (type === "week") {
      setDateRange({
        startDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
        endDate: format(new Date(), "yyyy-MM-dd"),
      })
    } else {
      setDateRange({
        startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
        endDate: format(new Date(), "yyyy-MM-dd"),
      })
    }
  }

  // ── Query estabilizado + session ──
  const { query } = useOwnerReports({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  })

  // ── Cada hook se suscribe por separado: re-render aislado por sección ──
  const { data: topServicesData, isLoading: isTopServicesLoading } = useOwnerTopServices(query)
  const { topCustomers, worstCustomers, topCustomer, isLoading: isCustomerInsightsLoading } = useOwnerCustomerInsights(query)
  const { data: myPerformance, isLoading: isPerformanceLoading } = useOwnerMyPerformance(query)
  const { data: myRevenueChart, isLoading: isMyRevenueChartLoading } = useOwnerMyRevenueChart(query)

  const topServices = topServicesData ?? []
  const topService = topServices[0] ?? null

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 mt-2">
        <div>
          <Heading as="h1">
            Reportes
          </Heading>
          <Paragraph>
            Análisis detallado de tu desempeño y clientes.
          </Paragraph>
        </div>
        
        <div className="flex bg-mist-100 dark:bg-mist-800/50 p-1 rounded-xl">
          <button
            onClick={() => handleFilterChange("week")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
              filterType === "week"
                ? "bg-white dark:bg-mist-700 text-mist-900 dark:text-white shadow-sm"
                : "text-mist-500 hover:text-mist-700 dark:text-mist-400 dark:hover:text-mist-200"
            )}
          >
            Esta Semana
          </button>
          <button
            onClick={() => handleFilterChange("month")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
              filterType === "month"
                ? "bg-white dark:bg-mist-700 text-mist-900 dark:text-white shadow-sm"
                : "text-mist-500 hover:text-mist-700 dark:text-mist-400 dark:hover:text-mist-200"
            )}
          >
            Este Mes
          </button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Servicio top"
          value={topService?.serviceName || "---"}
          color="blue"
          icon={TrophyIcon}
        />
        <StatsCard
          title="Mejor Cliente"
          value={topCustomer?.customerName?.split(' ')[0] || "---"}
          color="blue"
          icon={UsersIcon}
        />
        <StatsCard
          title="Turnos Totales"
          value={String(myPerformance?.stats?.completedAppointments || 0)}
          color="blue"
          icon={ChartBarIcon}
        />
        <StatsCard
          title="Mis Ganancias"
          value={formatRevenue(myPerformance?.stats?.myCommission || 0)}
          color="green"
          icon={TrophyIcon}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Chart Card */}
        <div className="lg:col-span-2">
          {isMyRevenueChartLoading ? (
            <RevenueChartSkeleton />
          ) : (
            <RevenueChart 
              data={myRevenueChart ?? []} 
              totalMonth={myPerformance?.stats?.generatedRevenue || 0}
              totalPreviousMonth={0}
              title={filterType === "week" ? "Ingresos generados últimos 7 días" : "Ingresos generados últimos 30 días"}
            />
          )}
        </div>

        {/* Customer Insights Card */}
        <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-col gap-1 mb-6">
            <h3 className="text-xl font-bold text-foreground">Comportamiento</h3>
            <p className="text-sm text-muted-foreground font-medium">Ranking de fidelidad de tus clientes.</p>
          </div>
          <CustomerInsightsList 
            topCustomers={topCustomers} 
            worstCustomers={worstCustomers} 
            isLoading={isCustomerInsightsLoading} 
          />
        </div>

        {/* Top Services Table Card */}
        <div className="lg:col-span-3 bg-card border border-border/50 rounded-3xl p-8 shadow-sm transition-all hover:shadow-md overflow-hidden">
          <div className="flex flex-col gap-1 mb-8">
             <h3 className="text-xl font-bold text-foreground">Rendimiento por Servicio</h3>
             <p className="text-sm text-muted-foreground font-medium">Desglose de ingresos filtrado por tipo de servicio.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/30 bg-muted/5 transition-colors">
                  <th className="h-12 px-4 text-left align-middle font-bold text-muted-foreground text-xs uppercase tracking-wider">Servicio</th>
                  <th className="h-12 px-4 text-right align-middle font-bold text-muted-foreground text-xs uppercase tracking-wider">Cantidad</th>
                  <th className="h-12 px-4 text-right align-middle font-bold text-muted-foreground text-xs uppercase tracking-wider">Ingresos Totales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {isTopServicesLoading ? (
                  [1, 2, 3, 4].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4 h-14 bg-muted/5" />
                      <td className="p-4 h-14 bg-muted/5" />
                      <td className="p-4 h-14 bg-muted/5" />
                    </tr>
                  ))
                ) : topServices.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-12 text-center text-muted-foreground font-medium italic">No se encontraron datos para este rango de fechas.</td>
                  </tr>
                ) : (
                  topServices.map((service) => (
                    <tr key={service.serviceId} className="hover:bg-muted/10 transition-colors group">
                      <td className="p-4 align-middle font-bold text-foreground group-hover:text-primary transition-colors">{service.serviceName}</td>
                      <td className="p-4 align-middle text-right text-muted-foreground font-medium">{service.count} <span className="text-[10px] ml-1">servicios</span></td>
                      <td className="p-4 align-middle text-right font-bold text-foreground">{formatRevenue(service.revenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
