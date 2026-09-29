import { cn } from '@/shared/utils/cn';

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
};

export const Heading = ({ as: Tag = 'h2', className = '', children, ...rest }: HeadingProps) => {
  return (
    <Tag className={cn('font-medium font-display text-2xl md:text-4xl', 'text-gray-800', className)} {...rest}>
      {children}
    </Tag>
  );
};
