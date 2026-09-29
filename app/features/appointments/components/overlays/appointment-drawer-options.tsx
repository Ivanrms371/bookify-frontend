import { PhotoIcon, UserIcon } from '@heroicons/react/24/outline';
import { Avatar } from '@/shared/components/ui/avatar';
import { Text } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { formatUYU } from '@/shared/utils/currency';
import type { Service } from '@/features/services';
import type { ProfessionalBasic } from '@/features/professionals/types/professional.types';

export const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <div>
    <Text className="text-lg font-bold text-gray-800 md:text-xl">{title}</Text>
    <Text className="text-sm font-medium text-gray-500">{description}</Text>
  </div>
);

export const ServiceOption = ({ service, isSelected, onSelect }: { service: Service; isSelected: boolean; onSelect: () => void }) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      'flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-2 text-left transition-colors hover:bg-gray-50',
      isSelected && 'border-indigo-600 ring-4 ring-indigo-100',
    )}
  >
    {service.imageUrl ? (
      <img src={service.imageUrl} alt={service.name} className="size-12 shrink-0 rounded-lg border border-gray-200 object-cover" />
    ) : (
      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <PhotoIcon className="size-6 text-gray-400" />
      </span>
    )}
    <span className="min-w-0 flex-1">
      <Text className="truncate text-sm font-bold text-gray-800">{service.name}</Text>
      <Text className="text-xs font-medium text-gray-500">
        {service.durationMinutes} min · {formatUYU(service.price)}
      </Text>
    </span>
  </button>
);

export const ProfessionalOption = ({
  professional,
  isSelected,
  onSelect,
}: {
  professional: ProfessionalBasic;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      'flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-2 text-left transition-colors hover:bg-gray-50',
      isSelected && 'border-indigo-600 ring-4 ring-indigo-100',
    )}
  >
    {professional.avatarUrl ? (
      <Avatar src={professional.avatarUrl} size="md" className="shrink-0" />
    ) : (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
        <UserIcon className="size-5 text-gray-400" />
      </span>
    )}
    <span className="min-w-0">
      <Text className="truncate text-sm font-semibold text-gray-800">{professional.name}</Text>
      <Text className="truncate text-xs font-medium text-gray-500">{professional.bio}</Text>
    </span>
  </button>
);

export const EmptyInline = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 p-3 text-gray-500">
    {icon}
    <Text className="text-sm font-medium">{text}</Text>
  </div>
);
