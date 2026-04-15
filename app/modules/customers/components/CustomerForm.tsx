import { Input } from "@/shared/components/form/Input"
import { Label } from "@/shared/components/form/Label"
import { Button } from "@/shared/components/form/Button"
import { Select } from "@/shared/components/form/Select"
import { useCustomerForm } from "../hooks/useCustomerForm"
import { PHONE_CODES } from "../data/phone-codes"
import type { CustomerFormValues } from "../schemas/customer-form.schema"

interface CustomerFormProps {
  onSubmit: (data: CustomerFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
  defaultValues?: Partial<CustomerFormValues>
  submitLabel?: string
}

export const CustomerForm = ({
  onSubmit,
  onCancel,
  isSubmitting: externalIsSubmitting,
  defaultValues,
  submitLabel = "Guardar Cliente",
}: CustomerFormProps) => {
  const { register, handleSubmit, errors, isSubmitting: internalIsSubmitting } =
    useCustomerForm(onSubmit, defaultValues)

  const isLoading = externalIsSubmitting || internalIsSubmitting

  return (
    <form onSubmit={handleSubmit} className="py-6 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nombre Completo</Label>
        <Input
          id="name"
          placeholder="Ej. Juan Pérez"
          hasError={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <span className="text-xs text-red-500 font-medium">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="ejemplo@correo.com"
          hasError={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <span className="text-xs text-red-500 font-medium">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Teléfono</Label>
        <div className="flex gap-2">
          <Select
            className="w-28 shrink-0"
            hasError={!!errors.countryCode}
            {...register("countryCode")}
          >
            {PHONE_CODES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.code}
              </option>
            ))}
          </Select>
          <Input
            id="phone"
            type="tel"
            className="flex-1"
            placeholder="12345678"
            hasError={!!errors.phone}
            {...register("phone")}
          />
        </div>
        {(errors.countryCode || errors.phone) && (
          <span className="text-xs text-red-500 font-medium">
            {errors.countryCode?.message || errors.phone?.message}
          </span>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          className="button-tertiary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="button-primary"
          isLoading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
