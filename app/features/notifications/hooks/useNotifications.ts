// modules/notifications/hooks/useNotifications.ts
import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsService } from '../services/notifications.service'
import { useTenantStore } from '@/core/tenant/useTenantStore'
import { io, Socket } from 'socket.io-client'

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
}

export function useNotifications() {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore((s) => s.activeTenant?.id)

  const { data } = useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationsService.getAll,
    enabled: !!tenantId,
  })

  useEffect(() => {
    if (!tenantId) return

    // withCredentials envía las cookies → NestJS valida la sesión
    const socket: Socket = io(`${import.meta.env.VITE_API_URL}/notifications`, {
      withCredentials: true,
    })

    socket.on('connect', () => {
      console.log('[notifications] conectado:', socket.id)
    })

    socket.on('notification', () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    })

    socket.on('disconnect', () => {
      console.log('[notifications] desconectado')
    })

    return () => {
      socket.disconnect()
    }
  }, [tenantId])

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
  }
}