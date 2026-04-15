
import { useModalStore } from "@/shared/store/useModalStore";
import { Modal } from "@/shared/components/_ui/Modal";
import { useUpdateService } from "../hooks/useUpdateService";
import { ServiceForm } from "./ServiceForm";
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner";
import type { UpdateServiceInput } from "../types/service-update.type";
import { useService } from "../hooks/useService";
import { useStaffs } from "@/modules/staff/hooks/useStaffs";
import type { ServiceFormInput } from "../schemas/service-form.schema";

export const ServiceUpdateModal = () => {
  const { closeModal, props } = useModalStore();
  const serviceId = props?.serviceId as string;

  const { data: staffs } = useStaffs();
  const { data: service, isPending: isLoading } = useService(serviceId);
  const { mutateAsync, isPending: isUpdating } = useUpdateService(serviceId);

  const onSubmit = async (data: ServiceFormInput) => {
    try {
      if (!serviceId) return;

      console.log(data);

      const payload: UpdateServiceInput  = {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        initialActiveMinutes: data.initialActiveMinutes,
        isActive: data.isActive,
        staffIds: data.staffIds,
      };

      await mutateAsync(payload);
      closeModal();
    } catch (error) {
      console.error("Failed to update service:", error);
    }
  };

  return (
    <Modal
      onClose={closeModal}
      title="Editar Servicio"
      description="Edita un servicio existente."
    >
     
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ServiceForm
            defaultValues={{
              name: service?.name,
              description: service?.description ?? "",
              price: service?.price.toString(),
              initialActiveMinutes: service?.durationMinutes,
              isActive: service?.isActive,
              staffIds: service?.staffIds
            }}
            onSubmit={onSubmit}
            staffs={staffs}
            isPending={isLoading}
            onCancel={closeModal}
            isEdit={true}
            imageUrl={service?.image}
          />
        )}
    </Modal>
  );
};
