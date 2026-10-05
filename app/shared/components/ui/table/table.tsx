import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

/* ─────────────────────────────────────────────
 * Table
 * ───────────────────────────────────────────── */

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, containerClassName, ...props }, ref) => (
  <div className={cn('w-full max-w-full rounded-xl bg-white shadow-sm', containerClassName)}>
    <div className="w-full overflow-x-auto rounded-xl">
      <table ref={ref} className={cn('w-full border-separate border-spacing-0 text-sm', className)} {...props} />
    </div>
  </div>
));
/* ─────────────────────────────────────────────
 * Thead
 * ───────────────────────────────────────────── */

export const Thead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-gray-100', className)} {...props} />
));
/* ─────────────────────────────────────────────
 * Tbody
 * ───────────────────────────────────────────── */

export const Tbody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, children, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child_td]:border-0', className)} {...props}>
      {children}
    </tbody>
  ),
);
/* ─────────────────────────────────────────────
 * Tr
 * ───────────────────────────────────────────── */

export const Tr = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn('', className)} {...props} />
));
/* ─────────────────────────────────────────────
 * Th
 * ───────────────────────────────────────────── */

export const Th = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn('px-4 py-3 text-left text-sm font-semibold text-gray-800 whitespace-nowrap', className)} {...props} />
));
/* ─────────────────────────────────────────────
 * Td
 * ───────────────────────────────────────────── */

export const Td = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('px-4 py-3 text-gray-700 border-b border-gray-200 whitespace-nowrap', className)} {...props} />
));
