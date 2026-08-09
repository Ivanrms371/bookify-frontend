import type { IconType } from '@/shared/types';
import { cn } from '@/shared/utils/cn';
import { ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import type { ReactNode } from 'react';

export type CalloutType = 'info' | 'success' | 'warning' | 'error' | 'neutral';

type CalloutColorClasses = {
  container: string;
  title: string;
  paragraph: string;
  icon: string;
};

const COLORS: Record<CalloutType, CalloutColorClasses> = {
  info: {
    container: 'bg-blue-50 border-blue-200',
    title: 'text-blue-900',
    paragraph: 'text-blue-700',
    icon: 'text-blue-600',
  },
  success: {
    container: 'bg-emerald-50 border-emerald-200',
    title: 'text-emerald-900',
    paragraph: 'text-emerald-700',
    icon: 'text-emerald-600',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200',
    title: 'text-amber-900',
    paragraph: 'text-amber-700',
    icon: 'text-amber-600',
  },
  error: {
    container: 'bg-rose-50 border-rose-200',
    title: 'text-rose-900',
    paragraph: 'text-rose-700',
    icon: 'text-rose-600',
  },
  neutral: {
    container: 'bg-gray-50 border-gray-200',
    title: 'text-gray-900',
    paragraph: 'text-gray-700',
    icon: 'text-gray-600',
  },
};

const ICONS: Record<CalloutType, IconType> = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: XCircleIcon,
  neutral: InformationCircleIcon,
};

interface CalloutProps {
  type?: CalloutType;
  icon?: IconType;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Callout = ({ type = 'info', icon, title, children }: CalloutProps) => {
  const colorClass = COLORS[type];
  const IconComponent = icon || ICONS[type];

  return (
    <div className={cn('flex items-start gap-2 px-4 py-3 rounded-xl', colorClass.container)} role="status">
      <IconComponent className={cn('mt-0.5 size-4.5 shrink-0', colorClass.icon)} />
      <div className="flex flex-col gap-0.5">
        {title && <p className={cn('text-sm font-medium', colorClass.title)}>{title}</p>}
        <p className={cn('text-sm', colorClass.paragraph)}>{children}</p>
      </div>
    </div>
  );
};
