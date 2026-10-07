import { XMarkIcon } from '@heroicons/react/20/solid';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { cn } from '@/shared/utils/cn';
import type { OverlayKey } from '../overlays/overlay-registry';
import { Button } from './button';
import { Heading } from '../typography';
import { DrawerHeader, DrawerTitle } from './drawer';

const EXIT_MS = 300;
let scrollLocks = 0;
let originalOverflow = '';

function isTopModal(dialog: HTMLDivElement | null) {
  const dialogs = document.querySelectorAll('[data-modal-layer]');
  return dialogs[dialogs.length - 1] === dialog;
}

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
  footer?: ReactNode;
  closeDisabled?: boolean;
  manageFocus?: boolean;
  onClose?: () => void;
  returnFocus?: HTMLElement | null;
};

export const Modal = ({
  overlayKey,
  children,
  size = 'md',
  title,
  className,
  closeOnBackdrop = true,
  showCloseButton = true,
  footer,
  closeDisabled = false,
  manageFocus = false,
  onClose,
  returnFocus,
}: ModalProps) => {
  const { close: closeOverlay, isVisible, shouldRender } = useOverlay(overlayKey);
  const close = onClose ?? closeOverlay;
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!shouldRender || !manageFocus) return;
    const previousFocus = returnFocus ?? document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => {
      if (isTopModal(dialogRef.current)) dialogRef.current?.focus();
    });
    const containFocus = (event: FocusEvent) => {
      if (!isTopModal(dialogRef.current)) return;
      if (event.target instanceof Node && !dialogRef.current?.contains(event.target)) dialogRef.current?.focus();
    };
    document.addEventListener('focusin', containFocus);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('focusin', containFocus);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [shouldRender, manageFocus, returnFocus]);

  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopModal(dialogRef.current)) return;
      if (event.key === 'Escape' && !closeDisabled) close();
      if (event.key === 'Tab' && manageFocus) {
        const items = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), textarea:not(:disabled), select:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]',
          ) ?? [],
        );
        const first = items[0];
        const last = items[items.length - 1];
        if (!first) {
          event.preventDefault();
          dialogRef.current?.focus();
        } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, close, closeDisabled, manageFocus]);

  useEffect(() => {
    if (!shouldRender) return;

    if (scrollLocks++ === 0) originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (--scrollLocks === 0) document.body.style.overflow = originalOverflow;
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
        onClick={closeOnBackdrop && !closeDisabled ? close : undefined}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        tabIndex={manageFocus ? -1 : undefined}
        role="dialog"
        data-modal-layer={overlayKey}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          'relative z-10 flex w-full max-h-[85vh] transition-all duration-300 ease-out flex-col overflow-hidden',
          modalSizeClasses[size],
          'rounded-lg bg-white p-6 shadow-lg ring-1 ring-gray-100/80',
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-[0.97] opacity-0 translate-y-2',
          className,
        )}
      >
        <ModalHeader onClose={showCloseButton && !closeDisabled ? close : undefined}>
          <div id={titleId}>
            <ModalTitle>{title}</ModalTitle>
          </div>
        </ModalHeader>

        <div className="min-h-0 flex-1 overflow-auto">{children}</div>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </div>
    </div>,
    document.body,
  );
};

interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export const ModalHeader = ({ children, onClose }: ModalHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      {children}
      {onClose && (
        <Button type="button" onClick={onClose} aria-label="Cerrar" size="icon-sm" variant="ghost" className="">
          <XMarkIcon className="size-7" />
        </Button>
      )}
    </div>
  );
};

export const ModalTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <Heading className="text-xl md:text-2xl  font-bold">{children}</Heading>
    </div>
  );
};

export const ModalBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-5 flex-1">{children}</div>;
};

export const ModalFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn('pt-6 flex justify-end gap-2', className)}>{children}</div>;
};
