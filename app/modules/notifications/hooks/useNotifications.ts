import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { apiClient } from "@/shared/api/client";

export type NotificationType = "info" | "success" | "warning" | "alert";

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  type: NotificationType;
}

export const useNotifications = (tenantId?: string) => {
  const [data, setData] = useState<AppNotification[]>([]);
  const [dbUnreadCount, setDbUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;

    let isMounted = true;
    setIsLoading(true);

    // 1. Fetch historical state
    apiClient.get('/notifications').then((res: any) => {
      if (!isMounted) return;
      const { count, notifications } = res.data;
      const mapped = notifications.map((n: any) => ({
        id: n.id,
        title: n.title,
        description: n.message,
        createdAt: n.createdAt,
        isRead: n.readAt !== null && n.readAt !== undefined,
        type: (n.type as NotificationType) || "info",
      }));
      setData(mapped);
      setDbUnreadCount(count);
      setIsLoading(false);
    }).catch((err: any) => {
      console.error("Failed to load notifications history:", err);
      if (isMounted) setIsLoading(false);
    });

    // Compute the base URL by safely removing /api if it is set in VITE_API_URL
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:4000";
    const socketUrl = `${baseUrl}/notifications`;

    // Connect securely by permitting cookies (access_token)
    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("🟢 Real-time notifications connected.");
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket Connection Error:", error.message);
    });

    socket.on("in_app_notification.created", (payload: any) => {
      // Ensure the incoming notification actually belongs to this tenant viewport
      if (payload.tenantId && payload.tenantId !== tenantId) return;

      const newNotif: AppNotification = {
        id: payload.id || crypto.randomUUID(),
        title: payload.title,
        description: payload.message,
        createdAt: payload.createdAt || new Date().toISOString(),
        isRead: payload.readAt !== null && payload.readAt !== undefined,
        type: (payload.type as NotificationType) || "info",
      };

      if (isMounted) {
        setData((prev) => [newNotif, ...prev]);
        setDbUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      isMounted = false;
      socket.disconnect();
    };
  }, [tenantId]);

  const markAsRead = async (id: string) => {
    // Optimistic UI update
    setData((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
    setDbUnreadCount((prev) => Math.max(0, prev - 1));

    // Persist to backend without blocking the user interface
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch (e) {
      console.error("Failed to mark notification as read:", e);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic UI update
    setData((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
    setDbUnreadCount(0);

    // Persist to backend
    try {
      await apiClient.patch("/notifications/read-all");
    } catch (e) {
      console.error("Failed to mark all notifications as read:", e);
    }
  };

  return {
    data,
    isLoading,
    unreadCount: dbUnreadCount,
    markAsRead,
    markAllAsRead,
  };
};
