import { formatRevenue } from "@/shared/lib/utils"

export const CardHeader = () => {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-mist-500 dark:text-mist-400">
            Ganancias últimos 30 días
          </p>
          <p className="text-2xl font-mono font-semibold text-mist-800 dark:text-mist-100 mt-1">
            {formatRevenue(totalRevenue)}
          </p>
        </div>
      </div>
        </div>
    )
}