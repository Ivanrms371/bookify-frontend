import { Modal } from "@/shared/components/_ui/Modal"
import { Button } from "@/shared/components/form/Button"
import { useModalStore } from "@/shared/store/useModalStore"
import { useDeleteCustomer } from "../hooks/useDeleteCustomer"
import { TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"

export const DeleteCustomerModal = () => {
  const { props, closeModal } = useModalStore()
  const customer = props?.customer
  const { mutate: deleteCustomer, isPending } = useDeleteCustomer()

  const handleDelete = () => {
    if (!customer?.id) return
    deleteCustomer(customer.id, {
      onSuccess: () => {
        closeModal()
      },
    })
  }

  if (!customer) return null

  return (
    <Modal
      onClose={closeModal}
      title="Eliminar cliente"
      description="¿Estás seguro de que deseas eliminar este cliente?"
      className="max-w-md p-8"
    >
      <div className="flex flex-col gap-6 pt-4">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
          <ExclamationTriangleIcon className="size-6 text-amber-600 dark:text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Esta acción ocultará al cliente de tu lista principal. Podrás
            recuperarlo si es necesario.
          </p>
        </div>

        <div className="flex flex-col gap-1 px-1">
          <span className="text-xs font-semibold text-mist-400 uppercase tracking-wider">
            Cliente a eliminar
          </span>
          <span className="text-lg font-medium text-mist-900 dark:text-mist-100">
            {customer.name}
          </span>
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <Button
            onClick={closeModal}
            className="bg-mist-100 hover:bg-mist-200 dark:bg-mist-900 dark:hover:bg-mist-800 text-mist-700 dark:text-mist-300 rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            isLoading={isPending}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/20 px-8"
          >
            <TrashIcon className="size-4 mr-1" />
            Eliminar Cliente
          </Button>
        </div>
      </div>
    </Modal>
  )
}
