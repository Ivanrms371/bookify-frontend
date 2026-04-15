import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import type { RevenueChartData } from "../../types/reports.type"
import { formatRevenue } from "@/shared/lib/utils"

interface RevenueLineChartProps {
  data?: RevenueChartData[]
  isLoading?: boolean
}

export const RevenueLineChart = ({ data, isLoading }: RevenueLineChartProps) => {
  if (isLoading) {
    return (
      <div className="h-[350px] w-full animate-pulse bg-muted/20 rounded-xl" />
    )
  }

  // Ensure data exists and is sorted by date
  const chartData = (data || []).sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            left: 0,
            right: 0,
            top: 20,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            className="text-[10px] fill-muted-foreground"
            tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-[10px] fill-muted-foreground"
            tickFormatter={(value) => formatRevenue(value)}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border border-border px-3 py-2 rounded-lg shadow-sm">
                    <p className="text-[10px] text-muted-foreground font-medium mb-1">
                        {new Date(label).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {formatRevenue(Number(payload[0].value))}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            dataKey="revenue"
            type="monotone"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}