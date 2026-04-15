import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

interface DailyRevenueChartProps {
  data: { date: string; revenue: number; appointments: number }[];
}

const chartConfig = {
  revenue: {
    label: "Ingresos",
    color: "oklch(54.6% 0.245 262.881)",
  },
} satisfies ChartConfig;

export function DailyRevenueChart({ data }: DailyRevenueChartProps) {
  // Opcionalmente podemos formatear los datos si es necesario para el componente AreaChart
  // Por ahora asumimos que el backend envía el formato correcto o lo ajustamos aquí
  const formattedData = data.map((item) => ({
    ...item,
    day: new Date(item.date).getDate(), // Extraer el día para el eje X si es lo que se espera
  }));

  return (
    <div className=" bg-white col-span-5 row-span-10 p-4 rounded-4xl">
      <h2 className="text-xl text-mist-800">Últimos 30 días</h2>
      <p className="text-mist-500">Datos de ingresos y actividad reciente</p>

      <ChartContainer config={chartConfig}>
        <AreaChart
          data={formattedData}
          accessibilityLayer
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

      <div className="mt-4">
        {/* Aquí podríamos calcular la tendencia dinámicamente si tenemos datos históricos */}
        <div className="flex items-center gap-2 leading-none mb-2">
          Actualizado recientemente
          <ArrowTrendingUpIcon className="size-6 text-green-600 bg-green-200 p-1 rounded-full" />
        </div>
        <div className="text-sm text-mist-500">
          Gráfico de rendimiento de negocio
        </div>
      </div>
    </div>
  );
}
