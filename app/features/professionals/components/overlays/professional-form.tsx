import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Callout } from '@/shared/components/ui';
import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { Textarea } from '@/shared/components/form/Textarea';
import { professionalFormSchema, type ProfessionalFormValues } from '../../schemas/professional-form-schema';
import { COUNTRIES } from '@/shared/constants';
import type { ApiError } from '@/core/error/api-error';
import { useApiFormError } from '@/shared/hooks/use-api-form-error';
import { PhoneCountryCode } from '@/shared/components/form/phone-country-code';
import { ModalBody, ModalFooter } from '@/shared/components/ui/modal';
import { CameraIcon } from '@heroicons/react/24/outline';
import { useServices } from '@/features/services';
import { CheckIcon } from '@heroicons/react/16/solid';
import { cn } from '@/shared/utils/cn';
import { Switch } from '@/shared/components/form/Switch';

interface Props {
  defaultValues?: Partial<ProfessionalFormValues>;
  onSubmit: (data: ProfessionalFormValues) => void;
  onCancel?: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
  error?: ApiError | null;
}

const initialValues: Partial<ProfessionalFormValues> = {
  name: '',
  email: '',
  phoneCountryCode: '598',
  phoneNumber: '',
  bio: '',
  commissionType: 'PERCENTAGE',
  commissionAmount: 0,
  schedule: {
    workingHours: [],
  },
};

export const ProfessionalForm = ({ defaultValues, onSubmit, onCancel, submitLabel, isSubmitting = false, error = null }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    getValues,
    formState: { errors },
  } = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: { ...initialValues, ...defaultValues },
  });

  useApiFormError(error, setError, getValues);

  const selectedCountryCode = watch('phoneCountryCode');

  const { data: servicesData, isLoading: isLoadingServices } = useServices();
  const services = servicesData?.data ?? [];
  const selectedServiceIds = watch('serviceIds') ?? [];

  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      setValue(
        'serviceIds',
        selectedServiceIds.filter((pid) => pid !== id),
        { shouldValidate: true },
      );
    } else {
      setValue('serviceIds', [...selectedServiceIds, id], { shouldValidate: true });
    }
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <div className="flex gap-4 items-end">
          <div className="flex flex-col gap-1 items-center shrink-0 ">
            <div className="size-16 rounded-full border-dashed border border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
              <CameraIcon className="size-6" />
            </div>
          </div>
          <div className="flex-1">
            <FormField label="Nombre completo" id="name" error={errors.name?.message}>
              <Input {...register('name')} id="name" placeholder="Ej. Juan Pérez" />
            </FormField>
          </div>
        </div>

        <FormField label="Correo electrónico" id="email" error={errors.email?.message}>
          <Input type="email" {...register('email')} id="email" placeholder="juan@ejemplo.com" />
        </FormField>

        <FormField label="Teléfono" id="phoneNumber" error={errors.phoneNumber?.message || errors.phoneCountryCode?.message}>
          <div className="flex gap-2">
            <PhoneCountryCode
              value={selectedCountryCode || '598'}
              onChange={(val) => setValue('phoneCountryCode', val, { shouldValidate: true })}
              disabled={isSubmitting}
            />

            <Input type="tel" {...register('phoneNumber')} id="phoneNumber" placeholder="099 123 456" fullWidth disabled={isSubmitting} />
          </div>
        </FormField>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-gray-900">Acceso a Bookify</span>

            <span className="text-sm text-gray-500">Permitir que este profesional acceda a la plataforma</span>
          </div>

          <Switch checked={true} onCheckedChange={() => {}} />
        </div>

        {true && (
          <Callout type="neutral" className="py-2">
            Se enviará una invitación a <span className="font-bold">ivanrms371@gmail.com</span>.
          </Callout>
        )}

        <FormField label="Especialidad" description="Será visible para tus clientes" id="title">
          <Input type="text" id="title" placeholder="Ej. Barbero" />
        </FormField>

        <FormField label="Asignar Servicios" id="services">
          {isLoadingServices ? (
            <div className="text-sm text-gray-500">Cargando servicios...</div>
          ) : (
            <div className="flex flex-col gap-2">
              {services.map((service) => {
                const isChecked = selectedServiceIds.includes(service.id);
                return (
                  <label
                    key={service.id}
                    className="flex items-center gap-3 px-3 py-2 h-10 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleService(service.id)} />
                    <div
                      className={cn(
                        'size-5 border rounded-md flex justify-center items-center',
                        isChecked ? 'bg-indigo-600 border-transparent text-white' : 'border-gray-200',
                      )}
                    >
                      {isChecked && <CheckIcon className="size-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-800 font-medium">{service.name}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </FormField>
      </ModalBody>
    </form>
  );
};
