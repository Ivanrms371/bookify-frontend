import {
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon,
  ArrowRightIcon,
  UsersIcon,
} from "@heroicons/react/24/outline"
import { Input } from "@/shared/components/form/Input"
import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import type { Customer } from "@/modules/customers/types/customer.types"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"
import { useAppointmentForm } from "../../../context/appointment-form.context"

const InitialSearchState = () => (
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

const EmptySearchState = () => (
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

const CustomerList = ({
  customers,
  onSelect,
}: {
  customers: Customer[]
  onSelect: (c: Customer) => void
}) => (
  <ul className="grid divide-y divide-mist-200 dark:divide-mist-900/70">
    {customers.map((client) => (
      <li
        key={client.id}
        onClick={() => onSelect(client)}
        className="group flex flex-col items-start gap-4 py-3 px-4 transition-all duration-300 text-left relative overflow-hidden cursor-pointer hover:bg-mist-100 dark:hover:bg-mist-900/50 rounded-xl"
      >
        <div className="flex items-center w-full justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-mist-200 dark:bg-mist-900">
              <UserIcon className="size-6 text-mist-400 dark:text-mist-500" />
            </div>
            <div>
              <div className="font-semibold text-mist-900 dark:text-white transition-colors">
                {client.name}
              </div>
              <span className="text-sm font-medium text-mist-500 dark:text-mist-400 mt-0.5 block">
                {client.email} &bull; {client.phone}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-full bg-mist-200 dark:bg-mist-900 dark:group-hover:bg-mist-800 flex items-center justify-center text-mist-700 dark:text-mist-400 transition-all duration-300 group-hover:translate-x-1">
            <ArrowRightIcon className="size-5" />
          </div>
        </div>
      </li>
    ))}
  </ul>
)

export const CustomerSelectionStep = () => {
  const { onNext, setCustomer, query, setQuery, customers } =
    useAppointmentForm()

  const handleNext = (customer: Customer) => {
    setCustomer(customer)
    onNext()
  }

  const { data, isPending } = customers

  const renderContent = () => {
    if (query.length < 3 && (!data || data.length === 0)) {
      return <InitialSearchState />
    }

    if (isPending) {
      return (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner size="md" />
        </div>
      )
    }

    if (!data || data.length === 0) {
      return <EmptySearchState />
    }

    return <CustomerList customers={data} onSelect={handleNext} />
  }

  return (
    <div className="flex flex-col flex-1 w-full px-3 py-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="shrink-0 mb-8 flex items-start gap-4">
        <div>
          <Heading
            as="h3"
            className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white"
          >
            Selecciona el Cliente
          </Heading>
          <Paragraph className="mt-2 text-lg text-mist-500">
            Busca por nombre, email o teléfono. También puedes crear uno nuevo.
          </Paragraph>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8 shrink-0">
        <MagnifyingGlassIcon className="h-6 w-6 text-mist-400 group-focus-within:text-indigo-500 transition-colors" />

        <Input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 -mx-8 px-8">
        {renderContent()}
      </div>

      <div className="flex gap-2 items-end mt-4">
        <button
          type="button"
          className="flex w-full items-center gap-2 justify-center border py-2 px-4 rounded-full border-mist-300 dark:border-mist-700 border-dashed text-mist-700 dark:text-mist-200 font-medium hover:bg-mist-50 dark:hover:bg-mist-800/50 hover:border-mist-400 dark:hover:border-mist-500 hover:text-mist-900 dark:hover:text-white transition-all duration-200 cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          Agregar nuevo cliente
        </button>
      </div>
    </div>
  )
}
