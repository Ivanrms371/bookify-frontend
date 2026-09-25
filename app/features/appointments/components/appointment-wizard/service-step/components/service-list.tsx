import type { Service } from '@/features/services';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { Text } from '@/shared/components/typography';
import { formatUYU } from '@/shared/utils/currency';
import { cn } from '@/shared/utils/cn';

interface Props {
  services: Service[];
  onSelect: (id: string) => void;
  selectedServiceId: string | null;
}

export const ServiceList = ({ services, onSelect, selectedServiceId }: Props) => {
  return (
    <ul className="grid grid-cols-1 gap-2">
      {services.map((service) => (
        <li
          className={cn(
            'group flex gap-3 border border-gray-200 p-2 rounded-lg cursor-pointer transition-all duration-300',
            selectedServiceId === service.id ? 'border-indigo-600  ring-4 ring-indigo-100' : 'hover:bg-gray-100/50 hover:boder-gray-300',
          )}
          onClick={() => onSelect(service.id)}
        >
          {service.image ? (
            <img src={service.image} alt={service.name} className="size-12 rounded-lg object-cover border border-gray-200 s shrink-0" />
          ) : (
            <div className="size-12 rounded-lg border border-gray-200  shrink-0 bg-gray-50 flex justify-center items-center">
              <PhotoIcon className="size-6 text-gray-400" />
            </div>
          )}
          <div className="py-1 flex justify-between items-start gap-1.5 flex-1 min-w-0">
            <div>
              <Text className="text-sm font-bold text-gray-800 transition-colors">{service.name}</Text>
              <Text className="text-xs font-medium">{service.durationMinutes} minutos</Text>
            </div>
            <Text className="font-bold text-sm">{formatUYU(service.price)}</Text>
          </div>
        </li>
      ))}
    </ul>
  );
};
