import { FormField } from '@/shared/components/form/FormField';
import { Input } from '@/shared/components/form/input';
import { Callout } from '@/shared/components/ui';
import { useFormContext } from 'react-hook-form';
import type { ProfessionalFormValues } from '../../schemas/professional-form-schema';
import { Select } from '@/shared/components/form/Select';

export const CommissionForm = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ProfessionalFormValues>();

  const commissionType = watch('commissionType');

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 mb-2">
        <FormField label="Tipo de Comisión" id="commissionType" error={errors.commissionType?.message}>
          <Select
            id="commissionType"
            {...register('commissionType')}
            options={[
              {
                value: 'PERCENTAGE',
                label: 'Porcentaje (%)',
              },
              {
                value: 'FIXED',
                label: 'Monto fijo ($)',
              },
            ]}
            value={commissionType}
            onChange={(e) => setValue('commissionType', e.target.value as 'PERCENTAGE' | 'FIXED', { shouldValidate: true })}
          />
        </FormField>
        <FormField label="Monto" id="commissionAmount" error={errors.commissionAmount?.message}>
          <Input
            id="commissionAmount"
            type="number"
            {...register('commissionAmount', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
          />
        </FormField>
      </div>
      <Callout className="mt-2" type="warning">
        Estás comisiones se aplican a partir del total generado por el profesional
      </Callout>
    </div>
  );
};
