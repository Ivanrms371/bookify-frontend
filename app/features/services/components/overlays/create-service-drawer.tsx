import { useState } from 'react';
import { Drawer } from '@/shared/components/ui/drawer';
import { ServiceForm } from './service-form';
import { useMediaDelete, useMediaUpload } from '@/shared/media';
import { useCreateService } from '../../hooks/use-create-service';
import { toast } from 'sonner';
import type { ServiceFormData } from '../../schemas/service-form-schema';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';

const OVERLAY_KEY: OverlayKey = 'create-service-drawer';

export const CreateServiceDrawer = () => {
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
    <Drawer overlayKey={OVERLAY_KEY} size="xl" closeOnBackdrop title="Nuevo Servicio">
      <ServiceForm onSubmit={onSubmit} onCancel={close} isSubmitting={isSubmitting} />
    </Drawer>
  );
};
