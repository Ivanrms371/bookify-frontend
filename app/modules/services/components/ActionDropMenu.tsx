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

export function ActionDropMenu() {
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
        <DropdownMenuItem className="gap-2">
          <PencilSquareIcon className="size-4 opacity-70" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" className="gap-2">
          <TrashIcon className="size-4 opacity-70" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
