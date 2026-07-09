import { TrashIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils/cn';

type TrashButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label?: string;
  size?: 'sm' | 'md';
};

export const TrashButton = ({ className, label = 'Eliminar', size = 'sm', type = 'button', ...props }: TrashButtonProps) => {
  return (
    <button
      type={type}
      title={label}
      aria-label={label}
      className={cn(
        'text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors flex justify-center items-center rounded-md cursor-pointer',
        size === 'sm' && 'size-6',
        size === 'md' && 'size-8',
        className,
      )}
      {...props}
    >
      <TrashIcon className={cn('shrink-0', size === 'sm' ? 'size-4' : 'size-[18px]')} strokeWidth={1.75} />
    </button>
  );
};
