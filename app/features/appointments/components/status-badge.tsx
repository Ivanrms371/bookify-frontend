import { cn } from '@/shared/utils/cn';

type Status = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'IN_PROGRESS';

const variants: Record<Status, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-100',
  CONFIRMED: 'bg-sky-50 text-sky-700 border border-sky-100',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  CANCELLED: 'bg-red-50 text-red-700 border border-red-100',
  NO_SHOW: 'bg-slate-100 text-slate-700 border border-slate-200',
  IN_PROGRESS: 'bg-violet-50 text-violet-700 border border-violet-100',
};

const labels: Record<Status, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No vinó',
  IN_PROGRESS: 'En curso',
};

type Props = {
  status: Status;
  className?: string;
};

export function StatusBadge({ status, className }: Props) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-1 text-xs font-medium', variants[status], className)}>
      {labels[status]}
    </span>
  );
}
