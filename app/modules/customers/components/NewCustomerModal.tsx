import { useModalStore } from "@/shared/store/useModalStore"
import { Modal } from "@/shared/components/_ui/Modal"
import { CustomerForm } from "./CustomerForm"
import { useCreateCustomer } from "../hooks/useCreateCustomer"
import type { CustomerFormValues } from "../schemas/customer-form.schema"

export const NewCustomerModal = () => {
  const { closeModal } = useModalStore()
  const { mutateAsync: createCustomer } = useCreateCustomer()

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      await createCustomer({
        name: data.name,
        email: data.email,
        phone: `${data.countryCode}${data.phone}`,
      })
    } catch (error) {
      console.error("Failed to create customer:", error)
    }
  }

  return (
    <Modal
      title="Crear Nuevo Cliente"
      description="Ingresa los datos del cliente para registrarlo en el sistema."
      onClose={closeModal}
    >
      <CustomerForm 
        onSubmit={onSubmit} 
        onCancel={closeModal} 
      />
    </Modal>
  )
}
