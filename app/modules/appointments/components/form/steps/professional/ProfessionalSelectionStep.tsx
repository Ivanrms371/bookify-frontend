import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import { Button } from "@/shared/components/form/Button"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"
import type { Staff } from "@/modules/staff/types/staff.type"
import { useAppointmentForm } from "../../../../context/appointment-form.context"
import { ProfessionalList } from "./ProfessionalList"
import { ProfessionalEmptyState } from "./ProfessionalEmptyState"

export const ProfessionalSelectionStep = () => {
  const { onBack, onNext, setStaff, staffs, staffsQuery } = useAppointmentForm()
  const { isPending } = staffsQuery

  const handleNext = (staff: Staff) => {
    setStaff(staff)
    onNext()
  }

  console.log(staffs)
    

  return (
    <div className="flex flex-col min-h-full w-full px-3 py-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="shrink-0 mb-8 flex items-start gap-4">
        <div>
          <Heading
            as="h3"
            className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white"
          >
            Selecciona el Profesional
          </Heading>
          <Paragraph className="mt-2 text-lg text-mist-500">
            ¿Quién atenderá al cliente en esta cita?
          </Paragraph>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 -mx-8 px-8">
        {isPending ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner size="md" />
          </div>
        ) : staffs.length > 0 ? (
          <ProfessionalList staffs={staffs} onSelect={handleNext} />
        ) : (
          <ProfessionalEmptyState />
        )}
      </div>

      <div className="mt-auto pt-6 border-t border-mist-200 dark:border-mist-800 flex justify-start">
        <Button onClick={onBack} className="button-tertiary">
          Volver atrás
        </Button>
      </div>
    </div>
  )
}
