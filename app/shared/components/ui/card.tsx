import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={cn('rounded-2xl border border-gray-100 bg-white p-5', className)} {...props}>
      {children}
    </div>
  );
};
