import { Modal } from "@/shared/components/_ui/Modal";
import { useModalStore } from "@/shared/store/useModalStore";
import { Label } from "@/shared/components/form/Label";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button } from "@/shared/components/form/Button";
import { Input } from "@/shared/components/form/Input";

export const AddressModal = () => {
  const { closeModal } = useModalStore();

  const onSubmit = () => {};
  return (
    <Modal onClose={closeModal} title="Agregar dirección del negocio">
      <form onSubmit={onSubmit} className="space-y-4 mt-6">
        <div className="flex flex-col gap-1.5">
          <Label>Calle y número</Label>
          <Input placeholder="Avda Italia 1234" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Complemento</Label>
          <Input placeholder="Piso, oficina, etc, información adicional" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Teléfono del Local</Label>
          <Input placeholder="+598 99 123 456" />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button
            type="button"
            className="button-tertiary"
            onClick={closeModal}
          >
            Cancelar
          </Button>
          <Button type="submit" className="button-primary">
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};
