import { cn } from '@/shared/utils/cn';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const AuthWrapper = ({ children, className }: Props) => {
  return <div className={cn('flex flex-col justify-center max-w-md mx-auto w-full px-6 gap-2', className)}>{children}</div>;
};
