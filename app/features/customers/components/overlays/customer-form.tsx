import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui';
import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { Textarea } from '@/shared/components/form/Textarea';
import { customerFormSchema, type CustomerFormData } from '../../schemas/customer-form.schema';
import { COUNTRIES } from '@/shared/constants';
import type { ApiError } from '@/core/error/api-error';
import { useApiFormError } from '@/shared/hooks/use-api-form-error';
import { PhoneCountryCode } from '@/shared/components/form/phone-country-code';
import { DrawerBody, DrawerFooter } from '@/shared/components/ui/drawer';

interface Props {
  defaultValues?: Partial<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => void;
  onCancel?: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
  error?: ApiError | null;
}

const initialValues: CustomerFormData = {
  name: '',
  email: '',
  phoneCountryCode: '598',
  phone: '',
  notes: '',
};

export const CustomerForm = ({ defaultValues, onSubmit, onCancel, submitLabel, isSubmitting = false, error = null }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    getValues,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: defaultValues ?? initialValues,
  });

  useApiFormError(error, setError, getValues);

  const selectedCountryCode = watch('phoneCountryCode');
  const selectedCountry = COUNTRIES.find((c) => c.dialCode === selectedCountryCode) || COUNTRIES[0];

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
      <DrawerBody>
        <FormField label="Nombre completo" id="name" error={errors.name?.message}>
          <Input {...register('name')} id="name" placeholder="Ej. Juan Pérez" />
        </FormField>

        <FormField label="Correo electrónico" id="email" error={errors.email?.message}>
          <Input type="email" {...register('email')} id="email" placeholder="juan@ejemplo.com" />
        </FormField>

        <FormField label="Teléfono" id="phone" error={errors.phone?.message || errors.phoneCountryCode?.message}>
          <div className="flex gap-2">
            <PhoneCountryCode
              value={selectedCountryCode}
              onChange={(val) => setValue('phoneCountryCode', val, { shouldValidate: true })}
              disabled={isSubmitting}
            />

            <Input type="tel" {...register('phone')} id="phone" placeholder="099 123 456" fullWidth disabled={isSubmitting} />
          </div>
        </FormField>

        <FormField label="Notas (Opcional)" id="notes" error={errors.notes?.message}>
          <Textarea {...register('notes')} id="notes" placeholder="Información adicional sobre el cliente..." />
        </FormField>
      </DrawerBody>

      <DrawerFooter>
        <Button variant="secondary" type="button" className="flex-1" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" className="flex-1" loading={isSubmitting} disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </DrawerFooter>
    </form>
  );
};
