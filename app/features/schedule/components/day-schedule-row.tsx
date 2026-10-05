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
    <div className="flex flex-col items-start gap-4 border-b border-gray-100 pb-5 last:border-0 @3xl:flex-row @3xl:gap-4">
      {/* Día */}
      <div className="flex w-full shrink-0 items-center justify-between gap-4 @3xl:w-48 @3xl:justify-start @3xl:pt-1">
        <div className="flex items-center gap-4">
          <Switch checked={isActive} onCheckedChange={handleToggle} />

          <Text className={cn('font-medium', isActive ? 'text-gray-800' : 'text-gray-400')}>{DAY_LABELS[day]?.full}</Text>
        </div>
      </div>

      {isActive ? (
        <>
          {/* Horarios */}
          <div className="flex w-full flex-1 flex-col gap-2">
            {fields.map((field, index) => (
              <TimeIntervalRow key={field.id} dayIndex={dayIndex} intervalIndex={index} onRemove={() => handleRemove(index)} />
            ))}
          </div>

          {/* Acciones */}
          <div className="flex w-full shrink-0 flex-row items-center justify-between gap-4 @3xl:w-48 @3xl:flex-col @3xl:items-start @3xl:justify-start @3xl:gap-3 @3xl:pt-2">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-400"
              onClick={handleAdd}
            >
              <PlusIcon className="size-4" />
              Añadir intervalo
            </button>

            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
              onClick={handleCopyToAll}
              title="Copiar horarios a todos los días abiertos"
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
        <div className="flex h-10 flex-1 items-center @3xl:pt-1">
          <Text className="text-sm text-gray-400">Cerrado</Text>
        </div>
      )}
    </div>
  );
};
