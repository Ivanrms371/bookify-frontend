import { cn } from '@/shared/utils/cn';

type TextProps = React.HTMLAttributes<HTMLParagraphElement>;

export const Text = ({ className, children, ...rest }: TextProps) => {
  return (
    <p className={cn('text-base font-medium text-gray-600', className)} {...rest}>
      {children}
    </p>
  );
};
