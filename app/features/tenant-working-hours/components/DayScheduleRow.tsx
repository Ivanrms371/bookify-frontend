import { Text } from '@/shared/components/typography';
import { DAY_LABELS, type DayOfWeek, type Interval } from '@/shared/constants/week-days';
import { CheckIcon, ClipboardDocumentCheckIcon, ClipboardDocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/16/solid';
import { TimeIntervalRow } from './TimeIntervalRow';
import { useState } from 'react';
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

  return (
    <div className={cn('space-y-4 rounded-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-5', !isActive && 'border-gray-200/50')}>
      <div className="flex justify-between items-end">
        <div className={cn(!isActive && 'opacity-50')}>
          <Text className="text-gray-700 dark:text-gray-300 text-lg">{DAY_LABELS[day].full}</Text>
          {!isActive && <p className="text-xs font-medium text-gray-500">Cerrado</p>}
        </div>

        {isActive ? (
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 text-xs font-medium text-gray-500"
            onClick={() => {
              setHasCopied(true);
              onCopyToAll(day);
              setTimeout(() => {
                setHasCopied(false);
              }, 2000);
            }}
          >
            {hasCopied ? (
              <>
                <ClipboardDocumentCheckIcon className="size-4 text-green-500 dark:text-green-400" />
                <span className="text-green-500 dark:text-green-400">¡Copiado a todos!</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="size-4" />
                Copiar a todos
              </>
            )}
          </button>
        ) : (
          <></>
        )}
      </div>

      {isActive && (
        <>
          <div className="flex flex-col gap-4">
            {intervals.map((interval, index) => (
              <TimeIntervalRow
                key={index}
                interval={interval}
                onRemove={() => onRemove(index)}
                onChange={(interval) => onIntervalChange(day, index, interval)}
              />
            ))}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 text-xs font-medium text-indigo-500"
              onClick={() => onAddInterval(day)}
            >
              <PlusIcon className="size-4" />
              Añadir Intervalo
            </button>

            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 text-xs font-medium text-rose-500"
              onClick={() => onDeactivateDay(day)}
            >
              <XMarkIcon className="size-4" />
              Cerrar {DAY_LABELS[day].full.toLowerCase()}
            </button>
          </div>
        </>
      )}

      {!isActive && (
        <>
          <div className="flex justify-between">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 text-xs font-medium text-indigo-500"
              onClick={() => onActivateDay(day)}
            >
              <PlusIcon className="size-4" /> Configurar horarios de {DAY_LABELS[day].full.toLowerCase()}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
