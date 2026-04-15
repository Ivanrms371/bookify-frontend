import { cn } from "@/shared/lib/utils"
import type { QuotaUsage } from "@/modules/dashboard/types/dashboard.types"
import { METRICS } from "@/modules/dashboard/constants/metric"
import { getBarColor, getStatusColor } from "../../utils/status.util"

interface QuotaUsageCardsProps {
  quota: QuotaUsage
}

export function QuotaUsageCards({ quota }: QuotaUsageCardsProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {METRICS.map((metric) => {
        const data = quota[metric.key]
        const isUnlimited = data.limit === -1
        const Icon = metric.icon

        return (
          <div
            key={metric.key}
            className={cn(
              "relative group rounded-4xl p-5 transition-all duration-300 border",
              "bg-white border-transparent dark:bg-transparent",
              "dark:border dark:border-mist-900/70",
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "p-5 rounded-full bg-mist-100 dark:bg-mist-900/40 shadow-sm",
                )}
              >
                <Icon
                  className={cn("size-6 text-mist-500 dark:text-mist-400")}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-mist-700 dark:text-mist-300 truncate">
                  {metric.label}
                </p>
              </div>
            </div>

            {/* Numbers */}
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-2xl font-semibold font-mono text-mist-900 dark:text-mist-100 tabular-nums">
                {data.used.toLocaleString()}
              </span>
              <span className=" text-mist-500 dark:text-mist-400">
                / {isUnlimited ? "∞" : data.limit.toLocaleString()}
              </span>
            </div>

            <div className="relative h-1.5 rounded-full bg-mist-100 dark:bg-mist-800 overflow-hidden">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
                  getBarColor(data.percentage),
                )}
                style={{
                  width: isUnlimited ? "0%" : `${data.percentage}%`,
                }}
              />
            </div>

            {/* Percentage label */}
            <div className="mt-2 flex justify-end">
              <span
                className={cn(
                  "text-sm font-medium tabular-nums",
                  isUnlimited
                    ? "text-mist-400 dark:text-mist-500"
                    : getStatusColor(data.percentage),
                )}
              >
                {isUnlimited ? "Sin límite" : `${data.percentage}%`}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
