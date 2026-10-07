import { can } from '@/core/auth/permissions';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/shared/components/ui';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { EyeIcon, EyeSlashIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { useAuthStore } from '@/core/auth/use-auth-store';
import type { ProfessionalBasic } from '../../types/professional.types';

interface Props {
  professional: ProfessionalBasic;
}

export const ProfessionalActions = ({ professional }: Props) => {
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const canUpdateStatus = can(tenant, 'professional:update');
  const canDelete = can(tenant, 'professional:delete');
  const { open: openStatus } = useOverlay('update-professional-status-modal');
  const ownProfessionalId = useAuthStore((state) => state.session?.activeTenant?.professionalId);
  const isSelf = professional.id === ownProfessionalId;
  const { open: openUpdateProfessional } = useOverlay('update-professional-drawer');
  const { open: openDeleteProfessional } = useOverlay('delete-professional-modal');

  if (!canUpdateStatus && !canDelete) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" type="button" size="icon">
          <span className="sr-only">Abrir menú</span>
          <EllipsisHorizontalIcon className="size-5 text-gray-500" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-32 overflow-hidden rounded-lg border border-gray-100 bg-white p-1 text-gray-600 shadow-xl shadow-gray-200/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          {canUpdateStatus && <DropdownMenu.Item
            className="relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 text-gray-800"
            onClick={() => openUpdateProfessional({ professional })}
          >
            <PencilIcon className="size-4.5" />
            Editar
          </DropdownMenu.Item>}

          {canUpdateStatus && (
            <DropdownMenu.Item
              className="relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 text-gray-800"
              onSelect={() => openStatus({ professional })}
            >
              {professional.isActive ? <EyeSlashIcon className="size-4.5" /> : <EyeIcon className="size-4.5" />}
              {professional.isActive ? 'Desactivar' : 'Activar'}
            </DropdownMenu.Item>
          )}

          {canDelete && !isSelf && (
            <>
              <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-gray-100" />

              <DropdownMenu.Item
                className="relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors text-red-500 focus:bg-red-50 focus:text-red-600"
                onClick={() => openDeleteProfessional({ professional })}
              >
                <TrashIcon className="size-4.5" />
                Eliminar
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export const ProfessionalsActions = ProfessionalActions;
