import { useModalStore } from "@/shared/store/useModalStore"
import { Modal } from "@/shared/components/_ui/Modal"
import { Button } from "@/shared/components/form/Button"

interface BlockCustomerModalProps {
  customer: {
    id: string
    name: string
  }
}

import { useBlockCustomer } from "../hooks/useBlockCustomer"

export const BlockCustomerModal = ({ customer }: BlockCustomerModalProps) => {
  const { closeModal } = useModalStore()
  const { mutate: blockCustomer, isPending } = useBlockCustomer()

  const handleBlock = () => {
    blockCustomer(customer.id)
  }

  return (
    <Modal
      title="Bloquear Cliente"
      description={`¿Estás seguro que deseas bloquear a ${customer.name}?`}
      onClose={closeModal}
    >
      <div className="py-6">
        <p className="text-mist-600 dark:text-mist-400">
          El cliente no podrá enterarse, solo le dará error al intentar reservar.
          Esta acción es reversible desde el perfil del cliente.
        </p>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            className="button-tertiary"
            onClick={closeModal}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            className="button-danger"
            onClick={handleBlock}
            isLoading={isPending}
          >
            Bloquear
          </Button>
        </div>
      </div>
    </Modal>
  )
}
