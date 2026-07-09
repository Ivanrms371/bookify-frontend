import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartTooltip } from './chart-tooltip';
import { useThemeStore } from '@/shared/store/useThemeStore';

interface ChartBaseProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string; // Hexadecimal, ej: "#10b981"
  height?: number | string;
  formatYAxis?: (value: number) => string;
  formatXAxis?: (value: any) => string;
  formatYAxisTooltip?: (value: any) => string;
  formatXAxisTooltip?: (value: any) => string;
}

export const ChartBase = ({
  data,
  xKey,
  yKey,
  color = '#3b82f6', // Azul Turnify por defecto
  height = 300,
  formatYAxis,
  formatXAxis,
  formatYAxisTooltip,
  formatXAxisTooltip,
}: ChartBaseProps) => {
  const { isDark } = useThemeStore();
  const gradientId = `colorGradient-${yKey}`;

  return (
    <div style={{ width: '100%', height }} className="font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-mist-300 dark:stroke-mist-800" />

          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatXAxis}
            className="text-xs font-medium text-mist-600 dark:text-mist-300"
            minTickGap={40}
          />

          <YAxis
            tickFormatter={formatYAxis}
            axisLine={false}
            tickLine={false}
            className="text-xs font-medium text-mist-600 dark:text-mist-300"
            width={70}
          />

          <Tooltip
            content={(props) => (
              <ChartTooltip
                {...props}
                labelFormatterCustom={formatXAxisTooltip ?? formatXAxis}
                valueFormatter={formatYAxisTooltip ?? formatYAxis}
              />
            )}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '6 6' }}
          />

          <Area
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={2.5}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            activeDot={{
              r: 6,
              stroke: '#fff',
              strokeWidth: 3,
              fill: color,
            }}
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
