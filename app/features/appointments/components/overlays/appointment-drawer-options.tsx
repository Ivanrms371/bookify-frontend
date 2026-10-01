import { PhotoIcon, UserIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Card } from '@/shared/components/ui/card';
import { Avatar } from '@/shared/components/ui/avatar';
import { Text } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { formatUYU } from '@/shared/utils/currency';
import type { Service } from '@/features/services';
import type { ProfessionalBasic } from '@/features/professionals/types/professional.types';

export const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <div>
    <Text className="text-xl font-bold text-gray-800 md:text-2xl">{title}</Text>
    <Text className="text-base font-medium text-gray-500">{description}</Text>
  </div>
);

export const ServiceOption = ({ service, isSelected, onSelect }: { service: Service; isSelected: boolean; onSelect: () => void }) => (
  <Card
    className={cn(
      'rounded-xl border border-gray-200 p-0 shadow-none transition-colors',
      !isSelected && 'hover:bg-gray-100',
      isSelected && 'border-indigo-600',
    )}
  >
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
    >
      {service.imageUrl ? (
        <img src={service.imageUrl} alt={service.name} className="size-12 shrink-0 rounded-lg border border-gray-200 object-cover" />
      ) : (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
          <PhotoIcon className="size-6 text-gray-400" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <Text className="truncate text-base font-bold text-gray-800">{service.name}</Text>
        <Text className="text-sm font-medium text-gray-500">
          {service.durationMinutes} min · {formatUYU(service.price)}
        </Text>
      </span>
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border border-gray-200',
          isSelected && 'border-indigo-600 bg-indigo-600',
        )}
        aria-hidden="true"
      >
        {isSelected && <CheckIcon className="size-3.5 text-white" />}
      </span>
    </button>
  </Card>
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
  <Card
    className={cn(
      'rounded-xl border border-gray-200 p-0 shadow-none transition-colors',
      !isSelected && 'hover:bg-gray-100',
      isSelected && 'border-indigo-600',
    )}
  >
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
    >
      {professional.avatarUrl ? (
        <Avatar src={professional.avatarUrl} size="md" className="shrink-0" />
      ) : (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
          <UserIcon className="size-5 text-gray-400" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <Text className="truncate text-base font-semibold text-gray-800">{professional.name}</Text>
        <Text className="truncate text-sm font-medium text-gray-500">{professional.bio}</Text>
      </span>
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border border-gray-200',
          isSelected && 'border-indigo-600 bg-indigo-600',
        )}
        aria-hidden="true"
      >
        {isSelected && <CheckIcon className="size-3.5 text-white" />}
      </span>
    </button>
  </Card>
);

export const EmptyInline = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 p-3 text-gray-500">
    {icon}
    <Text className="text-base font-medium">{text}</Text>
  </div>
);
