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
} from "@heroicons/react/24/outline";

import { useModalStore } from "@/shared/store/useModalStore";
import type { Staff } from "../types/staff.type";

interface ActionDropMenuProps {
  staff: Staff;
}

export function ActionDropMenu({ staff }: ActionDropMenuProps) {
  const { openModal } = useModalStore();

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
          onClick={() => {}}
        >
          <PencilSquareIcon className="size-4 opacity-70" />
          Editar miembro
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-mist-100 dark:bg-mist-800 mx-1 my-1.5" />

        <DropdownMenuItem 
          variant="destructive" 
          className="gap-2"
          onClick={() => {}}
        >
          <TrashIcon className="size-4 opacity-70" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
