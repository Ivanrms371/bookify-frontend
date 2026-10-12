import {
  ArrowPathIcon,
  BanknotesIcon,
  BellAlertIcon,
  CalendarDaysIcon,
  ClockIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MoonIcon,
  SparklesIcon,
  SunIcon,
  UserPlusIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import type { NotificationType } from '../types/notification.types';

export function notificationIcon(type: NotificationType) {
  const map = {
    'member.joined': <UserPlusIcon className="size-4 stroke-2 text-blue-600" />,
    'tenant.created': <SparklesIcon className="size-4 stroke-2 text-emerald-600" />,
    'billing.trial.ends.7d': <ClockIcon className="size-4 stroke-2 text-amber-600" />,
    'billing.trial.ends.3d': <ExclamationTriangleIcon className="size-4 stroke-2 text-orange-600" />,
    'billing.renewal.3d': <CreditCardIcon className="size-4 stroke-2 text-teal-600" />,
    'professional.day-end': <MoonIcon className="size-4 stroke-2 text-violet-600" />,
    'professional.day-start': <SunIcon className="size-4 stroke-2 text-amber-600" />,
    'appointment.created': <CalendarDaysIcon className="size-4 stroke-2 text-indigo-600" />,
    'appointment.cancelled': <XCircleIcon className="size-4 stroke-2 text-rose-600" />,
    'appointment.rescheduled': <ArrowPathIcon className="size-4 stroke-2 text-sky-600" />,
    'appointment.reminder': <BellAlertIcon className="size-4 stroke-2 text-amber-600" />,
    'payment.received': <BanknotesIcon className="size-4 stroke-2 text-emerald-600" />,
  };
  return map[type] ?? <InformationCircleIcon className="size-4 stroke-2 text-blue-600" />;
}

export function notificationColor(type: NotificationType) {
  const map = {
    'member.joined': 'bg-blue-100',
    'tenant.created': 'bg-emerald-100',
    'billing.trial.ends.7d': 'bg-amber-100',
    'billing.trial.ends.3d': 'bg-orange-100',
    'billing.renewal.3d': 'bg-teal-100',
    'professional.day-end': 'bg-violet-100',
    'professional.day-start': 'bg-amber-100',
    'appointment.created': 'bg-indigo-100',
    'appointment.cancelled': 'bg-rose-100',
    'appointment.rescheduled': 'bg-sky-100',
    'appointment.reminder': 'bg-amber-100',
    'payment.received': 'bg-emerald-100',
  };
  return map[type] ?? 'bg-blue-100';
}
