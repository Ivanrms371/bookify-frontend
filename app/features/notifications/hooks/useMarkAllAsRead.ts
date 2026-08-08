import { useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationsApi } from "../api/notifications-api"
import { notificationKeys } from "./useNotifications"

export const useMarkAllAsRead =() => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: notificationsApi.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all })
        }
    })
}