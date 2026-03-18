import { Modal } from "@/shared/components/_ui/Modal";
import { useModalStore } from "@/shared/store/useModalStore";
import { Label } from "@/shared/components/form/Label";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button } from "@/shared/components/form/Button";
import { Textarea } from "@/shared/components/form/Textarea";

export const BusinessImagesModal = () => {
  const { closeModal } = useModalStore();

  const onSubmit = () => {};
  return (
    <Modal onClose={closeModal} title="Dale estilo a tu negocio">
      <form onSubmit={onSubmit} className="space-y-4 mt-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="logo">Logo de tu negocio</Label>
          <input type="file" name="" id="logo" className="hidden" />
          <div className="flex gap-4 items-center">
            <label
              htmlFor="logo"
              className="size-15 border-gray-300 dark:border-gray-800 border rounded-full flex justify-center items-center"
            >
              <PhotoIcon className="size-6 text-gray-300 dark:text-gray-600" />
            </label>

            <Button className="button-secondary " type="button" size="sm">
              Subir logo
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1 5">
          <Label htmlFor="image">
            Imagen de portada{" "}
            <span className="text-gray-400 dark:text-gray-500">(opcional)</span>
          </Label>

          <input type="file" className="hidden" id="image" />

          <label
            htmlFor="image"
            className="h-24 border dark:border-gray-800 border-gray-300 border-dashed rounded-xl flex items-center justify-center text-center"
          >
            <div className="flex flex-col items-center">
              <PhotoIcon className="size-8 text-gray-400 dark:text-gray-500" />
              <div className="text-gray-400 text-sm font-medium">
                <span className="text-gray-600 dark:text-gray-200">
                  Subir imágen
                </span>{" "}
                o arrastrar y soltar
              </div>
            </div>
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">
            Descripción{" "}
            <span className="text-gray-400 dark:text-gray-500">(opcional)</span>
          </Label>

          <Textarea placeholder="Una breve descripción sobre lo que ofrece el negocio..." />
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
