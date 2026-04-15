import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import { Button } from "@/shared/components/form/Button"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"
import { Avatar } from "@/shared/components/_ui/Avatar"
import type { Staff } from "@/modules/staff/types/staff.type"
import type { UseQueryResult } from "@tanstack/react-query"

import { useAppointmentForm } from "../../../context/appointment-form.context"

export const ProfessionalSelectionStep = () => {
  const { onBack, onNext, setStaff, staffs, staffsQuery } = useAppointmentForm()
  const { isPending } = staffsQuery
  const handleNext = (staff: Staff) => {
    setStaff(staff)
    onNext()
  }

  return (
    <div className="flex flex-col flex-1 w-full px-3 py-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        ) : (
          <ul className="grid divide-y divide-mist-200 dark:divide-mist-900/70">
            {staffs.length > 0 ? (
              staffs.map((staff) => (
                <li
                  key={staff.id}
                  onClick={() => handleNext(staff)}
                  className="group flex flex-col items-start gap-4 py-3 px-4 transition-all duration-300 text-left relative overflow-hidden cursor-pointer hover:bg-mist-100 dark:hover:bg-mist-900/50 rounded-xl"
                >
                  <div className="flex items-center w-full justify-between z-10">
                    <div className="flex items-center gap-4">
                      <Avatar
                        name={staff.displayName}
                        size="md"
                        src={staff.avatarUrl}
                      />
                      <div>
                        <div className="font-semibold text-mist-900 dark:text-white transition-colors">
                          {staff.displayName}
                        </div>
                        <span className="text-sm font-medium text-mist-500 dark:text-mist-400 mt-0.5 block">
                          {staff.title || "Especialista"}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 rounded-full bg-mist-200 dark:bg-mist-900 dark:group-hover:bg-mist-800 flex items-center justify-center text-mist-700 dark:text-mist-400 transition-all duration-300 group-hover:translate-x-1">
                      <ArrowRightIcon className="size-5" />
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="p-4 rounded-full bg-mist-100 dark:bg-mist-900/40 mb-4">
                  <UserIcon className="size-8 text-mist-400 dark:text-mist-500" />
                </div>
                <h3 className="text-mist-800 dark:text-mist-200 font-semibold mb-1 text-lg">
                  Sin profesionales asignados
                </h3>
                <p className="text-sm text-mist-500 dark:text-mist-400 font-medium max-w-sm">
                  Ningún miembro de tu equipo está configurado para brindar este
                  servicio. Por favor, asígnales el servicio desde
                  Configuración.
                </p>
              </div>
            )}
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
