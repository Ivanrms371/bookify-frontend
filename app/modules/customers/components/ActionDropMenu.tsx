import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  DocumentTextIcon,
  NoSymbolIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import { useModalStore } from "@/shared/store/useModalStore";
import { useUnblockCustomer } from "../hooks/useUnblockCustomer";

interface ActionDropMenuProps {
  customer: {
    id: string;
    name: string;
    blockedAt?: string | null;
  };
}

export function ActionDropMenu({ customer }: ActionDropMenuProps) {
  const { openModal } = useModalStore();
  const { mutate: unblockCustomer } = useUnblockCustomer();

  const isBlocked = !!customer.blockedAt;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-1 rounded-full hover:bg-mist-200 dark:hover:bg-mist-800 cursor-pointer transition-colors"
          type="button"
        >
          <EllipsisHorizontalIcon className="size-6 text-mist-700 dark:text-mist-300" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          className="gap-2"
          onClick={() => openModal("customerProfile", { customer })}
        >
          <EyeIcon className="size-4 opacity-70" />
          Ver perfil
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="gap-2"
          onClick={() => openModal("newAppointment", { initialData: { customer } })}
        >
          <CalendarIcon className="size-4 opacity-70" />
          Nueva cita
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="gap-2"
          onClick={() => openModal("addCustomerNote", { customer })}
        >
          <DocumentTextIcon className="size-4 opacity-70" />
          Añadir nota
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-mist-100 dark:bg-mist-800 mx-1 my-1.5" />
        
        <DropdownMenuItem 
          className="gap-2"
          onClick={() => openModal("updateCustomer", { customer })}
        >
          <PencilSquareIcon className="size-4 opacity-70" />
          Editar cliente
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-mist-100 dark:bg-mist-800 mx-1 my-1.5" />

        {isBlocked ? (
          <DropdownMenuItem 
            className="gap-2"
            onClick={() => unblockCustomer(customer.id)}
          >
            <CheckCircleIcon className="size-4 opacity-70" />
            Desbloquear
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            variant="destructive" 
            className="gap-2"
            onClick={() => openModal("blockCustomer", { customer })}
          >
            <NoSymbolIcon className="size-4 opacity-70" />
            Bloquear
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          variant="destructive" 
          className="gap-2"
          onClick={() => openModal("deleteCustomer", { customer })}
        >
          <TrashIcon className="size-4 opacity-70" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
