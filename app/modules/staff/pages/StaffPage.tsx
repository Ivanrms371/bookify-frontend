import { Button } from "@/shared/components/form/Button"
import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import { useModalStore } from "@/shared/store/useModalStore"
import { StaffTable } from "../components/StaffTable"

export default function StaffPage() {
  const { openModal } = useModalStore()

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Heading>Staffs</Heading>
          <Paragraph>
            Gestiona el equipo de profesionales de tu negocio.
          </Paragraph>
        </div>
        <Button className="button-primary" onClick={() => openModal("inviteTeam")}>
          + Invitar Staff
        </Button>
      </div>

      <StaffTable />
    </div>
  )
}
