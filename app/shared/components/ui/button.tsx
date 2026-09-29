import { cn } from '@/shared/utils/cn';
import { Loader2 } from 'lucide-react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dashed';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'icon-md' | 'icon-sm';
  isSubmitting?: boolean;
  fullWidth?: boolean;

  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  fullWidth,
  icon,
  iconPosition,
  isSubmitting = false,
  ...props
}: Props) => {
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

  return (
    <button
      disabled={disabled || isSubmitting}
      className={`
        btn ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

      {!isSubmitting && icon && iconPosition === 'left' && icon}

      {children}

      {!isSubmitting && icon && iconPosition === 'right' && icon}
    </button>
  );
};
