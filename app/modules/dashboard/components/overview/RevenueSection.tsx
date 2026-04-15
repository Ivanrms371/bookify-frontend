import { useParams } from "react-router"
import { useDailyRevenue } from "../../hooks/useDailyRevenue"
import { useDashboardOverview } from "../../hooks/useDashboardOverview"
import { RevenueChartSkeleton } from "@/shared/components/_ui/charts/RevenueChartSkeleton"
import { RevenueChart } from "@/shared/components/_ui/charts/RevenueChart"

export const RevenueSection = () => {
  const { tenantId } = useParams<{ tenantId: string }>()

  const { data: chartData = [], isLoading: isChartLoading } = useDailyRevenue(tenantId)
  const { data: overviewData, isLoading: isOverviewLoading } = useDashboardOverview(tenantId)

  if (isChartLoading || isOverviewLoading) return <RevenueChartSkeleton />

  console.log(chartData)

  return (
    <RevenueChart 
      data={chartData} 
      totalMonth={overviewData?.totalRevenueMonth ?? 0}
      totalPreviousMonth={overviewData?.totalRevenuePreviousMonth ?? 0}
    />
  )
}
