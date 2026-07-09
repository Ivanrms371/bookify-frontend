import { CalendarDaysIcon, CreditCardIcon, XCircleIcon, ClockIcon, InformationCircleIcon } from '@heroicons/react/16/solid'
import type { NotificationType } from '../types/notification.types'

export function notificationIcon(type: NotificationType) {
  const map = {
    'appointment.created':   <CalendarDaysIcon className="size-3.5 text-purple-600 dark:text-purple-300" />,
    'appointment.cancelled': <XCircleIcon className="size-3.5 text-red-500 dark:text-red-400" />,
    'appointment.reminder':  <ClockIcon className="size-3.5 text-amber-600 dark:text-amber-400" />,
    'payment.received':      <CreditCardIcon className="size-3.5 text-teal-600 dark:text-teal-400" />,
  }
  return map[type] ?? <InformationCircleIcon className="size-3.5 text-blue-600 dark:text-blue-400" />
}

export function notificationColor(type: NotificationType) {
  const map = {
    'appointment.created':   'bg-purple-100 dark:bg-purple-950',
    'appointment.cancelled': 'bg-red-100 dark:bg-red-950',
    'appointment.reminder':  'bg-amber-100 dark:bg-amber-950',
    'payment.received':      'bg-teal-100 dark:bg-teal-950',
  }
  return map[type] ?? 'bg-blue-100 dark:bg-blue-950'
}