import { useState, useEffect } from "react";

export type NotificationType = "info" | "success" | "warning" | "alert";

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  type: NotificationType;
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    title: "Nueva reserva añadida",
    description: "Carlos Ruiz ha agendado un Corte de Cabello Clásico para mañana a las 15:00.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    isRead: false,
    type: "info",
  },
  {
    id: "2",
    title: "Cobro exitoso",
    description: "El pago de $45.00 a través de Stripe se ha completado correctamente.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isRead: false,
    type: "success",
  },
  {
    id: "3",
    title: "Staff ausente",
    description: "María ha registrado una ausencia para el próximo viernes 15 de Nov.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: true,
    type: "warning",
  },
  {
    id: "4",
    title: "Recordatorio de suscripción",
    description: "Tu plan pro está próximo a vencer. Renueva antes del 20 de Nov.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
    type: "alert",
  },
  {
    id: "5",
    title: "Nuevo cliente registrado",
    description: "Elisa Martínez se ha registrado en tu página de reservas.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
    type: "info",
  },
  {
    id: "6",
    title: "Configuración completada",
    description: "Tu negocio ha sido verificado.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    isRead: true,
    type: "success",
  },
];

/**
 * Hook to fetch notifications for a specific business.
 * Currently simulated with MOCK data, but ready to be replaced with a real query.
 */
export const useNotifications = (businessId?: string) => {
  const [data, setData] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a query to /business/:businessId/notifications
  useEffect(() => {
    if (!businessId) return;

    let isMounted = true;
    setIsLoading(true);

    // Simulate network delay
    const timer = setTimeout(() => {
      if (isMounted) {
        setData(MOCK_NOTIFICATIONS);
        setIsLoading(false);
      }
    }, 600);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [businessId]);

  const unreadCount = data.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setData((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setData((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  return {
    data,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};
