import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import {
  ClockIcon,
  CurrencyDollarIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline"
import { formatCurrency } from "@/shared/utils/formatters"
import { Button } from "@/shared/components/form/Button"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"
import type { Service } from "@/modules/services/types/service.types"

import { useAppointmentForm } from "../../../context/appointment-form.context"

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
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start">
            {servicesData
              .filter((s: Service) => s.isActive)
              .map((service: Service) => (
                <li
                  key={service.id}
                  onClick={() => handleNext(service)}
                  className="group flex gap-3 border border-mist-200 dark:border-mist-800 p-3 rounded-2xl hover:bg-mist-100 dark:hover:bg-mist-900/50 hover:border-mist-300 dark:hover:border-mist-700 cursor-pointer transition-all duration-300"
                >
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="size-20 rounded-xl object-cover border border-mist-200 dark:border-mist-800 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="size-20 rounded-xl border border-mist-200 dark:border-mist-800 shadow-sm shrink-0 bg-mist-50 dark:bg-mist-900/50 flex justify-center items-center">
                      <PhotoIcon className="size-6 text-mist-400 dark:text-mist-500" />
                    </div>
                  )}
                  <div className="py-1 flex flex-col gap-1.5 flex-1 min-w-0">
                    <Heading
                      as={"h3"}
                      className="text-lg font-semibold text-mist-900 dark:text-mist-100 transition-colors truncate"
                    >
                      {service.name}
                    </Heading>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="size-4.5 shrink-0 text-mist-500" />
                      <Paragraph className="text-sm">
                        {service.durationMinutes}min
                      </Paragraph>
                    </div>
                    <div className="flex items-center gap-1">
                      <CurrencyDollarIcon className="size-4.5 shrink-0 text-mist-500" />
                      <Paragraph className="text-sm">
                        {formatCurrency(service.price)}
                      </Paragraph>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
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
