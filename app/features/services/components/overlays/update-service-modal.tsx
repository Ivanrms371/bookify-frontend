import { Button } from '@/shared/components/ui';
import { useState, useMemo } from 'react';
import { Modal } from '@/shared/components/ui/modal';
import { ServiceForm } from './service-form';
import { useMediaDelete, useMediaUpload } from '@/shared/media';
import { useUpdateService } from '../../hooks/use-update-service';
import { useServiceProfessionals } from '../../hooks/use-service-professionals';
import { toast } from 'sonner';
import type { ServiceFormData } from '../../schemas/service-form-schema';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { Service } from '../../types/services.types';

const OVERLAY_KEY: OverlayKey = 'update-service-modal';

interface Props {
  service: Service;
}

export const UpdateServiceModal = ({ service }: Props) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutateAsync: upload } = useMediaUpload();
  const { mutateAsync: deleteMedia } = useMediaDelete();
  const { mutateAsync: updateService } = useUpdateService();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: professionals, isLoading, isError, refetch } = useServiceProfessionals(service.id);
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
    <Modal
      overlayKey={OVERLAY_KEY}
      size="2xl"
      closeDisabled={isSubmitting}
      manageFocus
      title="Editar Servicio"
      footer={
        <>
          <Button variant="secondary" type="button" className="w-fit" onClick={close} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="update-service-form"
            className="w-fit"
            isSubmitting={isSubmitting}
            disabled={isLoading || isError}
          >
            Guardar Cambios
          </Button>
        </>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando datos del servicio...</p>
        </div>
      ) : isError ? (
        <div className="space-y-3 py-8 text-center" role="alert">
          <p>No se pudo cargar el personal asignado.</p>
          <Button variant="secondary" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : (
        <ServiceForm
          formId="update-service-form"
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          defaultValues={defaultValues}
          previewImageUrl={service.imageUrl ?? undefined}
        />
      )}
    </Modal>
  );
};
