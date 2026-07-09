import { cn } from '@/shared/utils/cn';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
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
  loading,
  ...props
}: Props) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  const sizes = {
    sm: 'px-3 h-10 text-sm',
    md: 'px-4 h-11 text-sm',
    lg: 'px-6 h-11.5 text-sm',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        btn
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && <span className="animate-spin">⏳</span>}

      {!loading && icon && iconPosition === 'left' && icon}

      {children}

      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};
