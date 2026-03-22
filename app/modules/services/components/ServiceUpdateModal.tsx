import { useModalStore } from "@/shared/store/useModalStore";
import { Modal } from "@/shared/components/_ui/Modal";
import { useCreateService } from "../hooks/useCreateService";
import { useBusinessStore } from "@/modules/business/store/business.store";
import type { CreateServiceData } from "../types/service.types";
import { ServiceForm, type ServiceFormValues } from "./ServiceForm";

export const ServiceUpdateModal = () => {
  const { closeModal } = useModalStore();
  const { currentBusiness } = useBusinessStore();
  const { mutateAsync, isPending } = useCreateService(
    currentBusiness?.id || "",
  );

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
      title="Editar Servicio"
      description="Edita un servicio existente."
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
