import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleExceptionFormSchema, type ScheduleExceptionFormData } from '../../schemas/schedule-exception-form-schema';
import { cn } from '@/shared/utils/cn';
import { Input } from '@/shared/components/form/input';
import { FormField } from '@/shared/components/form/form-field';
import { Textarea } from '@/shared/components/form/Textarea';
import { Button, Callout } from '@/shared/components/ui';
import { CheckIcon } from '@heroicons/react/16/solid';
import { PlusIcon } from '@heroicons/react/24/outline';
import { TimeIntervalRow } from '../time-interval-row';
import { useProfessionals } from '@/features/professionals/hooks/use-professionals';
import { DrawerBody, DrawerFooter } from '@/shared/components/ui/drawer';

import type { ScheduleException } from '../../types/schedule-exception.types';

interface Props {
  initialData?: ScheduleException;
  onSubmit: (data: ScheduleExceptionFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const DEFAULT_VALUES: ScheduleExceptionFormData = {
  startDate: '',
  endDate: '',
  isClosed: false,
  intervals: [{ opensAt: '09:00', closesAt: '18:00' }],
  professionalIds: [],
  reason: '',
};

function formatInitialData(initialData?: ScheduleException): ScheduleExceptionFormData {
  if (!initialData) return DEFAULT_VALUES;
  return {
    startDate: initialData.startDate.split('T')[0],
    endDate: initialData.endDate.split('T')[0],
    isClosed: initialData.isClosed,
    intervals: initialData.blocks ?? [],
    professionalIds: initialData.professionals?.map((p) => p.professionalId) || [],
    reason: initialData.reason || '',
  };
}

export const ScheduleExceptionForm = ({ initialData, onSubmit, onCancel, isSubmitting }: Props) => {
  const { data: professionals = [] } = useProfessionals();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ScheduleExceptionFormData>({
    defaultValues: formatInitialData(initialData),
    resolver: zodResolver(scheduleExceptionFormSchema),
  });

  const isClosed = watch('isClosed');
  const intervals = watch('intervals');
  const professionalIds = watch('professionalIds');

  useEffect(() => {
    if (professionals.length === 1) {
      setValue('professionalIds', [professionals[0].id], { shouldValidate: true });
    }
  }, [professionals, setValue]);

  const toggleProfessional = (id: string) => {
    const current = professionalIds ?? [];
    if (current.includes(id)) {
      setValue(
        'professionalIds',
        current.filter((pid) => pid !== id),
        { shouldValidate: true },
      );
    } else {
      setValue('professionalIds', [...current, id], { shouldValidate: true });
    }
  };

  const handleSelectAll = () => {
    if (professionalIds?.length === professionals.length) {
      setValue('professionalIds', [], { shouldValidate: true });
    } else {
      setValue(
        'professionalIds',
        professionals.map((p) => p.id),
        { shouldValidate: true },
      );
    }
  };

  const isAllSelected = professionalIds?.length === professionals.length && professionals.length > 0;

  const handleAddInterval = () => {
    setValue('intervals', [...(intervals ?? []), { opensAt: '12:00', closesAt: '13:00' }]);
  };

  const handleRemoveInterval = (index: number) => {
    setValue(
      'intervals',
      (intervals ?? []).filter((_, i) => i !== index),
    );
  };

  const handleIntervalChange = (index: number, next: { opensAt: string; closesAt: string }) => {
    const next_intervals = [...(intervals ?? [])];
    next_intervals[index] = next;
    setValue('intervals', next_intervals, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <DrawerBody>
        {/* Date range */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Fecha de inicio" id="startDate" error={errors.startDate?.message}>
            <Input id="startDate" type="date" {...register('startDate')} />
          </FormField>
          <FormField label="Fecha de fin" id="endDate" error={errors.endDate?.message}>
            <Input id="endDate" type="date" {...register('endDate')} />
          </FormField>
        </div>

        {/* Type: Especial Schedule / Closed */}
        <FormField label="Tipo de excepción" id="isClosed">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setValue('isClosed', false)}
              className={cn(
                'flex-1 px-3 py-1.5 rounded-2xl text-sm font-medium transition-colors',
                !isClosed ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
              )}
            >
              Horario especial
            </button>
            <button
              type="button"
              onClick={() => setValue('isClosed', true)}
              className={cn(
                'flex-1 px-3 py-1.5 rounded-2xl text-sm font-medium transition-colors',
                isClosed ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
              )}
            >
              Cerrado todo el día
            </button>
          </div>
        </FormField>

        {/* Scheudle (just if is not closed) */}
        {!isClosed && (
          <FormField label="Horarios de atención" id="intervals" error={errors.intervals?.message}>
            <div className="flex flex-col gap-2.5">
              {(intervals ?? []).map((interval, index) => (
                <TimeIntervalRow
                  key={index}
                  interval={{ opens: interval.opensAt, closes: interval.closesAt }}
                  onRemove={(intervals ?? []).length > 1 ? () => handleRemoveInterval(index) : undefined}
                  onChange={(next) => handleIntervalChange(index, { opensAt: next.opens, closesAt: next.closes })}
                />
              ))}
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors w-fit mt-1"
                onClick={handleAddInterval}
              >
                <PlusIcon className="size-4" />
                Añadir intervalo
              </button>
            </div>
          </FormField>
        )}

        {/* Profesionales */}
        {professionals.length > 1 && (
          <FormField label={'¿A qué profesionales aplica?'} id="professionalIds" error={errors.professionalIds?.message}>
            <div className="flex flex-col gap-2">
              {professionals.map((prof) => {
                const isChecked = (professionalIds ?? []).includes(prof.id);
                return (
                  <label
                    key={prof.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleProfessional(prof.id)}
                  >
                    <div
                      className={cn(
                        'size-5 border rounded-md border-gray-200 flex justify-center items-center shrink-0',
                        isChecked && 'bg-indigo-600 border-transparent text-white',
                      )}
                    >
                      {isChecked && <CheckIcon className="size-4" />}
                    </div>
                    <span className="text-sm text-gray-800">{prof.displayName}</span>
                  </label>
                );
              })}
            </div>
          </FormField>
        )}

        {/* Reason */}
        <FormField label="Motivo" id="reason">
          <Textarea id="reason" placeholder="Escribe el motivo (ej. Reformas en el local, Licencia médica)" {...register('reason')} />
          <Callout type="neutral">
            Se guardará en el historial interno y se usará para notificar a los clientes si hay citas afectadas.
          </Callout>
        </FormField>
      </DrawerBody>

      <DrawerFooter>
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" isSubmitting={isSubmitting}>
          Guardar excepción
        </Button>
      </DrawerFooter>
    </form>
  );
};
