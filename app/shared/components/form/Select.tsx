import { cn } from '@/shared/utils/cn';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  hasError?: boolean;
  fullWidth?: boolean;
};

export const Select = ({ label, error, helperText, hasError, className, id, fullWidth = true, children, ...props }: Props) => {
  return (
    <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}

      <div className="relative">
        <select id={id} className={cn('input', (error || hasError) && 'input-error', className)} {...props}>
          {children}
        </select>
      </div>

      {error ? (
        <div className="error-text">
          <ExclamationCircleIcon className="size-4" />
          <p>{error}</p>
        </div>
      ) : (
        helperText && <p className="text-sm text-muted">{helperText}</p>
      )}
    </div>
  );
};
