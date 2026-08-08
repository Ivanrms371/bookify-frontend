import { Avatar } from '@/shared/components/ui/avatar';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Text } from '@/shared/components/typography';
import { getInitials } from '@/shared/utils/string';
import type { ProfessionalBasic } from '@/features/professional/types/professional.types';
import { cn } from '@/shared/utils/cn';

interface Props {
  professionals: ProfessionalBasic[];
  onSelect: (id: string) => void;
  selectedProfessionalId: string | null;
}

export const ProfessionalList = ({ professionals, onSelect, selectedProfessionalId }: Props) => (
  <ul className="flex flex-col gap-2.5">
    {professionals.map((professional) => (
      <li
        onClick={() => onSelect(professional.id)}
        key={professional.id}
        className={cn(
          'group flex justify-between items-center gap-3 border border-gray-200 p-2 rounded-2xl cursor-pointer transition-all duration-300',
          selectedProfessionalId === professional.id
            ? 'border-indigo-600  ring-4 ring-indigo-100'
            : 'hover:bg-gray-100/50 hover:boder-gray-300',
        )}
      >
        {/* Lado Izquierdo: Avatar + Textos */}
        <div className="flex gap-3 items-center min-w-0">
          {professional.avatarUrl ? (
            <Avatar
              src={professional.avatarUrl}
              size="md"
              className="shrink-0 ring-2 ring-transparent group-hover:ring-gray-100 transition-all"
            />
          ) : (
            // Reemplazo prolijo del PhotoIcon por Iniciales con estilo
            <div className="size-10 rounded-full bg-gray-50 border border-gray-200 text-gray-600 font-semibold text-sm flex justify-center items-center shrink-0 tracking-wider">
              {getInitials(professional.displayName)}
            </div>
          )}

          <div>
            <Text className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors truncate">
              {professional.displayName}
            </Text>
            <Text className="text-xs text-gray-500 font-medium mt-0.5">{professional.bio}</Text>
          </div>
        </div>

        {/* Lado Derecho: Rating + Feedback de Acción */}
        <ChevronRightIcon className="size-5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
      </li>
    ))}
  </ul>
);
