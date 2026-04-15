import { Button } from "@/shared/components/form/Button"
import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import { CalendarSection } from "../components/CalendarSection"
import { useModalStore } from "@/shared/store/useModalStore"

export default function CalendarPage() {
  const { openModal } = useModalStore()
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <Heading as="h1" className="mt-2">
            Calendario
          </Heading>

          <Paragraph className="mb-4">
            Aquí puedes ver tus citas y gestionarlas.
          </Paragraph>
        </div>

        <Button
          className="button-primary"
          onClick={() => openModal("newAppointment")}
        >
          + Nueva Cita
        </Button>
      </div>

      <CalendarSection />
    </>
  )
}
