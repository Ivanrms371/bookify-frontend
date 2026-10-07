import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  scheduleExceptionFormSchema,
  scheduleExceptionIntervalsSchema,
  type ScheduleExceptionFormData,
} from '../../schemas/schedule-exception-form-schema';
import { cn } from '@/shared/utils/cn';
import { Input } from '@/shared/components/form/input';
import { FormField } from '@/shared/components/form/form-field';
import { Textarea } from '@/shared/components/form/Textarea';
import { Button, Callout } from '@/shared/components/ui';
import { CheckIcon } from '@heroicons/react/16/solid';
import { ArrowLongRightIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useSettingsDraft } from '@/features/settings/hooks/use-settings-draft';
import { useProfessionals } from '@/features/professionals/hooks/use-professionals';
import { ModalBody, ModalFooter } from '@/shared/components/ui/modal';

import type { ScheduleException } from '../../types/schedule-exception.types';

interface Props {
  tenantId: string;
  error?: string;
  initialData?: ScheduleException;
  onSubmit: (data: ScheduleExceptionFormData) => void | Promise<void>;
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

export const ScheduleExceptionForm = ({ initialData, onSubmit, onCancel, isSubmitting = false, error }: Props) => {
  const query = useProfessionals();
  const professionals = Array.isArray(query.data) ? query.data : [];
  const unavailable = query.isError || (!query.isLoading && !Array.isArray(query.data));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors, isDirty },
  } = useForm<ScheduleExceptionFormData>({
    defaultValues: formatInitialData(initialData),
    resolver: zodResolver(scheduleExceptionFormSchema),
    mode: 'onChange',
  });

  const isClosed = watch('isClosed');
  const intervals = watch('intervals');
  const canAddInterval = intervals.length === 0 || scheduleExceptionIntervalsSchema.safeParse(intervals).success;
  const { fields, append, remove } = useFieldArray({ control, name: 'intervals' });
  useSettingsDraft('exception', isDirty, isSubmitting);
  const professionalIds = watch('professionalIds');

  useEffect(() => {
    if (!initialData && professionals.length === 1 && getValues('professionalIds').length === 0) {
      setValue('professionalIds', [professionals[0].id], { shouldValidate: true });
    }
  }, [query.data, initialData, getValues, setValue]);

  const toggleProfessional = (id: string) => {
    const current = professionalIds ?? [];
    if (current.includes(id)) {
      setValue(
        'professionalIds',
        current.filter((pid) => pid !== id),
        { shouldValidate: true, shouldDirty: true },
      );
    } else {
      setValue('professionalIds', [...current, id], { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit({ ...values, intervals: values.isClosed ? [] : values.intervals }))}
      className="space-y-5"
    >
      <fieldset disabled={isSubmitting} className="min-w-0">
        <ModalBody>
          {/* Date range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                aria-pressed={!isClosed}
                onClick={() => setValue('isClosed', false, { shouldDirty: true, shouldValidate: true })}
                className={cn(
                  'flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  !isClosed ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                )}
              >
                Horario especial
              </button>
              <button
                type="button"
                aria-pressed={isClosed}
                onClick={() => setValue('isClosed', true, { shouldDirty: true, shouldValidate: true })}
                className={cn(
                  'flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  isClosed ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                )}
              >
                Cerrado todo el día
              </button>
            </div>
          </FormField>

          {/* Special opening hours */}
          {!isClosed && (
            <FormField label="Horarios de atención" id="intervals" error={errors.intervals?.message}>
              <div className="flex flex-col gap-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wide text-gray-500">Franja {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Eliminar intervalo ${index + 1}`}
                        title="Eliminar intervalo"
                        onClick={() => remove(index)}
                        className="rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-300"
                      >
                        <TrashIcon className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3 sm:gap-5">
                      <FormField
                        className="min-w-0"
                        id={`opens-${index}`}
                        label="Desde"
                        error={errors.intervals?.[index]?.opensAt?.message}
                      >
                        <Input
                          className="min-w-0 w-full bg-white"
                          id={`opens-${index}`}
                          type="time"
                          {...register(`intervals.${index}.opensAt`)}
                        />
                      </FormField>
                      <span className="mt-9 text-gray-400" aria-hidden="true">
                        <ArrowLongRightIcon className="size-4" />
                      </span>
                      <FormField
                        className="min-w-0"
                        id={`closes-${index}`}
                        label="Hasta"
                        error={errors.intervals?.[index]?.closesAt?.message}
                      >
                        <Input
                          className="min-w-0 w-full bg-white"
                          id={`closes-${index}`}
                          type="time"
                          {...register(`intervals.${index}.closesAt`)}
                        />
                      </FormField>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 px-4 py-3 text-sm font-medium text-indigo-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-indigo-200 disabled:hover:bg-indigo-50/40"
                  disabled={!canAddInterval}
                  aria-describedby={!canAddInterval ? 'interval-add-hint' : undefined}
                  onClick={() => {
                    if (canAddInterval) append({ opensAt: '', closesAt: '' });
                  }}
                >
                  <PlusIcon className="size-4" />
                  Añadir intervalo
                </button>
                {!canAddInterval && (
                  <p id="interval-add-hint" className="text-xs text-gray-500">
                    Completa los horarios con una apertura anterior al cierre y sin superposiciones para añadir otro intervalo.
                  </p>
                )}
              </div>
            </FormField>
          )}

          {/* Profesionales */}
          <FormField label="¿A qué profesionales aplica?" id="professionalIds" error={errors.professionalIds?.message}>
            <div className="flex flex-col gap-2">
              {query.isLoading ? (
                <p role="status">Cargando profesionales…</p>
              ) : unavailable ? (
                <div role="alert">
                  <p>No se pudieron cargar los profesionales.</p>
                  <Button type="button" variant="secondary" onClick={() => void query.refetch()}>
                    Reintentar
                  </Button>
                </div>
              ) : professionals.length === 0 ? (
                <p>No hay profesionales. Añade uno antes de crear una excepción.</p>
              ) : (
                professionals.map((prof) => {
                  const isChecked = (professionalIds ?? []).includes(prof.id);
                  return (
                    <label
                      key={prof.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleProfessional(prof.id)} />
                      <div
                        aria-hidden="true"
                        className={cn(
                          'size-5 border rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 border-gray-200 flex justify-center items-center shrink-0',
                          isChecked && 'bg-indigo-600 border-transparent text-white',
                        )}
                      >
                        {isChecked && <CheckIcon className="size-4" />}
                      </div>
                      <span className="text-sm text-gray-800">{prof.name}</span>
                    </label>
                  );
                })
              )}
            </div>
          </FormField>

          {/* Reason */}
          <FormField label="Motivo" id="reason">
            <Textarea id="reason" placeholder="Escribe el motivo (ej. Reformas en el local, Licencia médica)" {...register('reason')} />
            <Callout type="neutral">
              Esta excepción modifica la disponibilidad para nuevas reservas. No cancela ni reprograma citas existentes ni envía
              notificaciones a los clientes.
            </Callout>
          </FormField>
        </ModalBody>
      </fieldset>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <ModalFooter>
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          type="submit"
          isSubmitting={isSubmitting}
          disabled={query.isLoading || unavailable || !professionals.length}
        >
          Guardar excepción
        </Button>
      </ModalFooter>
    </form>
  );
};
