import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/shared/components/ui';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import type { CustomerBasic } from '../../types/customer-types';
import { ClipboardDocumentCheckIcon, EyeIcon, NoSymbolIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useOverlay } from '@/shared/hooks/use-overlay';

interface Props {
  customer: CustomerBasic;
}

export const CustomerActions = ({ customer }: Props) => {
  const { open: openUpdateCustomer } = useOverlay('update-customer-drawer');
  const { open: openViewCustomer } = useOverlay('view-customer-drawer');
  const { open: openBlockCustomer } = useOverlay('block-customer-modal');
  const { open: openUnblockCustomer } = useOverlay('unblock-customer-modal');
  const { open: openDeleteCustomer } = useOverlay('delete-customer-modal');

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" type="button" size="icon" className="group-hover:bg-gray-200 hover:bg-gray-200 h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <EllipsisHorizontalIcon className="size-5 text-gray-500" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-[8rem] overflow-hidden rounded-xl border border-gray-100 bg-white p-1 text-gray-600 shadow-xl shadow-gray-200/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <DropdownMenu.Item className="relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 text-gray-800">
            <ClipboardDocumentCheckIcon className="size-4.5" />
            Agendar cita
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 text-gray-800"
            onClick={() => openViewCustomer({ customer })}
          >
            <EyeIcon className="size-4.5" />
            Ver
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 text-gray-800"
            onClick={() => openUpdateCustomer({ customer })}
          >
            <PencilIcon className="size-4.5" />
            Editar
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-gray-100" />

          {customer.blockedAt ? (
            <DropdownMenu.Item
              className="relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors text-red-500 focus:bg-red-50 focus:text-red-600"
              onClick={() => openUnblockCustomer({ customer })}
            >
              <NoSymbolIcon className="size-4.5" />
              Desbloquear
            </DropdownMenu.Item>
          ) : (
            <DropdownMenu.Item
              className="relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors text-red-500 focus:bg-red-50 focus:text-red-600"
              onClick={() => openBlockCustomer({ customer })}
            >
              <NoSymbolIcon className="size-4.5" />
              Bloquear
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item
            className="relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors text-red-500 focus:bg-red-50 focus:text-red-600"
            onClick={() => openDeleteCustomer({ customer })}
          >
            <TrashIcon className="size-4.5" />
            Eliminar
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
