import { PlusIcon } from "@heroicons/react/24/outline"
import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import type { Customer } from "@/modules/customers/types/customer.types"
import { useAppointmentForm } from "../../../../context/appointment-form.context"

import { CustomerSearchInput } from "./CustomerSearchInput"
import { CustomerList } from "./CustomerList"
import {
  InitialSearchState,
  EmptySearchState,
  SearchLoadingState,
} from "./CustomerSearchStates"

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
      return <SearchLoadingState />
    }

    if (!data || data.length === 0) {
      return <EmptySearchState />
    }

    return <CustomerList customers={data} onSelect={handleNext} />
  }

  return (
    <div className="flex flex-col min-h-full w-full px-3 py-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

      <CustomerSearchInput value={query} onChange={setQuery} />

      <div className="flex-1 overflow-y-auto min-h-0 -mx-8 px-8">
        {renderContent()}
      </div>

      <div className="mt-auto pt-6 border-t border-mist-200 dark:border-mist-800 flex justify-start">
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
