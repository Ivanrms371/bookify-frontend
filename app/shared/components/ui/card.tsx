import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={cn('rounded-2xl shadow-sm bg-white p-5', className)} {...props}>
      {children}
    </div>
  );
};
