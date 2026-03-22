import * as React from "react";
import { Modal } from "@/shared/components/_ui/Modal";
import { ModalHeader } from "@/shared/components/_ui/ModalHeader";
import { ModalFooter } from "@/shared/components/_ui/ModalFooter";

// Assuming we have these components or we'll wrap them inside here later.
// For now, these are placeholder imports. We will render dynamic content.

interface OnboardingActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: "workingHours" | "service" | "team" | "published" | null;
}

export const OnboardingActionModal = ({
  isOpen,
  onClose,
  action,
}: OnboardingActionModalProps) => {
  const getModalContent = () => {
    switch (action) {
      case "workingHours":
        return {
          title: "Configurar horarios de trabajo",
          description:
            "Establece los días y horas en los que tu negocio está abierto.",
          // Content component here...
        };
      case "service":
        return {
          title: "Agregar primer servicio",
          description:
            "Crea tu primer servicio para que los clientes puedan reservar.",
          // Content component here...
        };
      case "team":
        return {
          title: "Invitar a tu equipo",
          description: "Añade a los miembros de tu equipo a Turnify.",
          // Content component here...
        };
      case "published":
        return {
          title: "Publicar Negocio",
          description: "¿Estás seguro de que deseas hacer público tu negocio?",
          // Content component here...
        };
      default:
        return {
          title: "",
          description: "",
        };
    }
  };

  const content = getModalContent();

  if (!action) return null;

  return (
    <Modal onClose={onClose}>
      <ModalHeader title={content.title} description={content.description} />

      <div className="py-4 text-mist-700 dark:text-mist-300">
        <p>Contenido para la acción: {action}</p>
        <p className="text-sm mt-2">Aquí irá el formulario correspondiente.</p>
      </div>

      <ModalFooter>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-mist-300 dark:border-mist-700 rounded-lg text-sm font-medium hover:bg-mist-100 dark:hover:bg-mist-800 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-mist-600 hover:bg-mist-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Confirmar
        </button>
      </ModalFooter>
    </Modal>
  );
};
