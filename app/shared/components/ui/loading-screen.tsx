import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

type LoadingScreenProps = HTMLAttributes<HTMLDivElement> & {
  message?: string;
  fullScreen?: boolean;
};

export const LoadingScreen = ({ message = 'Cargando...', fullScreen = true, className, ...props }: LoadingScreenProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'flex flex-col items-center justify-center gap-2 bg-mist-50 dark:bg-mist-950 absolute inset-0 z-50',
        fullScreen && 'min-h-screen',
        className,
      )}
      {...props}
    >
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>

      {message ? <p className="font-medium text-mist-600 dark:text-mist-300 text-sm">{message}</p> : null}
    </div>
  );
};
