import { useModalStore } from "@/shared/store/useModalStore";
import { Modal } from "@/shared/components/_ui/Modal";
import { useCreateService } from "../hooks/useCreateService";
import { useTenantStore } from "@/modules/tenant/store/tenant.store";
import { ServiceForm } from "./ServiceForm";
import { useStaffs } from "@/modules/staff/hooks/useStaffs";
import type { ServiceFormInput } from "../schemas/service-form.schema";
import type { CreateServiceInput } from "../types/service-create.type";

export const ServiceCreateModal = () => {
  const { closeModal } = useModalStore();
  const currentTenant = useTenantStore((s) => s.currentTenant);
  const { mutateAsync, isPending } = useCreateService(currentTenant?.id ?? "");
  const { data: staffs } = useStaffs();

  const onSubmit = async (data: ServiceFormInput) => {
    try {
      const payload: CreateServiceInput = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        initialActiveMinutes: data.initialActiveMinutes,
        isActive: data.isActive,
        image: data.image,
        staffIds: data.staffIds,
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
        staffs={staffs}
        onSubmit={onSubmit}
        isPending={isPending}
        onCancel={closeModal}
        isEdit={false}
      />
    </Modal>
  );
};
