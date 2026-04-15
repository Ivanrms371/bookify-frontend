import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import { Button } from "@/shared/components/form/Button"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"
import type { Service } from "@/modules/services/types/service.types"
import { useAppointmentForm } from "../../../../context/appointment-form.context"
import { ServiceList } from "./ServiceList"

export const ServiceSelectionStep = () => {
  const { onBack, setService, onNext, services } = useAppointmentForm()
  const handleNext = (service: Service) => {
    setService(service)
    onNext()
  }

  const { data: servicesData = [], isPending } = services

  return (
    <div className="flex flex-col min-h-full px-3 py-4 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-4 shrink-0">
        <div>
          <Heading
            as={"h3"}
            className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white"
          >
            Selecciona el Servicio
          </Heading>
          <Paragraph className="mt-2 text-lg text-mist-500">
            ¿Qué se va a realizar el cliente en esta cita?
          </Paragraph>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 -mx-8 px-8">
        {isPending ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <ServiceList services={servicesData} onSelect={handleNext} />
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
