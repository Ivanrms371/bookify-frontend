import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui';
import { FormField } from '@/shared/components/form/FormField';
import { Input } from '@/shared/components/form/input';
import { Textarea } from '@/shared/components/form/Textarea';
import { customerFormSchema, type CustomerFormData } from '../../schemas/customer-form.schema';
import { COUNTRIES } from '@/shared/constants';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { normalizePhone } from '@/shared/utils';
import type { ApiError } from '@/core/error/api-error';
import { useApiFormError } from '@/shared/hooks/use-api-form-error';

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
      <div className="space-y-5 flex-1 overflow-y-auto">
        <FormField label="Nombre completo" id="name" error={errors.name?.message}>
          <Input {...register('name')} id="name" placeholder="Ej. Juan Pérez" />
        </FormField>

        <FormField label="Correo electrónico" id="email" error={errors.email?.message}>
          <Input type="email" {...register('email')} id="email" placeholder="juan@ejemplo.com" />
        </FormField>

        <FormField label="Teléfono" id="phone" error={errors.phone?.message || errors.phoneCountryCode?.message}>
          <div className="flex gap-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="flex shrink-0 items-center gap-2 h-10 w-28 bg-white rounded-xl border border-gray-200 px-3 text-sm font-medium text-gray-800 outline-none transition hover:bg-gray-50 focus:border-gray-400 disabled:opacity-50"
                >
                  <img src={selectedCountry.flagUrl} alt={selectedCountry.name} className="w-5 h-auto rounded-xs shadow-sm object-cover" />
                  <span>+{selectedCountry.dialCode}</span>
                  <ChevronDownIcon className="size-4 text-gray-400" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="start"
                  className="z-50 min-w-48 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                >
                  {COUNTRIES.map((c) => (
                    <DropdownMenu.Item
                      key={c.code}
                      onClick={() => setValue('phoneCountryCode', c.dialCode, { shouldValidate: true })}
                      className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-2 py-2 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                    >
                      <img src={c.flagUrl} alt={c.name} className="w-5 h-auto rounded-xs shadow-sm object-cover" />
                      <span className="text-gray-800">{c.name}</span>
                      <span className="text-gray-800 ml-auto">+{c.dialCode}</span>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <Input type="tel" {...register('phone')} id="phone" placeholder="99 123 456" fullWidth disabled={isSubmitting} />
          </div>
        </FormField>

        <FormField label="Notas (Opcional)" id="notes" error={errors.notes?.message}>
          <Textarea {...register('notes')} id="notes" placeholder="Información adicional sobre el cliente..." />
        </FormField>
      </div>

      <div className="pt-6 mt-6 border-t border-gray-200 flex gap-2">
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
        <Button variant="primary" type="submit" fullWidth loading={isSubmitting} disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
