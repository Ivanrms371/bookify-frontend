import * as React from "react"
import type { CustomerReport } from "../../types/reports.type"
import { formatRevenue } from "@/shared/lib/utils"

interface CustomerInsightsListProps {
  topCustomers?: CustomerReport[]
  worstCustomers?: CustomerReport[]
  isLoading?: boolean
}

export const CustomerInsightsList = ({ topCustomers, worstCustomers, isLoading }: CustomerInsightsListProps) => {
  const [activeTab, setActiveTab] = React.useState<"top" | "worst">("top")

  const renderList = (customers?: CustomerReport[], emptyMessage = "No hay datos") => {
    if (isLoading) {
      return (
        <div className="space-y-4 pt-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <div className="h-10 w-10 rounded-full bg-muted/20" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-muted/20 rounded" />
                <div className="h-3 w-1/4 bg-muted/20 rounded" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (!customers || customers.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-border/50 mt-4">
          <p className="text-sm">{emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className="space-y-1 pt-4 divide-y divide-border/30">
        {customers.map((customer) => (
          <div key={customer.customerId} className="flex items-center justify-between py-3 px-1 hover:bg-muted/5 rounded-lg transition-colors group">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {customer.customerName.charAt(0).toUpperCase()}
              </div>
              <div className="grid gap-1">
                <p className="text-sm font-semibold leading-none">{customer.customerName}</p>
                <p className="text-[11px] text-muted-foreground font-medium">{customer.customerPhone}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{formatRevenue(customer.totalAmount)}</p>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{customer.appointmentsCount} turnos</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex p-1 bg-muted/20 rounded-xl gap-1">
        <button
          onClick={() => setActiveTab("top")}
          className={`
            flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all
            ${activeTab === "top" 
              ? "bg-background text-foreground shadow-sm ring-1 ring-border/50" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/10"}
          `}
          id="btn-tab-top"
        >
          Mejores clientes
        </button>
        <button
          onClick={() => setActiveTab("worst")}
          className={`
            flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all
            ${activeTab === "worst" 
              ? "bg-background text-foreground shadow-sm ring-1 ring-border/50" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/10"}
          `}
          id="btn-tab-worst"
        >
          Menos frecuentes
        </button>
      </div>

      <div className="mt-2 text-foreground">
        {activeTab === "top" ? (
          renderList(topCustomers, "No hay datos de clientes para este periodo.")
        ) : (
          renderList(worstCustomers, "No hay datos de clientes para este periodo.")
        )}
      </div>
    </div>
  )
}