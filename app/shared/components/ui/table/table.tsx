import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

/* ─────────────────────────────────────────────
 * Table
 * ───────────────────────────────────────────── */

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, containerClassName, ...props }, ref) => (
  <div className={cn('w-full max-w-full overflow-x-auto rounded-xl bg-white border border-gray-100', containerClassName)}>
    <table ref={ref} className={cn('w-full text-sm border-separate border-spacing-0', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

/* ─────────────────────────────────────────────
 * Thead
 * ───────────────────────────────────────────── */

export const Thead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('', className)} {...props} />
));
Thead.displayName = 'Thead';

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
Tbody.displayName = 'Tbody';

/* ─────────────────────────────────────────────
 * Tr
 * ───────────────────────────────────────────── */

export const Tr = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn('', className)} {...props} />
));
Tr.displayName = 'Tr';

/* ─────────────────────────────────────────────
 * Th
 * ───────────────────────────────────────────── */

export const Th = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn('px-4 py-3 text-left text-sm font-medium text-gray-500 whitespace-nowrap', className)} {...props} />
));
Th.displayName = 'Th';

/* ─────────────────────────────────────────────
 * Td
 * ───────────────────────────────────────────── */

export const Td = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('px-4 py-3 text-gray-700 border-b border-gray-100 whitespace-nowrap', className)} {...props} />
));
Td.displayName = 'Td';
