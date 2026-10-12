import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cn } from '@/shared/utils/cn';
import { Loader2 } from 'lucide-react';

type ButtonStyleProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dashed';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'icon-md' | 'icon-sm';
  isSubmitting?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
};

type Props = ButtonStyleProps & ((ButtonHTMLAttributes<HTMLButtonElement> & { to?: never }) | (LinkProps & { disabled?: boolean }));

export const Button = (props: Props) => {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    disabled,
    fullWidth,
    icon,
    iconPosition,
    isSubmitting = false,
    ...elementProps
  } = props;
  const inactive = Boolean(disabled || isSubmitting);
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    dashed: 'btn-dashed',
  };
  const sizes = {
    sm: 'px-4 h-8 text-sm',
    md: 'px-4 h-10 text-sm',
    lg: 'px-6 h-12 text-sm',
    icon: 'p-1.5',
    'icon-md': 'size-10',
    'icon-sm': 'size-8',
  };
  const classes = cn('btn', variants[variant], sizes[size], fullWidth && 'w-full', inactive && 'opacity-50 cursor-not-allowed', className);
  const content = (
    <>
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
      {!isSubmitting && icon && iconPosition === 'left' && icon}
      {children}
      {!isSubmitting && icon && iconPosition === 'right' && icon}
    </>
  );

  if (elementProps.to !== undefined) {
    // An inactive link has no destination, so keyboard and modified clicks cannot navigate.
    if (inactive)
      return (
        <span
          role="link"
          aria-disabled="true"
          aria-busy={isSubmitting || undefined}
          className={classes}
          id={elementProps.id}
          title={elementProps.title}
          aria-label={elementProps['aria-label']}
          aria-labelledby={elementProps['aria-labelledby']}
          aria-describedby={elementProps['aria-describedby']}
        >
          {content}
        </span>
      );
    return (
      <Link {...(elementProps as LinkProps)} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button
      {...(elementProps as ButtonHTMLAttributes<HTMLButtonElement>)}
      disabled={inactive}
      aria-busy={isSubmitting || undefined}
      className={classes}
    >
      {content}
    </button>
  );
};
