import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/shared/components/form/input';

import { FormField } from '@/shared/components/form/FormField';
import { Textarea } from '@/shared/components/form/Textarea';
import { CheckIcon } from '@heroicons/react/16/solid';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/components/ui';
import { useProfessionals } from '@/features/professionals/hooks/use-professionals';
import { serviceFormSchema, type ServiceFormData } from '../../schemas/service-form-schema';
import type { ApiError } from '@/core/error/api-error';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
  defaultValues?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
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

export const ServiceForm = ({ defaultValues, onSubmit, onCancel, submitLabel, isSubmitting, previewImageUrl }: Props) => {
  const { data: professionals = [] } = useProfessionals();
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(defaultValues?.discountFixed ? 'fixed' : 'percentage');

  const [previewImage, setPreviewImage] = useState<string | null>(previewImageUrl || null);

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

  console.log(errors);

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit({
          ...data,
          ...(discountType === 'percentage'
            ? { discountPercentage: data.discountPercentage, discountFixed: undefined }
            : { discountFixed: data.discountFixed, discountPercentage: undefined }),
        }),
      )}
      className="flex flex-col h-full"
    >
      <div className="space-y-5 flex-1 overflow-y-auto">
        <FormField label="Nombre" id="name" error={errors.name?.message}>
          <Input id="name" {...register('name', { required: true })} placeholder="Ej: Corte de pelo" />
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

        <FormField label="Imagen" id="image" error={errors.image?.message as string}>
          <div className="flex gap-2">
            {previewImage && <img src={previewImage} className=" object-cover size-10 rounded-xl" alt="Preview" />}
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file) {
                  setValue('image', file);
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
            />
          </div>
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
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleProfessional(prof.id)} />
                  <div
                    className={cn(
                      'size-5 border rounded-md border-gray-200 flex justify-center items-center',
                      isChecked && 'bg-indigo-600 border-transparent text-white',
                    )}
                  >
                    {isChecked && <CheckIcon className="size-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-800">{prof.displayName}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </FormField>
      </div>

      <div className="pt-6 mt-6 border-t border-gray-200 flex gap-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" fullWidth loading={isSubmitting}>
          {submitLabel || 'Crear Servicio'}
        </Button>
      </div>
    </form>
  );
};
