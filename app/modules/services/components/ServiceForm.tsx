import { Input } from "@/shared/components/form/Input";
import { Label } from "@/shared/components/form/Label";
import { Button } from "@/shared/components/form/Button";
import { Textarea } from "@/shared/components/form/Textarea";
import { CheckIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { useServiceForm,  } from "../hooks/useServiceForm";
import type { ServiceFormInput } from "../schemas/service-form.schema";
import type { Staff } from "@/modules/staff/types/staff.type";

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormInput>;
  staffs?: Staff[];
  onSubmit: (data: ServiceFormInput) => Promise<void>;
  isPending: boolean;
  onCancel: () => void;
  imageUrl?: string | null;
  isEdit?: boolean;
}

export const ServiceForm = ({
  defaultValues,
  staffs = [],
  onSubmit,
  isPending,
  onCancel,
  imageUrl = '',
  isEdit  = false,
}: ServiceFormProps) => {
  
  const {handleSubmit, register, errors, imageFile, setImageFile, imagePreview, imageInputRef, selectedStaffIds, toggleStaff} = useServiceForm({staffs, defaultValues, isEdit})

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
          {imagePreview || imageUrl ? (
            <img
              src={imagePreview || imageUrl || ""}
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

      {staffs.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label>Asignar Profesionales</Label>
          <ul className="flex flex-wrap gap-2 pt-2">
            {staffs.map(({ displayName, id }) => {
              const isSelected = selectedStaffIds.includes(id);
              return (
                <li
                  key={id}
                  onClick={() => toggleStaff(id)}
                  className={twMerge(
                    "py-1.5 px-3 rounded-lg transition-all duration-300 border cursor-pointer",
                    "text-center font-medium text-sm flex gap-1.5 items-center  ",
                    "bg-white  border-mist-200  text-mist-700 hover:border-mist-300 ",
                    "dark:text-mist-300 dark:border-mist-800 dark:hover:border-mist-600 dark:bg-transparent",
                    "hover:bg-mist-50 dark:hover:bg-mist-900/40",
                    isSelected && "border-mist-300 dark:border-mist-800",
                  )}
                >
                  <div className={twMerge("p-0.5 ring rounded-full text-mist-600 dark:text-mist-400", "ring-mist-200 dark:ring-mist-800")}>
                    {isSelected ? <CheckIcon className="size-3.5 stroke-2" /> : <div className="size-3.5" />}
                    </div>
                  <span className="truncate">{displayName}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

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
          {isEdit ? "Guardar Cambios" : "Crear Servicio"}
        </Button>
      </div>
    </form>
  );
};
