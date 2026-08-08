import { cn } from '@/shared/utils/cn';
import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  label?: string;
  id?: string;
  error?: string;
};

export const FormField = ({ children, label, id, error, ...props }: Props) => {
  return (
    <div {...props} className={cn('flex flex-col gap-2.5 relative')}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      {children}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};
