import { Modal } from "@/shared/components/_ui/Modal";
import { Button } from "@/shared/components/form/Button";
import { useModalStore } from "@/shared/store/useModalStore";

export const PublishBusinessModal = () => {
  const { closeModal } = useModalStore();
  return (
    <Modal
      onClose={closeModal}
      title="Publicar negocio"
      description="Al publicar tu negocio, esté será visible para tus clientes y podrán empezar a reservar"
    >
      <div className="pt-4 flex justify-end gap-3">
        <Button type="button" className="button-tertiary" onClick={closeModal}>
          Cancelar
        </Button>
        <Button type="submit" className="button-primary">
          Publicar
        </Button>
      </div>
    </Modal>
  );
};
