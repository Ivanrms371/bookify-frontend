import { Button } from '@/shared/components/ui';
import { useState } from 'react';
import { Modal } from '@/shared/components/ui/modal';
import { ServiceForm } from './service-form';
import { useMediaDelete, useMediaUpload } from '@/shared/media';
import { useCreateService } from '../../hooks/use-create-service';
import { toast } from 'sonner';
import type { ServiceFormData } from '../../schemas/service-form-schema';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';

const OVERLAY_KEY: OverlayKey = 'create-service-modal';

export const CreateServiceModal = () => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutateAsync: uploadMedia } = useMediaUpload();
  const { mutateAsync: deleteMedia } = useMediaDelete();
  const { mutateAsync: createService } = useCreateService();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    let uploadedPublicId: string | undefined;

    try {
      let imageUrl: string | undefined;

      if (data.image) {
        const result = await uploadMedia({ file: data.image, type: 'service' });
        imageUrl = result.url;
        uploadedPublicId = result.publicId;
      }

      const { image, ...payload } = data;
      await createService({
        ...payload,
        discountPercentage: payload.discountPercentage ?? null,
        discountFixed: payload.discountFixed ?? null,
        imageUrl,
        imagePublicId: uploadedPublicId,
      });

      toast.success('Servicio creado con éxito');
      close();
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al crear el servicio');

      if (uploadedPublicId) {
        await deleteMedia(uploadedPublicId).catch(() => null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      overlayKey={OVERLAY_KEY}
      size="3xl"
      closeDisabled={isSubmitting}
      manageFocus
      title="Nuevo Servicio"
      footer={
        <>
          <Button variant="secondary" type="button" className="w-fit" onClick={close} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" form="create-service-form" className="w-fit" isSubmitting={isSubmitting}>
            Crear Servicio
          </Button>
        </>
      }
    >
      <ServiceForm formId="create-service-form" onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </Modal>
  );
};
