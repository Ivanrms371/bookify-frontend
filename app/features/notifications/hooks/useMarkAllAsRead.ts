import { useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationsService } from "../services/notifications.service"
import { notificationKeys } from "./useNotifications"

export const useMarkAllAsRead =() => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: notificationsService.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all })
        }
    })
}