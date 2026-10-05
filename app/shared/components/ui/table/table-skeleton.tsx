import { cn } from '@/shared/utils/cn';
import { Table, Tbody, Td, Th, Thead, Tr } from './table';

export interface TableSkeletonColumn {
  label: string;
  variant?: 'text' | 'avatar' | 'thumbnail' | 'badge' | 'actions';
  /** Tailwind width classes for the text placeholder, e.g. "w-32". */
  width?: string;
  secondaryLine?: boolean;
  align?: 'left' | 'right';
}

export interface TableSkeletonProps {
  columns: readonly TableSkeletonColumn[];
  rows?: number;
  label?: string;
  className?: string;
  tableClassName?: string;
  /** Match lists that switch from a table to cards below the md breakpoint. */
  responsive?: boolean;
  mobileTitleColumn?: number;
}

function Placeholder({ className }: { className?: string }) {
  return <span className={cn('block h-4 max-w-full rounded-md bg-gray-100 motion-safe:animate-pulse', className)} />;
}

function CellPlaceholder({ column }: { column: TableSkeletonColumn }) {
  const variant = column.variant ?? 'text';
  if (variant === 'actions') return <Placeholder className="size-8 rounded-lg" />;
  if (variant === 'badge') return <Placeholder className="h-6 w-16 rounded-full" />;

  return (
    <div className="flex min-w-0 items-center gap-3">
      {(variant === 'avatar' || variant === 'thumbnail') && (
        <Placeholder className={cn('size-12 shrink-0', variant === 'avatar' ? 'rounded-full' : 'rounded-lg')} />
      )}
      <div className="min-w-0 space-y-2">
        <Placeholder className={column.width ?? 'w-28'} />
        {column.secondaryLine && <Placeholder className="h-3 w-36" />}
      </div>
    </div>
  );
}

/** Shared loading state for tables, with optional mobile cards and no interactive controls. */
export function TableSkeleton({
  columns,
  rows = 6,
  label = 'Cargando datos...',
  className,
  tableClassName,
  responsive = true,
  mobileTitleColumn = 0,
}: TableSkeletonProps) {
  const rowIndexes = Array.from({ length: rows }, (_, index) => index);
  const titleColumn = columns[mobileTitleColumn] ?? columns[0];
  const actionColumn = columns.find((column) => column.variant === 'actions');

  return (
    <div role="status" className={cn('min-w-0', className)}>
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className={responsive ? 'hidden md:block' : undefined}>
        <Table className={tableClassName}>
          <Thead>
            <Tr>
              {columns.map((column, index) => (
                <Th key={index} scope="col" className={column.align === 'right' ? 'text-right' : undefined}>
                  {column.label}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {rowIndexes.map((row) => (
              <Tr key={row}>
                {columns.map((column, index) => (
                  <Td key={index}>
                    <div className={cn('flex', column.align === 'right' && 'justify-end')}>
                      <CellPlaceholder column={column} />
                    </div>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      {responsive && (
        <div aria-hidden="true" className="space-y-3 md:hidden">
          {rowIndexes.map((row) => (
            <div key={row} className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                {titleColumn && <CellPlaceholder column={titleColumn} />}
                {actionColumn && <CellPlaceholder column={actionColumn} />}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {columns.map((column, index) =>
                  column !== titleColumn && column.variant !== 'actions' ? (
                    <div key={index} className="min-w-0 space-y-2">
                      <span className="text-xs text-gray-500">{column.label}</span>
                      <CellPlaceholder column={column} />
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
