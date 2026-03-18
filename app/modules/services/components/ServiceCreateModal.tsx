import { useModalStore } from "@/shared/store/useModalStore";
import { Modal } from "@/shared/components/_ui/Modal";
import { useCreateService } from "../hooks/useCreateService";
import { useBusinessStore } from "@/modules/business/store/business.store";
import type { CreateServiceData } from "../api/service.api";
import { ServiceForm, type ServiceFormValues } from "./ServiceForm";

export const ServiceCreateModal = () => {
  const { isOpen, type, closeModal } = useModalStore();
  const { currentBusiness } = useBusinessStore();
  const { mutateAsync, isPending } = useCreateService(
    currentBusiness?.id || "",
  );

  // We are relying on the GlobalModalProvider to respect the rules, but we can keep standard safety checks.

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      const payload: CreateServiceData = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        initialActiveMinutes: data.initialActiveMinutes,
        passiveTimeMinutes: data.passiveTimeMinutes || undefined,
        finalActiveMinutes: data.finalActiveMinutes || undefined,
        isActive: data.isActive,
      };
      await mutateAsync(payload);
      closeModal();
    } catch (error) {
      console.error("Failed to create service:", error);
    }
  };

  return (
    <Modal
      onClose={closeModal}
      title="Agregar Servicio"
      description="Crea un nuevo servicio para tu negocio."
    >
      <ServiceForm
        onSubmit={onSubmit}
        isPending={isPending}
        onCancel={closeModal}
        submitLabel="Guardar Servicio"
      />
    </Modal>
  );
};
