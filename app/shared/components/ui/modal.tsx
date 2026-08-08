import { XMarkIcon } from '@heroicons/react/20/solid';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { cn } from '@/shared/utils/cn';
import type { OverlayKey } from '../overlays/overlay-registry';
import { Button } from './button';

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
  overlayKey: OverlayKey;
  children: ReactNode;
  title?: string;
  size?: ModalSize;
  className?: string;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
};

export const Modal = ({ overlayKey, children, size = 'md', className, closeOnBackdrop = true, showCloseButton = true }: ModalProps) => {
  const { close, isVisible, shouldRender } = useOverlay(overlayKey);

  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, close]);

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
          'absolute inset-0 bg-gray-900/45 backdrop-blur-sm transition-opacity duration-300 ease-out',
          isVisible ? 'opacity-100' : 'opacity-0',
        )}
        onClick={closeOnBackdrop ? close : undefined}
        aria-hidden="true"
      />

      <div
        role="dialog"
        className={cn(
          'relative z-10 flex w-full max-h-[90vh] transition-all duration-300 ease-out flex-col overflow-hidden',
          modalSizeClasses[size],
          'rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100/80',
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-[0.97] opacity-0 translate-y-2',
          className,
        )}
      >
        {showCloseButton && (
          <Button type="button" onClick={close} aria-label="Cerrar" size="icon" variant="ghost" className="absolute top-2 right-2 z-10">
            <XMarkIcon className="size-5" />
          </Button>
        )}

        <div className="min-h-0 flex-1 pr-1 pt-1">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
