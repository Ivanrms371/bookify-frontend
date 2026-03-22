import { useMemo, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { DailyRevenue } from "@/modules/dashboard/api/dashboard.api";
import { cn } from "@/shared/lib/utils";

interface RevenueChartProps {
  data: DailyRevenue[];
}

function formatShortDate(dateStr: string) {
  const [, month, day] = dateStr.split("-");
  return `${parseInt(day)}/${parseInt(month)}`;
}

function formatRevenue(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value}`;
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    setIsDark(root.classList.contains("dark"));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const totalRevenue = useMemo(
    () => data.reduce((sum, d) => sum + d.revenue, 0),
    [data],
  );

  const chartData = useMemo(
    () => data.map((d) => ({ ...d, label: formatShortDate(d.date) })),
    [data],
  );

  return (
    <div
      className={cn(
        "col-span-7 flex flex-col rounded-4xl bg-white dark:bg-transparent dark:border dark:border-mist-900/70 p-6",
      )}
    >
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

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-mist-100 dark:text-mist-800/50"
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              className="text-mist-400 dark:text-mist-500"
              interval="preserveStartEnd"
              tickMargin={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              className="text-mist-400 dark:text-mist-500"
              tickFormatter={formatRevenue}
              width={55}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: isDark ? "1px solid #22292b" : "none",
                boxShadow: isDark
                  ? "0 4px 24px rgba(0,0,0,0.5)"
                  : "0 4px 20px rgba(0,0,0,0.12)",
                padding: "10px 14px",
                backgroundColor: isDark ? "#161b1d" : "#fff",
                color: isDark ? "#e5e7eb" : "#f1f3f3", // dark bg-mist-900 | light bg-mist-100
              }}
              labelStyle={{
                color: isDark ? "#e5e7eb" : "#22292b",
                marginBottom: 4,
              }}
              itemStyle={{
                color: isDark ? "#e5e7eb" : "#22292b",
              }}
              labelFormatter={(label) => `${label}`}
              formatter={(value: number) => [formatRevenue(value), "Ganancia"]}
              cursor={{
                stroke: "#6366f1",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{
                r: 5,
                stroke: "#6366f1",
                strokeWidth: 2,
                fill: isDark ? "#111827" : "#fff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
