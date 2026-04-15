import { Button } from "@/shared/components/form/Button"
import { CustomersTable } from "../components/CustomersTable"
import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import { useModalStore } from "@/shared/store/useModalStore"

export default function CustomersPage() {
  const { openModal } = useModalStore()

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Heading>Clientes</Heading>
          <Paragraph>
            Gestiona tu cartera de clientes y su historial de visitas.
          </Paragraph>
        </div>
        <Button className="button-primary" onClick={() => openModal("newCustomer")}>
          + Nuevo Cliente
        </Button>
      </div>

      <CustomersTable />
    </div>
  )
}
