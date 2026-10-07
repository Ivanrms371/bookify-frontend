import { usePermissions } from '@/core/auth/use-permissions';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/shared/components/ui';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import type { Service } from '../../types/services.types';
import { EyeIcon, EyeSlashIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useOverlay } from '@/shared/hooks/use-overlay';

interface Props {
  service: Service;
}

export const ServiceActions = ({ service }: Props) => {
  const { can } = usePermissions();
  const canUpdate = can('service:update');
  const canDelete = can('service:delete');
  const { open: openUpdateService } = useOverlay('update-service-modal');
  const { open: openToggleStatus } = useOverlay('toggle-service-status-modal');
  const { open: openDeleteService } = useOverlay('delete-service-modal');

  if (!canUpdate && !canDelete) return null;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" type="button" size="icon" className="group-hover:bg-gray-200 hover:bg-gray-100 h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <EllipsisHorizontalIcon className="size-5 text-gray-500" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-32 overflow-hidden rounded-lg border border-gray-100 bg-white p-1 text-gray-600 shadow-xl shadow-gray-200/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          {canUpdate && <DropdownMenu.Item
            className="relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 text-gray-800"
            onClick={() => openUpdateService({ service })}
          >
            <PencilIcon className="size-4.5" />
            Editar
          </DropdownMenu.Item>}

          {canUpdate && <DropdownMenu.Item
            className="relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 text-gray-800"
            onClick={() => openToggleStatus({ service })}
          >
            {service.isActive ? (
              <>
                <EyeSlashIcon className="size-4.5" />
                Desactivar
              </>
            ) : (
              <>
                <EyeIcon className="size-4.5" />
                Activar
              </>
            )}
          </DropdownMenu.Item>}

          {canDelete && <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-gray-100" />}

          {canDelete && <DropdownMenu.Item
            className="relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors text-red-500 focus:bg-red-50 focus:text-red-600"
            onClick={() => openDeleteService({ service })}
          >
            <TrashIcon className="size-4.5" />
            Eliminar
          </DropdownMenu.Item>}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
