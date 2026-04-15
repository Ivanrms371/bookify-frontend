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
import type { DailyRevenue } from "@/modules/dashboard/types/dashboard.types";
import { cn, formatRevenue } from "@/shared/lib/utils";
import { Card } from "../Card";
import { Paragraph } from "../../typography/Paragraph";
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

interface RevenueChartProps {
  data: DailyRevenue[] | { date: string; revenue: number }[];
  totalMonth: number | string;
  totalPreviousMonth: number | string;
  title?: string;
}

export const RevenueChart = ({ 
  data, 
  totalMonth, 
  totalPreviousMonth,
  title = "Ganancias últimos 30 días"
}: RevenueChartProps) => {
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

  const monthNum = typeof totalMonth === "string" ? parseFloat(totalMonth) : totalMonth;
  const prevMonthNum = typeof totalPreviousMonth === "string" ? parseFloat(totalPreviousMonth) : totalPreviousMonth;
  
  const growth = prevMonthNum > 0 
    ? ((monthNum - prevMonthNum) / prevMonthNum) * 100 
    : 0;

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      const flat = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        flat.push({
           date: d.toISOString().split('T')[0],
           revenue: 0,
           label: `${d.getDate()}/${d.getMonth() + 1}`
        });
      }
      return flat;
    }

    return data.map((d) => {
      const [, month, day] = d.date.split("-");
      return { ...d, label: `${parseInt(day)}/${parseInt(month)}` };
    });
  }, [data]);

  return (
    <Card className="lg:col-span-7 pb-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <Paragraph className="text-sm font-medium text-mist-500 dark:text-mist-400 pb-1">
            {title}
          </Paragraph>
          <div className="flex items-center gap-3">
            <p className="text-4xl font-mono font-bold text-mist-900 dark:text-white">
              {formatRevenue(monthNum)}
            </p>
            {prevMonthNum > 0 && (
              <span className={cn(
                "text-sm font-bold flex items-center gap-1 px-2 py-0.5 rounded-lg",
                growth >= 0
                  ? "text-emerald-500" 
                  : "text-rose-500"
              )}>
                {Math.abs(growth).toFixed(0)}%
                {growth > 0 ?  <ArrowTrendingUpIcon className="size-5" /> :  <ArrowTrendingDownIcon className="size-5" />}
              </span>
            )}
          </div>
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
    </Card>
  );
};
