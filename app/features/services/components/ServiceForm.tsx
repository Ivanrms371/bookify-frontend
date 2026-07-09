import { Controller, type UseFormReturn } from 'react-hook-form';
import { FormField } from '@/shared/components/form/FormField';
import { Label } from '@/shared/components/form/Label';
import { Input } from '@/shared/components/form/Input';
import { NumberInput } from '@/shared/components/form/NumberInput';
import { Textarea } from '@/shared/components/form/Textarea';
import { Alert } from '@/shared/components/feedback/Alert';
import type { CreateServicePayload } from '../schemas/create-service.schema';
import { ImageInput } from '@/shared/components/form/ImageInput';
import { Select } from '@/shared/components/form/Select';
import { SERVICE_DURATION_OPTIONS } from '../constants/service-duration';

interface Props {
  methods: UseFormReturn<CreateServicePayload>;
  imageInputKey?: number;
}

export const ServiceForm = ({ methods, imageInputKey }: Props) => {
  const {
    register,
    control,
    formState: { errors },
  } = methods;

  return (
    <div className="space-y-3">
      <FormField>
        <Label htmlFor="service-image">Imagen del servicio</Label>

        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <ImageInput
              key={imageInputKey}
              id="service-image"
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.image?.message}
            />
          )}
        />
      </FormField>

      <FormField>
        <Label htmlFor="name">Nombre del servicio</Label>
        <Input id="name" placeholder="Ej: Corte de pelo" {...register('name')} hasError={!!errors.name} />
        {errors.name?.message && <Alert message={errors.name.message} variant="error" />}
      </FormField>

      <div className="flex gap-4">
        <FormField className="flex-1">
          <Label htmlFor="price">Precio</Label>
          <div className="relative w-full">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-mist-600 dark:text-mist-400">
              $
            </span>
            <NumberInput
              control={control}
              id="price"
              name="price"
              maxDecimals={0}
              placeholder="0"
              className="w-full pl-7"
              hasError={!!errors.price}
            />
          </div>
          {errors.price?.message && <Alert message={errors.price.message} variant="error" />}
        </FormField>

        <FormField className="flex-1">
          <Label htmlFor="durationMinutes">Duración</Label>
          <Controller
            control={control}
            name="durationMinutes"
            render={({ field }) => (
              <Select
                id="durationMinutes"
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                onBlur={field.onBlur}
                hasError={!!errors.durationMinutes}
              >
                {SERVICE_DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.durationMinutes?.message && <Alert message={errors.durationMinutes.message} variant="error" />}
        </FormField>
      </div>

      <FormField>
        <Label htmlFor="description">Descripción (Opcional)</Label>
        <Textarea
          id="description"
          placeholder="Breve descripción de lo que incluye el servicio..."
          {...register('description')}
          hasError={!!errors.description}
        />
        {errors.description?.message && <Alert message={errors.description.message} variant="error" />}
      </FormField>
    </div>
  );
};
