import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={cn('rounded-4xl bg-white p-5 shadow', className)} {...props}>
      {children}
    </div>
  );
};
