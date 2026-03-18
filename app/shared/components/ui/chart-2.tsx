"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

export const description = "An area chart with gradient fill";

const chartData = [
  { day: 1, revenue: 0 },
  { day: 2, revenue: 850 },
  { day: 3, revenue: 0 },
  { day: 4, revenue: 1320 },
  { day: 5, revenue: 2780 },
  { day: 6, revenue: 4100 },
  { day: 7, revenue: 2250 },
  { day: 8, revenue: 1900 },
  { day: 9, revenue: 960 },
  { day: 10, revenue: 1480 },
  { day: 11, revenue: 0 },
  { day: 12, revenue: 3200 },
  { day: 13, revenue: 4550 },
  { day: 14, revenue: 2100 },
  { day: 15, revenue: 1750 },
  { day: 16, revenue: 980 },
  { day: 17, revenue: 0 },
  { day: 18, revenue: 2600 },
  { day: 19, revenue: 3890 },
  { day: 20, revenue: 2450 },
  { day: 21, revenue: 3100 },
  { day: 22, revenue: 1100 },
  { day: 23, revenue: 0 },
  { day: 24, revenue: 2950 },
  { day: 25, revenue: 4200 },
  { day: 26, revenue: 1850 },
  { day: 27, revenue: 2300 },
  { day: 28, revenue: 1250 },
  { day: 29, revenue: 0 },
  { day: 30, revenue: 3400 },
  { day: 31, revenue: 5100 },
];

const chartData2 = [
  { day: 1, revenue: 2300 },
  { day: 2, revenue: 2680 },
  { day: 3, revenue: 380 },
  { day: 4, revenue: 0 },
  { day: 5, revenue: 0 },
  { day: 6, revenue: 0 },
  { day: 7, revenue: 0 },
  { day: 8, revenue: 0 },
  { day: 9, revenue: 0 },
  { day: 10, revenue: 0 },
  { day: 11, revenue: 0 },
  { day: 12, revenue: 0 },
  { day: 13, revenue: 0 },
  { day: 14, revenue: 0 },
  { day: 15, revenue: 0 },
  { day: 16, revenue: 0 },
  { day: 17, revenue: 0 },
  { day: 18, revenue: 0 },
  { day: 19, revenue: 0 },
  { day: 20, revenue: 0 },
  { day: 21, revenue: 0 },
  { day: 22, revenue: 0 },
  { day: 23, revenue: 0 },
  { day: 24, revenue: 0 },
  { day: 25, revenue: 0 },
  { day: 26, revenue: 0 },
  { day: 27, revenue: 0 },
  { day: 28, revenue: 0 },
  { day: 29, revenue: 0 },
  { day: 30, revenue: 0 },
  { day: 31, revenue: 0 },
];

const chartConfig = {
  revenue: {
    label: "Ingresos",
    color: "oklch(54.6% 0.245 262.881)",
  },
} satisfies ChartConfig;

export function ChartAreaGradient() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos</CardTitle>
        <CardDescription>Ingresos diarios de enero.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value.toString()}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="oklch(88.2% 0.059 254.128)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="oklch(88.2% 0.059 254.128)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Subió un 5.2% este mes{" "}
              <ArrowTrendingUpIcon className="size-6 text-green-600 bg-green-200 p-1 rounded-full" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Enero 2026
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
