import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useDeleteService } from "../hooks/useDeleteService";
import { useTenantStore } from "@/modules/tenant/store/tenant.store";
import { useModalStore } from "@/shared/store/useModalStore";

interface ActionDropMenuProps {
  serviceId: string;
}

export const ActionDropMenu = ({ serviceId }: { serviceId: string }) => {
  const { currentTenant } = useTenantStore();
  const { openModal } = useModalStore();  
  const { mutate, isPending } = useDeleteService();

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
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          className="gap-2 hover:bg-mist-200/80 dark:hover:bg-mist-800"
          onSelect={(e) => {
            e.preventDefault();
            openModal("serviceUpdate", { serviceId });
          }}
        >
          <PencilSquareIcon className="size-4 opacity-70" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="gap-2 cursor-pointer"
          disabled={isPending}
          onSelect={(e) => {
            e.preventDefault(); // Mantiene el menú activo mientras muestra "Eliminando..."
            mutate(serviceId);
          }}
        >
          <TrashIcon className="size-4 opacity-70" />
          {isPending ? "Eliminando..." : "Eliminar"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
