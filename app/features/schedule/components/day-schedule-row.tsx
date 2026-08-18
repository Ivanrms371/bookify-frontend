import { Text } from '@/shared/components/typography';
import { DAY_LABELS, type DayOfWeek, type Interval } from '@/shared/constants/week-days';
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon, PlusIcon } from '@heroicons/react/24/outline';
import { TimeIntervalRow } from './time-interval-row';
import { useState } from 'react';
import { Switch } from '@/shared/components/form/Switch';
import { cn } from '@/shared/utils/cn';

interface DayScheduleRowProps {
  day: DayOfWeek;
  isActive: boolean;
  intervals: Interval[];
  onCopyToAll: (day: DayOfWeek) => void;
  onAddInterval: (day: DayOfWeek) => void;
  onRemoveInterval: (day: DayOfWeek, intervalIndex: number) => void;
  onIntervalChange: (day: DayOfWeek, intervalIndex: number, interval: Interval) => void;
  onActivateDay: (day: DayOfWeek) => void;
  onDeactivateDay: (day: DayOfWeek) => void;
}

export const DayScheduleRow = ({
  day,
  isActive,
  intervals,
  onCopyToAll,
  onAddInterval,
  onRemoveInterval,
  onIntervalChange,
  onActivateDay,
  onDeactivateDay,
}: DayScheduleRowProps) => {
  const [hasCopied, setHasCopied] = useState(false);

  const onRemove = (index: number) => {
    if (intervals.length > 1) {
      onRemoveInterval(day, index);
    } else {
      onDeactivateDay(day);
    }
  };

  const handleToggle = (checked: boolean) => {
    if (checked) {
      onActivateDay(day);
    } else {
      onDeactivateDay(day);
    }
  };

  return (
    <div className="flex flex-col @3xl:flex-row items-start gap-4 @3xl:gap-4 border-b border-gray-100 pb-5 last:border-0">
      {/* 1. Lado Izquierdo: Switch + Label */}
      <div className="flex items-center justify-between @3xl:justify-start gap-4 w-full @3xl:w-48 shrink-0 @3xl:pt-1">
        <div className="flex items-center gap-4">
          <Switch checked={isActive} onCheckedChange={handleToggle} />
          <Text className={cn('font-medium', isActive ? 'text-gray-800' : 'text-gray-400')}>{DAY_LABELS[day].full}</Text>
        </div>
      </div>

      {isActive ? (
        <>
          {/* 2. Centro: Horarios */}
          <div className="flex-1 flex flex-col gap-2 w-full">
            {intervals.map((interval, index) => (
              <TimeIntervalRow
                key={index}
                interval={interval}
                onRemove={() => onRemove(index)}
                onChange={(newInterval) => onIntervalChange(day, index, newInterval)}
              />
            ))}
          </div>

          {/* 3. Lado Derecho: Acciones */}
          <div className="flex flex-row @3xl:flex-col items-center @3xl:items-start justify-between @3xl:justify-start gap-4 @3xl:gap-3 shrink-0 w-full @3xl:w-48 @3xl:pt-2">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-400 transition-colors"
              onClick={() => onAddInterval(day)}
            >
              <PlusIcon className="size-4" />
              Añadir Intervalo
            </button>

            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              onClick={() => {
                setHasCopied(true);
                onCopyToAll(day);
                setTimeout(() => setHasCopied(false), 2000);
              }}
              title="Copiar horarios a todos los días"
            >
              {hasCopied ? (
                <>
                  <ClipboardDocumentCheckIcon className="size-4 text-green-500" />
                  <span className="text-green-500">¡Copiado a todos!</span>
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="size-4" />
                  <span>Copiar a todos</span>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center h-10 @3xl:pt-1">
          <Text className="text-gray-400 text-sm">Cerrado</Text>
        </div>
      )}
    </div>
  );
};
