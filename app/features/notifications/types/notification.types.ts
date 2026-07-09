
export type NotificationType = "appointment.created" | "appointment.cancelled" | "appointment.reminder" | "payment.received"

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  actionUrl?: string;
  readAt: string | null
  createdAt: string
}