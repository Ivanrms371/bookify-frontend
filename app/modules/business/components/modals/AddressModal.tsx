import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/shared/components/_ui/Modal";
import { useModalStore } from "@/shared/store/useModalStore";
import { Label } from "@/shared/components/form/Label";
import { Button } from "@/shared/components/form/Button";
import { Input } from "@/shared/components/form/Input";
import { useBusinessStore } from "@/modules/business/store/business.store";
import { useAddBusinessAddress } from "@/modules/onboarding/hooks/useAddBusinessAddress";

const addressSchema = z.object({
  addressLine1: z.string().min(1, "La calle y número es requerida"),
  addressLine2: z.string().optional(),
  phone: z.string().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export const AddressModal = () => {
  const { closeModal } = useModalStore();
  const currentBusiness = useBusinessStore((state) => state.currentBusiness);
  const { mutate: addAddress, isPending } = useAddBusinessAddress(
    currentBusiness?.id,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressLine1: currentBusiness?.addressLine1 || "",
      addressLine2: currentBusiness?.addressLine2 || "",
      phone: currentBusiness?.phone || "",
    },
  });

  const onSubmit = (data: AddressFormValues) => {
    addAddress(data, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

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
          <Label htmlFor="addressLine2">Complemento</Label>
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
