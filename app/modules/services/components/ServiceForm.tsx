import { useEffect, useRef, useState } from "react";
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

export type ServiceFormSubmitData = ServiceFormValues & { image?: File };

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormValues>;
  onSubmit: (data: ServiceFormSubmitData) => Promise<void>;
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

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setImagePreview(null);
  }, [imageFile]);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = (data: ServiceFormValues) => {
    onSubmit({ ...data, image: imageFile ?? undefined });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit as any)}
      className="space-y-4 mt-6"
    >
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="image">
          Imagen del Servicio{" "}
          <span className="text-mist-400 dark:text-mist-500">(opcional)</span>
        </Label>

        <input
          ref={imageInputRef}
          type="file"
          id="image"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />

        <label
          htmlFor="image"
          className="aspect-square max-h-32 w-full border dark:border-mist-800 border-mist-300 border-dashed rounded-xl flex items-center justify-center text-center cursor-pointer overflow-hidden"
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Vista previa"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="flex flex-col items-center">
              <PhotoIcon className="size-8 text-mist-400 dark:text-mist-500" />
              <div className="text-mist-400 text-sm font-medium">
                <span className="text-mist-600 dark:text-mist-200">
                  Subir imagen
                </span>{" "}
                o arrastrar y soltar
              </div>
            </div>
          )}
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
            <span className="text-mist-400 dark:text-mist-500">(minutos)</span>
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
          <span className="text-mist-400 dark:text-mist-500">(opcional)</span>
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
