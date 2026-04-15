import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTenantStore } from "@/modules/tenant/store/tenant.store";
import { useAddTenantAddress } from "@/modules/onboarding/hooks/useAddTenantAddress";
import { useModalStore } from "@/shared/store/useModalStore";

export const addressSchema = z.object({
  addressLine1: z.string().min(1, "La calle y número es requerida"),
  addressLine2: z.string().optional(),
  phone: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export function useAddressForm() {
  const { closeModal } = useModalStore();
  const currentTenant = useTenantStore((state) => state.currentTenant);
  const { mutate: addAddress, isPending } = useAddTenantAddress(
    currentTenant?.id,
  );

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressLine1: currentTenant?.addressLine1 || "",
      addressLine2: currentTenant?.addressLine2 || "",
      phone: currentTenant?.phone || "",
    },
  });

  const onSubmit = (data: AddressFormValues) => {
    addAddress(data, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  return {
    form,
    onSubmit,
    isPending,
    closeModal,
  };
}
