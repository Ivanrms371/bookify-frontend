import { cn } from '@/shared/utils/cn';

export const FormField = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn('flex flex-col gap-1.5', className)}>{children}</div>;
};
