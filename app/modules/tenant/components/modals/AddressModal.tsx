import { Modal } from "@/shared/components/_ui/Modal";
import { Label } from "@/shared/components/form/Label";
import { Button } from "@/shared/components/form/Button";
import { Input } from "@/shared/components/form/Input";
import { useAddressForm } from "@/modules/tenant/hooks/useAddressForm";

export const AddressModal = () => {
  const { form, onSubmit, isPending, closeModal } = useAddressForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Modal onClose={closeModal} title="Agregar dirección del negocio">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="addressLine1">Calle y número</Label>
          <Input
            id="addressLine1"
            placeholder="Avda Italia 1234"
            {...register("addressLine1")}
            hasError={!!errors.addressLine1}
          />
          {errors.addressLine1 && (
            <span className="text-red-500 text-sm">
              {errors.addressLine1.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="addressLine2">Información Adicional</Label>
          <Input
            id="addressLine2"
            placeholder="Piso, oficina, etc, información adicional"
            {...register("addressLine2")}
            hasError={!!errors.addressLine2}
          />
          {errors.addressLine2 && (
            <span className="text-red-500 text-sm">
              {errors.addressLine2.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Teléfono del Local</Label>
          <Input
            id="phone"
            placeholder="+598 99 123 456"
            {...register("phone")}
            hasError={!!errors.phone}
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button
            type="button"
            className="button-tertiary"
            onClick={closeModal}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="button-primary"
            isLoading={isPending}
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};
