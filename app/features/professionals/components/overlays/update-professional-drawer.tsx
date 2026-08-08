import { Drawer } from '@/shared/components/ui/drawer';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { ProfessionalBasic } from '../../types/professional.types';
import { Button } from '@/shared/components/ui';

const OVERLAY_KEY: OverlayKey = 'update-professional-drawer';

interface Props {
  professional: ProfessionalBasic;
}

export const UpdateProfessionalDrawer = ({ professional }: Props) => {
  const { close } = useOverlay(OVERLAY_KEY);

  const handleSubmit = () => {
    // TODO: implement update logic
    close();
  };

  return (
    <Drawer overlayKey={OVERLAY_KEY} size="lg" closeOnBackdrop title="Editar Profesional">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          {professional.avatarUrl && (
            <img
              src={professional.avatarUrl}
              alt={professional.displayName}
              className="size-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900">{professional.displayName}</p>
            {professional.email && (
              <p className="text-xs text-gray-500">{professional.email}</p>
            )}
          </div>
        </div>

        {/* TODO: replace with UpdateProfessionalForm */}
        <p className="text-sm text-gray-400 italic">Formulario de edición — pendiente de implementar</p>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={close} className="flex-1">
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={handleSubmit} className="flex-1">
            Guardar cambios
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
