import { NOTIFICATIONS_PAGE_SIZE } from '../constants/notifications.constants';
import { BellIcon } from '@heroicons/react/24/outline';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';
import { useNotifications, useNotificationScope } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

export function NotificationsPage() {
  const { tenantId, userId } = useNotificationScope();
  return <NotificationsHistory key={`${tenantId}:${userId}`} />;
}

function NotificationsHistory() {
  const [page, setPage] = useState(0);
  const { pages, total, isLoading, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } = useNotifications();

  const currentPage = Math.min(page, Math.max(0, pages.length - 1));
  const notifications = pages[currentPage]?.notifications ?? [];
  const hasCachedNext = currentPage + 1 < pages.length;
  const canGoNext = hasCachedNext || Boolean(hasNextPage);
  const showPagination = !isLoading && !isError && total > NOTIFICATIONS_PAGE_SIZE && notifications.length > 0;
  const firstVisible = currentPage * NOTIFICATIONS_PAGE_SIZE + 1;
  const lastVisible = firstVisible + notifications.length - 1;

  const nextPage = async () => {
    if (isFetchingNextPage || !canGoNext) return;
    if (hasCachedNext) {
      setPage(currentPage + 1);
      return;
    }
    const result = await fetchNextPage();
    if (!result.isError && (result.data?.pages.length ?? 0) > currentPage + 1) setPage(currentPage + 1);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
      <section aria-label="Historial de notificaciones" className="overflow-hidden rounded-xl bg-white shadow-sm">
        {isLoading ? (
          <p role="status" className="px-6 py-12 text-center text-sm text-gray-500">
            Cargando notificaciones...
          </p>
        ) : isError ? (
          <div role="alert" className="space-y-4 px-6 py-12 text-center">
            <p className="text-sm text-gray-600">No se pudieron cargar las notificaciones.</p>
            <Button type="button" variant="secondary" size="sm" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-4 rounded-2xl bg-indigo-50 p-3 text-indigo-500">
              <BellIcon className="size-7" />
            </div>
            <h2 className="text-base font-semibold text-gray-800">Estás al día</h2>
            <p className="mt-2 text-sm text-gray-500">Cuando haya novedades, las vas a encontrar acá.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </ul>
        )}
      </section>
      {showPagination && (
        <footer className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-500" aria-live="polite">
            {firstVisible}–{lastVisible} de {total} notificaciones
          </p>
          <nav aria-label="Paginación de notificaciones" className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={currentPage === 0 || isFetchingNextPage}
              onClick={() => setPage(currentPage - 1)}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!canGoNext}
              isSubmitting={isFetchingNextPage}
              onClick={() => void nextPage()}
            >
              Siguiente
            </Button>
          </nav>
        </footer>
      )}
    </div>
  );
}
