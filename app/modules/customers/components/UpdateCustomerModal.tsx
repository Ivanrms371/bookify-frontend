import { useModalStore } from "@/shared/store/useModalStore"
import { Modal } from "@/shared/components/_ui/Modal"
import { CustomerForm } from "./CustomerForm"
import { useUpdateCustomer } from "../hooks/useUpdateCustomer"
import type { CustomerFormValues } from "../schemas/customer-form.schema"
import type { Customer } from "../types/customer.types"
import { PHONE_CODES } from "../data/phone-codes"

export const UpdateCustomerModal = () => {
  const { closeModal, props } = useModalStore()
  const customer = props?.customer as Customer
  const { mutateAsync: updateCustomer } = useUpdateCustomer()

  if (!customer) return null

  // Utility to split phone number into countryCode and phone
  const getPhoneDetails = (fullPhone: string) => {
    const matchedCode = PHONE_CODES.find((item) =>
      fullPhone.startsWith(item.code),
    )
    if (matchedCode) {
      return {
        countryCode: matchedCode.code,
        phone: fullPhone.replace(matchedCode.code, ""),
      }
    }
    return { countryCode: "+598", phone: fullPhone.replace("+598", "") }
  }

  const { countryCode, phone } = getPhoneDetails(customer.phone)

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      await updateCustomer({
        id: customer.id,
        data: {
          name: data.name,
          email: data.email,
          phone: `${data.countryCode}${data.phone}`,
        },
      })
    } catch (error) {
      console.error("Failed to update customer:", error)
    }
  }

  return (
    <Modal
      title="Editar Cliente"
      description="Actualiza la información del cliente."
      onClose={closeModal}
    >
      <CustomerForm
        onSubmit={onSubmit}
        onCancel={closeModal}
        defaultValues={{
          name: customer.name,
          email: customer.email,
          countryCode,
          phone,
        }}
        submitLabel="Actualizar Cliente"
      />
    </Modal>
  )
}
