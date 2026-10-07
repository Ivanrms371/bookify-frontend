import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui/button';

interface Props {
  pending: boolean;
  stay: () => void;
  leave: () => void;
}

export function SettingsLeaveModal({ pending, stay, leave }: Props) {
  return (
    <Modal
      overlayKey="settings-leave-modal"
      title={pending ? 'Guardando cambios' : '¿Descartar los cambios?'}
      manageFocus
      onClose={stay}
      footer={
        <>
          <Button variant="secondary" onClick={stay}>
            Seguir aquí
          </Button>
          {!pending && (
            <Button variant="danger" onClick={leave}>
              Descartar y salir
            </Button>
          )}
        </>
      }
    >
      <p className="text-gray-600">
        {pending
          ? 'Espera a que termine la operación antes de salir.'
          : 'Tienes cambios sin guardar en Configuración. Si sales, se perderán.'}
      </p>
    </Modal>
  );
}
