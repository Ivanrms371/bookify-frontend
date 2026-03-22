import { useModalStore } from "@/shared/store/useModalStore";
import { Modal } from "@/shared/components/_ui/Modal";
import { useCreateService } from "../hooks/useCreateService";
import { useBusinessStore } from "@/modules/business/store/business.store";
import type { CreateServiceData } from "../types/service.types";
import { ServiceForm, type ServiceFormSubmitData } from "./ServiceForm";

export const ServiceCreateModal = () => {
  const { closeModal } = useModalStore();
  const currentBusiness = useBusinessStore((s) => s.currentBusiness);
  const { mutateAsync, isPending } = useCreateService(currentBusiness?.id ?? "");

  const onSubmit = async (data: ServiceFormSubmitData) => {
    try {
      const payload: CreateServiceData = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        initialActiveMinutes: data.initialActiveMinutes,
        passiveTimeMinutes: data.passiveTimeMinutes ?? undefined,
        finalActiveMinutes: data.finalActiveMinutes ?? undefined,
        isActive: data.isActive,
        image: data.image,
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
