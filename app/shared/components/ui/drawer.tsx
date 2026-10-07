import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { cn } from '@/shared/utils/cn';
import type { OverlayKey } from '../overlays/overlay-registry';
import { Button } from './button';
import { Heading } from '../typography';

const EXIT_MS = 300;

export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
export type DrawerPosition = 'left' | 'right';

const drawerSizeClasses: Record<DrawerSize, string> = {
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

type DrawerProps = {
  overlayKey: OverlayKey;
  children: ReactNode;
  title?: string;
  titleClassName?: string;
  size?: DrawerSize;
  position?: DrawerPosition;
  className?: string;
  closeOnBackdrop?: boolean;
  isDismissible?: boolean;
  containFocus?: boolean;
  returnFocus?: HTMLElement | null;
};

export const Drawer = ({
  overlayKey,
  children,
  title,
  titleClassName,
  size = 'md',
  position = 'right',
  className,
  closeOnBackdrop = true,
  isDismissible = true,
  containFocus = false,
  returnFocus,
}: DrawerProps) => {
  const { close, isVisible, shouldRender } = useOverlay(overlayKey);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dismissibleRef = useRef(isDismissible);
  dismissibleRef.current = isDismissible;
  const titleId = useId();

  useEffect(() => {
    if (!containFocus || !isVisible) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = returnFocus ?? document.activeElement;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
    )).filter((element) => element.getClientRects().length > 0);
    const focusFirst = () => (focusable()[0] ?? dialog).focus();
    focusFirst();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        if (dismissibleRef.current) close();
      }
      if (event.key === 'Tab') {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (!first) { event.preventDefault(); dialog.focus(); }
        else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
          event.preventDefault(); first.focus();
        }
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (!dialog.contains(event.target as Node)) focusFirst();
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocus);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [containFocus, isVisible, returnFocus, close]);

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
    <div className={cn('fixed inset-0 z-50 flex', position === 'right' ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-500 ease-out',
          isVisible ? 'opacity-100' : 'opacity-0',
        )}
        onClick={closeOnBackdrop && isDismissible ? close : undefined}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal={containFocus || undefined}
        aria-labelledby={title ? titleId : undefined}
        tabIndex={containFocus ? -1 : undefined}
        className={cn(
          'relative z-10 flex h-full w-full flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-out py-3 px-4 sm:py-6 sm:px-8',
          drawerSizeClasses[size],
          isVisible ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full',
          className,
        )}
      >
        <DrawerHeader onClose={isDismissible ? close : undefined}>
          <DrawerTitle id={titleId} className={titleClassName}>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

interface DrawerHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export const DrawerHeader = ({ children, onClose }: DrawerHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {children}
      {onClose && (
        <Button type="button" onClick={onClose} aria-label="Cerrar" size="icon-md" variant="ghost" className="">
          <XMarkIcon className="size-7" />
        </Button>
      )}
    </div>
  );
};

export const DrawerTitle = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => {
  return (
    <div className="w-full">
      <Heading id={id} className={cn('text-xl font-bold', className)}>{children}</Heading>
    </div>
  );
};

export const DrawerBody = ({ children, className, spaced = true }: { children: React.ReactNode; className?: string; spaced?: boolean }) => {
  return <div className={cn("min-h-0 overflow-y-auto flex-1", spaced && "space-y-5", className)}>{children}</div>;
};

export const DrawerFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("shrink-0 pt-6 flex justify-end gap-2", className)}>{children}</div>;
};
