import { cn } from '@/shared/utils/cn';
import type { HTMLAttributes } from 'react';
import { Text } from '../typography';

type Props = HTMLAttributes<HTMLDivElement> & {
  label?: string;
  id?: string;
  error?: string;
  description?: string;
};

export const FormField = ({ children, label, id, error, className, description, ...props }: Props) => {
  return (
    <div {...props} className={cn('flex flex-col gap-2.5 relative', className)}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      {children}
      {error && <span className="error-text">{error}</span>}
      {description && <span className="text-sm text-gray-500">{description}</span>}
    </div>
  );
};
