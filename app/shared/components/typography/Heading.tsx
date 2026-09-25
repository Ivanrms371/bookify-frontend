import { cn } from '@/shared/utils/cn';

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
};

export const Heading = ({ as: Tag = 'h2', className = '', children, ...rest }: HeadingProps) => {
  return (
    <Tag className={cn('font-medium text-2xl md:text-3xl', 'text-gray-800', className)} {...rest}>
      {children}
    </Tag>
  );
};
