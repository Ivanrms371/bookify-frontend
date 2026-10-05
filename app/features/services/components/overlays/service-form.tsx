import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/shared/components/form/input';
import { FormField } from '@/shared/components/form/form-field';
import { Textarea } from '@/shared/components/form/Textarea';
import { CheckIcon } from '@heroicons/react/16/solid';
import { cn } from '@/shared/utils/cn';
import { useProfessionals } from '@/features/professionals/hooks/use-professionals';
import { serviceFormSchema, type ServiceFormData } from '../../schemas/service-form-schema';
import type { ApiError } from '@/core/error/api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModalBody } from '@/shared/components/ui/modal';
import { ServiceThumbnail } from '../service-thumbnail';

interface Props {
  formId: string;
  defaultValues?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => void;
  isSubmitting?: boolean;
  error?: ApiError | null;
  previewImageUrl?: string;
}

const initialValues = {
  professionalIds: [],
  name: '',
  description: '',
  durationMinutes: 0,
  price: 0,
  discountPercentage: null,
  discountFixed: null,
  image: null,
};

export const ServiceForm = ({ formId, defaultValues, onSubmit, isSubmitting, previewImageUrl }: Props) => {
  const { data: professionals = [] } = useProfessionals();
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(defaultValues?.discountFixed ? 'fixed' : 'percentage');

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  useEffect(
    () => () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    },
    [previewImage],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    defaultValues: defaultValues ?? initialValues,
    resolver: zodResolver(serviceFormSchema),
  });

  const selectedProfIds = watch('professionalIds') || [];

  const toggleProfessional = (id: string) => {
    if (selectedProfIds.includes(id)) {
      setValue(
        'professionalIds',
        selectedProfIds.filter((pid) => pid !== id),
      );
    } else {
      setValue('professionalIds', [...selectedProfIds, id]);
    }
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit((data) =>
        onSubmit({
          ...data,
          ...(discountType === 'percentage'
            ? { discountPercentage: data.discountPercentage, discountFixed: null }
            : { discountFixed: data.discountFixed, discountPercentage: null }),
        }),
      )}
      className="flex flex-col h-full"
    >
      <ModalBody>
        <FormField label="Nombre" id="name" error={errors.name?.message}>
          <Input id="name" {...register('name', { required: true })} placeholder="Ej: Corte de pelo" />
        </FormField>

        <FormField label="Imagen (opcional)" id="image" error={errors.image?.message ? String(errors.image.message) : undefined}>
          <div className="flex items-center gap-3">
            <ServiceThumbnail imageUrl={previewImage ?? previewImageUrl} />
            <Input
              id="image"
              type="file"
              accept="image/*"
              disabled={isSubmitting}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setValue('image', file, { shouldDirty: true, shouldValidate: true });
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
            />
          </div>
        </FormField>

        <FormField label="Descripción (opcional)" id="description" error={errors.description?.message}>
          <Textarea id="description" {...register('description')} placeholder="Breve descripción del servicio" />
        </FormField>

        <FormField label="Duración (minutos)" id="durationMinutes" error={errors.durationMinutes?.message}>
          <Input
            id="durationMinutes"
            type="number"
            {...register('durationMinutes', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
          />
        </FormField>

        <FormField label="Precio" id="price" error={errors.price?.message}>
          <Input id="price" type="number" {...register('price', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })} />
        </FormField>

        <div className="border-b border-gray-200 pb-2">
          Descuento <span className="text-sm text-gray-400 font-normal">(opcional)</span>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <FormField label="Tipo de descuento" id="discountType">
              <select
                id="discountType"
                className="input bg-white cursor-pointer"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto fijo ($)</option>
              </select>
            </FormField>
          </div>
          <div className="flex-1">
            <FormField
              label="Cantidad"
              id="discountAmount"
              error={discountType === 'percentage' ? errors.discountPercentage?.message : errors.discountFixed?.message}
            >
              {discountType === 'percentage' ? (
                <Input
                  id="discountAmount"
                  type="number"
                  {...register('discountPercentage', { setValueAs: (v) => (v === '' ? null : Number(v)) })}
                  rightIcon={<span className="text-gray-500 font-medium">%</span>}
                />
              ) : (
                <Input
                  id="discountAmount"
                  type="number"
                  {...register('discountFixed', { setValueAs: (v) => (v === '' ? null : Number(v)) })}
                  leftIcon={<span className="text-gray-500 font-medium">$</span>}
                />
              )}
            </FormField>
          </div>
        </div>

        <FormField label="Asignar Personal" id="professionals" error={errors.professionalIds?.message}>
          <div className="flex flex-col gap-2 mt-1">
            {professionals.map((prof) => {
              const isChecked = selectedProfIds.includes(prof.id);
              return (
                <label
                  key={prof.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 has-[:checked]:border-indigo-200 has-[:checked]:bg-indigo-50/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
                >
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isChecked}
                    disabled={isSubmitting}
                    onChange={() => toggleProfessional(prof.id)}
                  />
                  <div
                    className={cn(
                      'size-5 shrink-0 border rounded-md border-gray-200 flex justify-center items-center peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2',
                      isChecked && 'bg-indigo-600 border-transparent text-white',
                    )}
                  >
                    {isChecked && <CheckIcon className="size-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-800">{prof.name}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </FormField>
      </ModalBody>
    </form>
  );
};
