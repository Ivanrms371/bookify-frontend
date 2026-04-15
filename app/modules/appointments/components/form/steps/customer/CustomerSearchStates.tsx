import { UsersIcon } from "@heroicons/react/24/outline"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"

export const InitialSearchState = () => (
  <div className="flex flex-col rounded-4xl bg-white dark:bg-transparent p-6">
    <div className="flex flex-col items-center justify-center py-4 gap-4">
      <div className="p-4 rounded-full bg-mist-100 dark:bg-mist-900/40">
        <UsersIcon className="size-6 text-mist-400 dark:text-mist-500" />
      </div>
      <div className="text-center flex flex-col items-center">
        <h3 className="text-mist-800 dark:text-mist-200 font-semibold mb-1 text-lg">
          Buscando clientes
        </h3>
        <p className="text-sm text-mist-500 dark:text-mist-400 font-medium max-w-sm mb-6">
          Escribe el nombre, email o teléfono del cliente.
        </p>
      </div>
    </div>
  </div>
)

export const EmptySearchState = () => (
  <div className="flex flex-col rounded-4xl bg-white dark:bg-transparent p-6">
    <div className="flex flex-col items-center justify-center py-4 gap-4">
      <div className="p-4 rounded-full bg-mist-100 dark:bg-mist-900/40">
        <UsersIcon className="size-6 text-mist-400 dark:text-mist-500" />
      </div>
      <div className="text-center flex flex-col items-center">
        <h3 className="text-mist-800 dark:text-mist-200 font-semibold mb-1 text-lg">
          No hemos encontrado coincidencias
        </h3>
        <p className="text-sm text-mist-500 dark:text-mist-400 font-medium max-w-sm mb-6">
          Puedes intentar con otros datos o crear un nuevo cliente.
        </p>
      </div>
    </div>
  </div>
)

export const SearchLoadingState = () => (
  <div className="flex justify-center items-center h-40">
    <LoadingSpinner size="md" />
  </div>
)
