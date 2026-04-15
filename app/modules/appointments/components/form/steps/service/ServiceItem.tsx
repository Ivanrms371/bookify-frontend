import { PhotoIcon, ClockIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import { formatCurrency } from "@/shared/utils/formatters"
import type { Service } from "@/modules/services/types/service.types"

interface ServiceItemProps {
  service: Service
  onSelect: (service: Service) => void
}

export const ServiceItem = ({ service, onSelect }: ServiceItemProps) => (
  <li
    onClick={() => onSelect(service)}
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
        <Paragraph className="text-sm">{service.durationMinutes}min</Paragraph>
      </div>
      <div className="flex items-center gap-1">
        <CurrencyDollarIcon className="size-4.5 shrink-0 text-mist-500" />
        <Paragraph className="text-sm">{formatCurrency(service.price)}</Paragraph>
      </div>
    </div>
  </li>
)
