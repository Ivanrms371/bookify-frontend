import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleExceptionFormSchema, type ScheduleExceptionFormData } from '../../schemas/schedule-exception-form-schema';
import { Input } from '@/shared/components/form/input';
import { FormField } from '@/shared/components/form/form-field';
import { Textarea } from '@/shared/components/form/Textarea';
import { Button, Callout } from '@/shared/components/ui';
import { ModalBody, ModalFooter } from '@/shared/components/ui/modal';
import { useProfessionals } from '@/features/professionals/hooks/use-professionals';
import { useSettingsDraft } from '@/features/settings/hooks/use-settings-draft';
import type { ScheduleException } from '../../types/schedule-exception.types';
interface Props {
  tenantId: string;
  initialData?: ScheduleException;
  onSubmit: (data: ScheduleExceptionFormData) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string;
}
export const ScheduleExceptionForm = ({ initialData, onSubmit, onCancel, isSubmitting = false, error }: Props) => {
  const query = useProfessionals();
  const professionals = Array.isArray(query.data) ? query.data : [];
  const unavailable = query.isError || (!query.isLoading && !Array.isArray(query.data));
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<ScheduleExceptionFormData>({
    resolver: zodResolver(scheduleExceptionFormSchema),
    defaultValues: {
      startDate: initialData?.startDate.split('T')[0] ?? '',
      endDate: initialData?.endDate.split('T')[0] ?? '',
      isClosed: initialData?.isClosed ?? false,
      intervals: initialData?.blocks ?? [{ opensAt: '09:00', closesAt: '18:00' }],
      professionalIds: initialData?.professionals.map((p) => p.professionalId) ?? [],
      reason: initialData?.reason ?? '',
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'intervals' });
  useSettingsDraft('exception', isDirty, isSubmitting);
  const isClosed = watch('isClosed');
  useEffect(() => {
    if (!initialData && professionals.length === 1 && getValues('professionalIds').length === 0) {
      setValue('professionalIds', [professionals[0].id], { shouldValidate: true });
    }
  }, [query.data, initialData, getValues, setValue]);
  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit({ ...values, intervals: values.isClosed ? [] : values.intervals }))}
      className="space-y-5"
    >
      <fieldset disabled={isSubmitting} className="space-y-5">
        <ModalBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Fecha de inicio" id="startDate" error={errors.startDate?.message}>
              <Input id="startDate" type="date" {...register('startDate')} />
            </FormField>
            <FormField label="Fecha de fin" id="endDate" error={errors.endDate?.message}>
              <Input id="endDate" type="date" {...register('endDate')} />
            </FormField>
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium mb-2">Tipo de excepción</legend>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="exception-type"
                checked={!isClosed}
                onChange={() => setValue('isClosed', false, { shouldDirty: true })}
              />
              Horario especial
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="exception-type"
                checked={isClosed}
                onChange={() => setValue('isClosed', true, { shouldDirty: true })}
              />
              Cerrado todo el día
            </label>
          </fieldset>
          {!isClosed && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Horarios de atención</p>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <FormField id={`opens-${index}`} label="Desde" error={errors.intervals?.[index]?.opensAt?.message}>
                    <Input id={`opens-${index}`} type="time" {...register(`intervals.${index}.opensAt`)} />
                  </FormField>
                  <FormField id={`closes-${index}`} label="Hasta" error={errors.intervals?.[index]?.closesAt?.message}>
                    <Input id={`closes-${index}`} type="time" {...register(`intervals.${index}.closesAt`)} />
                  </FormField>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={`Eliminar intervalo ${index + 1}`}
                    onClick={() => remove(index)}
                    className="mt-6"
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
              {errors.intervals?.message && (
                <p role="alert" className="text-sm text-red-600">
                  {errors.intervals.message}
                </p>
              )}
              <Button type="button" variant="secondary" size="sm" onClick={() => append({ opensAt: '', closesAt: '' })}>
                Añadir intervalo
              </Button>
            </div>
          )}
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium mb-2">¿A qué profesionales aplica?</legend>
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
              professionals.map((professional) => (
                <label key={professional.id} className="flex items-center gap-3 border border-gray-200 p-3 rounded-lg">
                  <input type="checkbox" value={professional.id} {...register('professionalIds')} />
                  {professional.name}
                </label>
              ))
            )}
            {errors.professionalIds?.message && (
              <p role="alert" className="text-sm text-red-600">
                {errors.professionalIds.message}
              </p>
            )}
          </fieldset>
          <FormField label="Motivo" id="reason">
            <Textarea id="reason" {...register('reason')} placeholder="Ej. Reformas en el local" />
          </FormField>
          <Callout type="neutral">
            Esta excepción modifica la disponibilidad para nuevas reservas. No cancela ni reprograma turnos existentes.
          </Callout>
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
