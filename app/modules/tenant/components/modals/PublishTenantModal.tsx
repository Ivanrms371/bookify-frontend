import { Modal } from "@/shared/components/_ui/Modal";
import { Button } from "@/shared/components/form/Button";
import { useModalStore } from "@/shared/store/useModalStore";
import { useTenantStore } from "@/modules/tenant/store/tenant.store";
import { usePublishTenant } from "@/modules/tenant/hooks/usePublishTenant";

export const PublishTenantModal = () => {
  const { closeModal } = useModalStore();
  const currentTenant = useTenantStore((s) => s.currentTenant);
  const { mutate: publishTenant, isPending } = usePublishTenant(
    currentTenant?.id,
  );

  const handlePublish = () => {
    publishTenant(undefined, {
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
