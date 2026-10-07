import { useFormContext } from 'react-hook-form';
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { Text } from '@/shared/components/typography';
import { Switch } from '@/shared/components/form/Switch';
import { cn } from '@/shared/utils/cn';

import { useWorkingHoursForm } from '../hooks/use-working-hours-form';
import { TimeIntervalRow } from './time-interval-row';
import { useWorkingDay } from '../hooks/use-working-day';
import { DAY_LABELS } from '@/shared/constants/week-days';
import { intervalSchema, type SaveWorkingHours } from '../schemas/schedule-form-schema';

interface DayScheduleRowProps {
  dayIndex: number;
}

export const DayScheduleRow = ({ dayIndex }: DayScheduleRowProps) => {
  const { watch, getValues, trigger } = useFormContext<SaveWorkingHours>();

  const { onToggleDay, copyToAll } = useWorkingHoursForm();

  const { fields, append, remove, replace } = useWorkingDay(dayIndex);

  const [hasCopied, setHasCopied] = useState(false);

  const day = watch(`workingHours.${dayIndex}.dayOfWeek`);
  const isActive = watch(`workingHours.${dayIndex}.isActive`);

  const handleToggle = () => {
    onToggleDay(day);

    if (isActive) {
      // Estaba activo → se cierra completamente.
      replace([]);
      return;
    }

    // Estaba cerrado → se activa con un intervalo vacío.
    if (fields.length === 0) {
      append({
        opensAt: '',
        closesAt: '',
      });
    }
  };

  const handleAdd = () => {
    const intervals = getValues(`workingHours.${dayIndex}.intervals`);
    if (intervals.every((interval) => intervalSchema.safeParse(interval).success)) {
      append({
        opensAt: '',
        closesAt: '',
      });
    } else {
      void trigger(`workingHours.${dayIndex}.intervals`);
    }
  };

  const handleRemove = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      return;
    }

    // Si elimina el único intervalo,
    // el día queda cerrado y sin horarios.
    onToggleDay(day);
    replace([]);
  };

  const handleCopyToAll = () => {
    if (!copyToAll(day)) {
      void trigger(`workingHours.${dayIndex}.intervals`);
      return;
    }
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <section
      className={cn(
        'min-w-0 overflow-hidden rounded-2xl border transition-colors',
        isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50/60',
      )}
    >
      <div className={cn('flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5', isActive && 'border-b border-gray-100')}>
        <div className="flex items-center gap-3">
          <Switch checked={isActive} onCheckedChange={handleToggle} aria-label={`Abrir ${DAY_LABELS[day]?.full}`} />
          <Text className={cn('font-semibold', isActive ? 'text-gray-800' : 'text-gray-500')}>{DAY_LABELS[day]?.full}</Text>
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium',
              isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500',
            )}
          >
            {isActive ? 'Abierto' : 'Cerrado'}
          </span>
        </div>
        {isActive && (
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            onClick={handleCopyToAll}
            title="Copiar horarios a todos los días abiertos"
          >
            {hasCopied ? <ClipboardDocumentCheckIcon className="size-4 text-emerald-600" /> : <ClipboardDocumentIcon className="size-4" />}
            <span className={hasCopied ? 'text-emerald-600' : undefined}>{hasCopied ? '¡Copiado a todos!' : 'Copiar a todos'}</span>
          </button>
        )}
      </div>
      {isActive && (
        <div className="space-y-3 p-4 sm:p-5">
          <div className="grid min-w-0 gap-3 @2xl:grid-cols-2">
            {fields.map((field, index) => (
              <TimeIntervalRow key={field.id} dayIndex={dayIndex} intervalIndex={index} onRemove={() => handleRemove(index)} />
            ))}
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 px-4 py-3 text-sm font-medium text-indigo-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            onClick={handleAdd}
          >
            <PlusIcon className="size-4" />
            Añadir intervalo
          </button>
        </div>
      )}
    </section>
  );
};
