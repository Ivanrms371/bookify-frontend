import { XMarkIcon } from '@heroicons/react/16/solid';
import { cn } from '@/shared/utils/cn';

type AlertVariant = 'error' | 'warning' | 'success' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variants: Record<AlertVariant, string> = {
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-600 dark:text-amber-400',
  success: 'text-emerald-600 dark:text-emerald-400',
  info: 'text-indigo-600 dark:text-indigo-400',
};

export function Alert({ variant = 'error', title, message, dismissible = false, onDismiss, className }: AlertProps) {
  if (!title && !message) return null;

  const hasBoth = Boolean(title && message);

  return (
    <div
      role="alert"
      className={cn(
        'text-sm leading-snug animate-in fade-in duration-200',
        variants[variant],
        dismissible && 'flex items-start justify-between gap-2',
        className,
      )}
    >
      <div className={cn('min-w-0', hasBoth && 'space-y-0.5')}>
        {title && <p className={cn(hasBoth && 'font-semibold')}>{title}</p>}
        {message && <p className={cn(hasBoth && 'font-normal opacity-90')}>{message}</p>}
      </div>

      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="-mr-0.5 shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
          aria-label="Cerrar"
        >
          <XMarkIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}
