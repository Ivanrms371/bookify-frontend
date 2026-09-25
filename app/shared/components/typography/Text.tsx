import { cn } from '@/shared/utils';
import type { HTMLAttributes, ReactNode } from 'react';

type TextTag = 'p' | 'span' | 'div' | 'label';
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'lead';
type FontWeight = 'normal' | 'medium' | 'semibold';
type TextVariant = 'default' | 'muted' | 'subtle';

const textSizes: Record<TextSize, string> = {
  xs: 'text-xs leading-tight tracking-normal',
  sm: 'text-sm leading-normal tracking-normal',
  base: 'text-base leading-relaxed tracking-normal',
  lg: 'text-lg leading-relaxed tracking-tight',
  lead: 'text-lg sm:text-xl leading-relaxed tracking-tight',
};

const fontWeights: Record<FontWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
};

const textVariants: Record<TextVariant, string> = {
  default: 'text-gray-800',
  muted: 'text-gray-600',
  subtle: 'text-gray-500',
};

const defaultTextSizeMap: Record<TextTag, TextSize> = {
  p: 'sm',
  span: 'sm',
  label: 'xs',
  div: 'sm',
};

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextTag;
  size?: TextSize;
  weight?: FontWeight;
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
}

export function Text({ as: Component = 'p', size, variant = 'muted', weight = 'normal', children, className = '', ...props }: TextProps) {
  const resolvedSize =
    size ?? (typeof Component === 'string' && Component in defaultTextSizeMap ? defaultTextSizeMap[Component as TextTag] : 'sm');

  return (
    <Component className={cn('font-sans', textSizes[resolvedSize], fontWeights[weight], textVariants[variant], className)} {...props}>
      {children}
    </Component>
  );
}
