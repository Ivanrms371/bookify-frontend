import { cn } from '@/shared/utils/cn';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import type { ReactNode } from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  hasError?: boolean;

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  fullWidth?: boolean;
};

export const Input = ({ label, error, helperText, hasError, leftIcon, rightIcon, className, id, fullWidth = true, ...props }: Props) => {
  return (
    <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{leftIcon}</span>}

        <input
          id={id}
          className={cn('input', leftIcon && 'pl-10', rightIcon && 'pr-10', (error || hasError) && 'input-error', className)}
          {...props}
        />

        {rightIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</span>}
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
