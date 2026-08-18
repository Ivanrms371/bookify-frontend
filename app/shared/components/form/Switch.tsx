import { cn } from '@/shared/utils/cn';

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = ({ checked, onCheckedChange, className, ...props }: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-indigo-500 dark:bg-indigo-700' : 'bg-gray-300 dark:bg-gray-900',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block absolute top-0.5 h-5.5 w-5.5 transform rounded-full bg-gray-100 shadow ring-0 transition duration-200 ease-in-out',
          checked ? 'translate-x-6' : 'translate-x-0.5',
        )}
      />
    </button>
  );
};
