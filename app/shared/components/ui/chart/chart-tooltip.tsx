import { type ReactNode } from 'react';
import { type TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { Card } from '../card';

interface ChartTooltipProps extends TooltipProps<ValueType, NameType> {
  // Usamos nombres distintos para no chocar con las props internas de Recharts
  valueFormatter?: (value: number) => string;
  labelFormatterCustom?: (label: any) => ReactNode;
}

export const ChartTooltip = ({ active, payload, label, valueFormatter, labelFormatterCustom }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Card className="min-w-32 rounded-lg border-gray-200 bg-white px-0 py-2 shadow">
        <div className="mb-2 border-b border-gray-200 px-2 pb-2 text-xs font-medium tracking-tighter text-gray-600 ">
          {labelFormatterCustom ? labelFormatterCustom(label) : label}
        </div>

        <div className="flex flex-col px-2">
          <span className="text-xs font-medium text-gray-600 ">{payload[0].name === 'revenue' ? 'Ingresos' : payload[0].name}</span>
          <span className="text-base font-medium text-gray-800 ">
            {valueFormatter ? valueFormatter(payload[0].value as number) : payload[0].value}
          </span>
        </div>
      </Card>
    );
  }
  return null;
};
