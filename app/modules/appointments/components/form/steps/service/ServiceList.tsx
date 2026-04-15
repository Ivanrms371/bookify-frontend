import type { Service } from "@/modules/services/types/service.types"
import { ServiceItem } from "./ServiceItem"

interface ServiceListProps {
  services: Service[]
  onSelect: (service: Service) => void
}

export const ServiceList = ({ services, onSelect }: ServiceListProps) => (
  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start">
    {services
      .filter((s) => s.isActive)
      .map((service) => (
        <ServiceItem
          key={service.id}
          service={service}
          onSelect={onSelect}
        />
      ))}
  </ul>
)
