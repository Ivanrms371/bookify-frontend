import type { OverlayKey } from '@/shared/components/overlays';
import { Button, Modal } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { ProfessionalForm } from './professional-form';
import type { ProfessionalFormValues } from '../../schemas/professional-form-schema';

export const CreateProfessionalModalKey: OverlayKey = 'create-professional-modal';
export const CreateProfessionalFormId = 'create-professional-form';

export const CreateProfessionalModal = () => {
  const { close } = useOverlay(CreateProfessionalModalKey);

  const onSubmit = (data: ProfessionalFormValues) => {
    // TODO: implement useCreateProfessional mutation
    console.log('Professional data:', data);
    close();
  };

  return (
    <Modal
      overlayKey={CreateProfessionalModalKey}
      title="Nuevo Profesional"
      size="xl"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={close}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" form={CreateProfessionalFormId}>
            Crear Profesional
          </Button>
        </>
      }
    >
      <ProfessionalForm onSubmit={onSubmit} submitLabel="Crear Profesional" onCancel={close} />
    </Modal>
  );
};
