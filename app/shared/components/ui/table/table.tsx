import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

/* ─────────────────────────────────────────────
 * Table
 * ───────────────────────────────────────────── */

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto">
    <table ref={ref} className={cn('w-full text-sm', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

/* ─────────────────────────────────────────────
 * Thead
 * ───────────────────────────────────────────── */

export const Thead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('border-b border-mist-200', className)} {...props} />
));
Thead.displayName = 'Thead';

/* ─────────────────────────────────────────────
 * Tbody
 * ───────────────────────────────────────────── */

export const Tbody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
Tbody.displayName = 'Tbody';

/* ─────────────────────────────────────────────
 * Tr
 * ───────────────────────────────────────────── */

export const Tr = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-mist-100',
      'transition-colors duration-150',
      'hover:bg-mist-50',
      className,
    )}
    {...props}
  />
));
Tr.displayName = 'Tr';

/* ─────────────────────────────────────────────
 * Th
 * ───────────────────────────────────────────── */

export const Th = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn('px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase', 'text-mist-400', className)}
    {...props}
  />
));
Th.displayName = 'Th';

/* ─────────────────────────────────────────────
 * Td
 * ───────────────────────────────────────────── */

export const Td = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('px-4 py-3.5', 'text-mist-700', className)} {...props} />
));
Td.displayName = 'Td';
