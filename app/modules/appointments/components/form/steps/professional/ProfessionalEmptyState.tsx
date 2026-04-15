import { UserIcon } from "@heroicons/react/24/outline"

export const ProfessionalEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
    <div className="p-4 rounded-full bg-mist-100 dark:bg-mist-900/40 mb-4">
      <UserIcon className="size-8 text-mist-400 dark:text-mist-500" />
    </div>
    <h3 className="text-mist-800 dark:text-mist-200 font-semibold mb-1 text-lg">
      Sin profesionales asignados
    </h3>
    <p className="text-sm text-mist-500 dark:text-mist-400 font-medium max-w-sm">
      Ningún miembro de tu equipo está configurado para brindar este servicio. Por
      favor, asígnales el servicio desde Configuración.
    </p>
  </div>
)
