import { Modal } from "@/shared/components/_ui/Modal";
import { Button } from "@/shared/components/form/Button";
import { useModalStore } from "@/shared/store/useModalStore";
import { useBusinessStore } from "@/modules/business/store/business.store";
import { usePublishBusiness } from "@/modules/business/hooks/usePublishBusiness";

export const PublishBusinessModal = () => {
  const { closeModal } = useModalStore();
  const currentBusiness = useBusinessStore((s) => s.currentBusiness);
  const { mutate: publishBusiness, isPending } = usePublishBusiness(
    currentBusiness?.id,
  );

  const handlePublish = () => {
    publishBusiness(undefined, {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <Modal
      onClose={closeModal}
      title="Publicar negocio"
      description="Al publicar tu negocio, este será visible para tus clientes y podrán empezar a reservar"
    >
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
          type="button"
          className="button-primary"
          onClick={handlePublish}
          isLoading={isPending}
          disabled={isPending}
        >
          Publicar
        </Button>
      </div>
    </Modal>
  );
};
