import { useState, useEffect } from "react"
import { Modal } from "@/shared/components/_ui/Modal"
import { useModalStore } from "@/shared/store/useModalStore"
import { useTenant } from "@/shared/context/tenant.context"
import { useCustomer } from "../hooks/useCustomer"
import { useUpdateCustomerNotes } from "../hooks/useUpdateCustomerNotes"
import { Button } from "@/shared/components/form/Button"
import { DocumentTextIcon } from "@heroicons/react/24/outline"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"
import { Label } from "@/shared/components/form/Label"
import { Textarea } from "@/shared/components/form/Textarea"

export const AddCustomerNoteModal = () => {
  const { closeModal, props } = useModalStore()
  const { tenantId } = useTenant()
  const customerId = props?.customer?.id
  
  // We fetch latest data to avoid overwriting or starting with empty notes
  const { data: customer, isLoading } = useCustomer(tenantId, customerId)
  
  const [notes, setNotes] = useState("")
  
  // Sync notes when customer data is loaded
  useEffect(() => {
    if (customer?.notes) {
      setNotes(customer.notes)
    }
  }, [customer])
  
  const { mutate: updateNotes, isPending } = useUpdateCustomerNotes()

  const handleSave = () => {
    if (!customerId) return
    
    updateNotes(
      { tenantId, customerId, notes },
      {
        onSuccess: () => {
          closeModal()
        },
      }
    )
  }

  return (
    <Modal 
      title="Añadir Nota"
      description={`Registra una nota para ${customer?.name || "el cliente"}. Solo el personal podrá verla.`}
      onClose={closeModal}
    >
      <form className="flex flex-col gap-6 pt-4 pb-2">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">
              Nota
            </Label>
            <div className="relative">
              <Textarea
                id="notes"
                className="w-full h-40 "
                placeholder="Escribe aquí las observaciones sobre el cliente..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                autoFocus
              />
              <div className="absolute top-4 right-4 text-mist-300 dark:text-mist-700 pointer-events-none">
                <DocumentTextIcon className="size-5" />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button 
            className="button-tertiary" 
            onClick={closeModal}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button 
            className="button-primary" 
            onClick={handleSave}
            disabled={isPending || isLoading}
          >
            {isPending ? "Guardando..." : "Guardar Nota"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
