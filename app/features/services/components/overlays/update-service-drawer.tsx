import { useState, useMemo } from 'react';
import { Drawer } from '@/shared/components/ui/drawer';
import { ServiceForm } from './service-form';
import { useMediaDelete, useMediaUpload } from '@/shared/media';
import { useUpdateService } from '../../hooks/use-update-service';
import { useServiceProfessionals } from '../../hooks/use-service-professionals';
import { toast } from 'sonner';
import type { ServiceFormData } from '../../schemas/service-form-schema';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { Service } from '../../types/services.types';

const OVERLAY_KEY: OverlayKey = 'update-service-drawer';

interface Props {
  service: Service;
}

export const UpdateServiceDrawer = ({ service }: Props) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutateAsync: upload } = useMediaUpload();
  const { mutateAsync: deleteMedia } = useMediaDelete();
  const { mutateAsync: updateService } = useUpdateService();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: professionals, isLoading } = useServiceProfessionals(service.id);
  const professionalIds = professionals?.map((p) => p.id) || [];

  const defaultValues: Partial<ServiceFormData> = useMemo(() => {
    return {
      ...service,
      durationMinutes: Number(service.durationMinutes),
      price: Number(service.price),
      discountPercentage:
        service.discountPercentage !== null && service.discountPercentage !== undefined ? Number(service.discountPercentage) : null,
      discountFixed: service.discountFixed !== null && service.discountFixed !== undefined ? Number(service.discountFixed) : null,
      professionalIds,
    };
  }, [service, professionalIds]);

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    let newPublicId: string | undefined;

    try {
      let imageUrl = service.imageUrl || undefined;
      let imagePublicId = service.imagePublicId || undefined;

      if (data.image && data.image instanceof File) {
        const uploadResult = await upload({ file: data.image, type: 'service' });
        imageUrl = uploadResult.url;
        newPublicId = uploadResult.publicId;
        imagePublicId = uploadResult.publicId;
      }

      const { image, ...payload } = data;
      await updateService({
        id: service.id,
        data: { ...payload, imageUrl, imagePublicId },
      });

      if (data.image && service.imagePublicId) {
        deleteMedia(service.imagePublicId);
      }

      toast.success('Servicio actualizado con éxito');
      close();
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al actualizar el servicio');
      if (newPublicId) {
        deleteMedia(newPublicId).catch(() => null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer overlayKey={OVERLAY_KEY} size="xl" closeOnBackdrop title="Editar Servicio">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando datos del servicio...</p>
        </div>
      ) : (
        <ServiceForm
          onSubmit={onSubmit}
          onCancel={close}
          isSubmitting={isSubmitting}
          defaultValues={defaultValues}
          previewImageUrl={service.imageUrl ?? undefined}
          submitLabel="Guardar Cambios"
        />
      )}
    </Drawer>
  );
};
