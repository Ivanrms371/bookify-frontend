import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useModal } from '@/shared/hooks/useModal';
import { cn } from '@/shared/utils/cn';

const EXIT_MS = 300;

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';

const modalSizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

type ModalProps = {
  modalKey: string;
  children: ReactNode;
  size?: ModalSize;
  className?: string;
  closeOnBackdrop?: boolean;
};

export const Modal = ({ modalKey, children, size = 'lg', className, closeOnBackdrop = true }: ModalProps) => {
  const { isOpen, close } = useModal(modalKey);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  const finishClose = useCallback(() => {
    close();
  }, [close]);

  const requestClose = useCallback(() => {
    setIsVisible(false);
    window.setTimeout(finishClose, EXIT_MS);
  }, [finishClose]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setIsVisible(false);
    const timer = window.setTimeout(() => setShouldRender(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, requestClose]);

  useEffect(() => {
    if (!shouldRender) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  if (!shouldRender || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className={cn(
          'absolute inset-0 bg-mist-900/45 backdrop-blur-sm transition-opacity duration-300 ease-out',
          isVisible ? 'opacity-100' : 'opacity-0',
        )}
        onClick={closeOnBackdrop ? requestClose : undefined}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 flex w-full max-h-[90vh] flex-col overflow-hidden',
          modalSizeClasses[size],
          'rounded-4xl bg-white p-5 shadow-lg ring-1 ring-mist-100/80',
          'transition-all duration-300 ease-out',
          'dark:bg-mist-900/60 dark:ring-mist-800/60',
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-[0.97] opacity-0 translate-y-2',
          className,
        )}
      >
        <button
          type="button"
          onClick={requestClose}
          aria-label="Cerrar"
          className={cn(
            'absolute top-4 right-4 z-10 inline-flex size-9 cursor-pointer items-center justify-center rounded-full',
            'text-mist-600 transition-colors duration-200',
            'bg-mist-100 hover:bg-mist-200 dark:bg-mist-800 dark:hover:bg-mist-700',
            'dark:text-mist-400 dark:hover:bg-mist-800/80',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mist-300 focus-visible:ring-offset-2',
            'dark:focus-visible:ring-mist-700 dark:focus-visible:ring-offset-mist-950',
          )}
        >
          <XMarkIcon className="size-5" strokeWidth={1.75} />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1 pt-1">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
