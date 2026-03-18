import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/shared/components/form/Input";
import { Label } from "@/shared/components/form/Label";
import { Button } from "@/shared/components/form/Button";
import { Textarea } from "@/shared/components/form/Textarea";
import { PhotoIcon } from "@heroicons/react/24/outline";

export const serviceSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  price: z.string().min(1, "El precio es requerido"),
  initialActiveMinutes: z.coerce
    .number()
    .min(1, "Debe durar al menos 1 minuto"),
  passiveTimeMinutes: z.coerce.number().optional(),
  finalActiveMinutes: z.coerce.number().optional(),
  isActive: z.boolean().default(true),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormValues>;
  onSubmit: (data: ServiceFormValues) => Promise<void>;
  isPending: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

export const ServiceForm = ({
  defaultValues,
  onSubmit,
  isPending,
  onCancel,
  submitLabel = "Guardar",
}: ServiceFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: "",
      initialActiveMinutes: undefined,
      isActive: true,
      ...defaultValues,
    },
  });

  const fileRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre del Servicio</Label>
        <Input
          id="name"
          {...register("name")}
          hasError={!!errors.name}
          placeholder="Ej. Corte de pelo"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 5">
        <Label htmlFor="image">
          Imagen del Servicio{" "}
          <span className="text-gray-400 dark:text-gray-500">(opcional)</span>
        </Label>

        <input type="file" className="hidden" id="image" ref={fileRef} />

        <label
          htmlFor="image"
          className="h-24 border dark:border-gray-800 border-gray-300 border-dashed rounded-xl flex items-center justify-center text-center"
        >
          <div className="flex flex-col items-center">
            <PhotoIcon className="size-8 text-gray-400 dark:text-gray-500" />
            <div className="text-gray-400 text-sm font-medium">
              <span className="text-gray-600 dark:text-gray-200">
                Subir imágen
              </span>{" "}
              o arrastrar y soltar
            </div>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Precio</Label>
          <Input
            id="price"
            type="text"
            inputMode="decimal"
            placeholder="Ej. 350"
            {...register("price", {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              },
            })}
            hasError={!!errors.price}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="initialActiveMinutes">
            Duración{" "}
            <span className="text-gray-400 dark:text-gray-500">(minutos)</span>
          </Label>
          <Input
            id="initialActiveMinutes"
            type="number"
            {...register("initialActiveMinutes")}
            hasError={!!errors.initialActiveMinutes}
            placeholder="Ej. 45"
          />
          {errors.initialActiveMinutes && (
            <p className="text-red-500 text-sm">
              {errors.initialActiveMinutes.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">
          Descripción{" "}
          <span className="text-gray-400 dark:text-gray-500">(opcional)</span>
        </Label>
        <Textarea
          placeholder="Una breve descripción sobre lo que ofrece el servicio..."
          id="description"
          {...register("description")}
          hasError={!!errors.description}
        />
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button
          type="button"
          className="button-tertiary"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="button-primary"
          isLoading={isPending}
          disabled={isPending}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
