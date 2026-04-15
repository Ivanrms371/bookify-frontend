import type { StaffPerformance } from "../../types/reports.type"
import { formatRevenue } from "@/shared/lib/utils"

interface StaffRankingTableProps {
  data?: StaffPerformance[]
  isLoading?: boolean
}

export const StaffRankingTable = ({ data, isLoading }: StaffRankingTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-12 bg-muted/10 rounded-lg w-full" />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-border/50">
        <p className="text-sm">No hay datos de personal para este periodo.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-border/50 transition-colors bg-muted/5">
              <th className="h-10 px-4 text-left align-middle font-semibold text-muted-foreground">Personal</th>
              <th className="h-10 px-4 text-right align-middle font-semibold text-muted-foreground">Comisión (%)</th>
              <th className="h-10 px-4 text-right align-middle font-semibold text-muted-foreground">Ingresos</th>
              <th className="h-10 px-4 text-right align-middle font-semibold text-muted-foreground">Comisión Total</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.map((staff) => (
              <tr 
                key={staff.staffId} 
                className="border-b border-border/30 hover:bg-muted/5 transition-colors"
                id={`staff-row-${staff.staffId}`}
              >
                <td className="p-4 align-middle">
                  <span className="font-medium text-foreground">{staff.name}</span>
                </td>
                <td className="p-4 align-middle text-right">
                  <span className="text-muted-foreground">{staff.commissionPercent}%</span>
                </td>
                <td className="p-4 align-middle text-right">
                  <span className="font-medium text-foreground">{formatRevenue(staff.generatedRevenue)}</span>
                </td>
                <td className="p-4 align-middle text-right">
                  <span className="font-medium text-primary">{formatRevenue(staff.amountToPay)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}