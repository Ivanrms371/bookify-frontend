import { cn } from '@/shared/utils/cn';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';

type SelectOption = {
  label: string;
  value: string;
};

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  hasError?: boolean;
  fullWidth?: boolean;
  options: SelectOption[];
};

export const Select = ({ label, error, helperText, hasError, className, id, fullWidth = true, children, options, ...props }: Props) => {
  return (
    <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}

      <div className="relative">
        <select id={id} className={cn('input', (error || hasError) && 'input-error', className)} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
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
