import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"

interface ChecklistHeaderProps {
  currentStep: number
  totalSteps: number
}

export const ChecklistHeader = ({
  currentStep,
  totalSteps,
}: ChecklistHeaderProps) => {
  return (
    <div className="flex mb-4 gap-4 justify-between">
      <div>
        <Heading className="text-2xl">Incorporación</Heading>
        <Paragraph className="text-base">
          Completa los últimos pasos para comenzar a recibir reservas.
        </Paragraph>
      </div>
      <div
        className="flex items-center justify-center min-w-10 min-h-10 h-10 rounded-full 
        bg-linear-to-tr bg-mist-900 dark:bg-mist-100 shadow-sm"
      >
        <span className="text-mist-100 dark:text-mist-900 text-sm font-semibold">
          {currentStep}/{totalSteps}
        </span>
      </div>
    </div>
  )
}
