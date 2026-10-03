import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  as?: 'section' | 'div';
};

export const Card = ({ children, className, as: Component = 'div', ...props }: CardProps) => {
  return (
    <Component className={cn('rounded-2xl shadow-sm bg-white p-5', className)} {...props}>
      {children}
    </Component>
  );
};
