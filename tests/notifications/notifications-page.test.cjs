const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { MemoryRouter } = require('react-router');
const { load } = require('../settings/load.cjs');
const { canAccessArea } = load('core/auth/permissions.ts');
const state = { total: 0, notifications: [], unreadCount: 0, hasNextPage: false, isFetchingNextPage: false, isLoading: false, isError: false, fetchNextPage() {}, refetch() {} };
const mocks = (query) => ({
  '../hooks/useNotifications': { useNotifications: () => ({ ...query, pages: query.pages ?? [{ notifications: query.notifications }] }), useNotificationScope: () => ({ tenantId: 'tenant', userId: 'user' }) },
  '../hooks/useMarkAllAsRead': { useMarkAllAsRead: () => ({ mutate() {}, isPending: false }) },
  './NotificationItem': { NotificationItem: ({ notification }) => React.createElement('li', null, notification.title) },
});
const render = (Component) => renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(Component)));
test('notification history is accessible to any active tenant member, including staff', () => {
  assert.equal(canAccessArea({ id: 'tenant', permissions: [] }, 'notifications'), true);
  assert.equal(canAccessArea(null, 'notifications'), false);
});
test('history renders loaded notifications and older-history pagination', () => {
  const { NotificationsPage } = load('features/notifications/components/NotificationsPage.tsx', mocks({ ...state, notifications: [{ id: 'a', title: 'Welcome' }, { id: 'b', title: 'Appointment' }], hasNextPage: true, unreadCount: 2, total: 60 }));
  const html = render(NotificationsPage);
  assert.match(html, /Welcome/);
  assert.match(html, /Appointment/);
  assert.match(html, /Siguiente/);
  assert.match(html, /Anterior/);
  assert.doesNotMatch(html, /<h1|Todas las novedades/);
  assert.doesNotMatch(html, /<header|Marcar todas como leídas/);
});
test('history distinguishes loading, empty and failed requests without showing cached rows on errors', () => {
  for (const [query, expected] of [
    [{ ...state }, /Estás al día/],
    [{ ...state, isLoading: true }, /Cargando notificaciones/],
    [{ ...state, isError: true, notifications: [{ id: 'a', title: 'Cached notice' }] }, /Reintentar/],
  ]) {
    const { NotificationsPage } = load('features/notifications/components/NotificationsPage.tsx', mocks(query));
    const html = render(NotificationsPage);
    assert.match(html, expected);
    assert.doesNotMatch(html, /Cached notice/);
  }
});
test('dropdown previews five items and links to the current business history page', () => {
  const notices = Array.from({ length: 6 }, (_, index) => ({ id: String(index), title: `Notice ${index}` }));
  const { NotificationDropdown } = load('features/notifications/components/NotificationDropdown.tsx', {
    ...mocks({ ...state, notifications: notices }),
    react: { ...React, useState: () => [true, () => {}], useEffect() {} },
    '@/core/auth/use-auth-store': { useAuthStore: (selector) => selector({ session: { activeTenant: { slug: 'salon' } } }) },
  });
  const html = render(() => React.createElement(NotificationDropdown, { isVisible: true, onClose() {} }));
  assert.match(html, /href="\/salon\/notifications"/);
  assert.match(html, /Ver todas/);
  assert.match(html, /Notice 4/);
  assert.doesNotMatch(html, /Notice 5/);
});

test('notifications requests use 24 items and preserve cursor and tenant scope', () => {
  let configuration;
  let request;
  const { useNotifications } = load('features/notifications/hooks/useNotifications.ts', {
    '@tanstack/react-query': { useInfiniteQuery: (value) => { configuration = value; return {}; } },
    '@/core/auth/use-auth-store': { useAuthStore: (select) => select({ session: { id: 'user', activeTenant: { id: 'tenant' } } }) },
    '../api/notifications-api': { notificationsApi: { getAll: (...args) => { request = args; } } },
  });
  useNotifications();
  configuration.queryFn({ pageParam: 'cursor', signal: undefined });
  assert.equal(request[0], 'tenant');
  assert.equal(request[1].limit, 24);
  assert.equal(request[1].cursor, 'cursor');
});
test('next page replaces visible notifications instead of appending the history', async () => {
  let page = 0;
  let requests = 0;
  const query = { ...state, pages: [{ notifications: [{ id: 'first', title: 'First page' }] }], hasNextPage: true, total: 25,
    async fetchNextPage() { requests++; query.pages.push({ notifications: [{ id: 'second', title: 'Second page' }] }); return { data: { pages: query.pages } }; },
  };
  const { NotificationsPage } = load('features/notifications/components/NotificationsPage.tsx', {
    ...mocks(query), react: { ...React, useState: () => [page, (value) => { page = value; }] },
  });
  const History = NotificationsPage().type;
  const buttons = (node) => !node || typeof node !== 'object' ? [] : [node, ...React.Children.toArray(node.props?.children).flatMap(buttons)];
  let tree = History();
  await buttons(tree).find((node) => node.props?.children === 'Siguiente').props.onClick();
  // onClick starts the async fetch; allow its continuation to advance the page.
  await new Promise(setImmediate);
  tree = History();
  const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, tree));
  assert.match(html, /Second page/);
  assert.doesNotMatch(html, /First page/);
  assert.match(html, /25–25 de 25 notificaciones/);
  buttons(tree).find((node) => node.props?.children === 'Anterior').props.onClick();
  assert.equal(page, 0);
  assert.equal(requests, 1);
});

test('pagination is hidden for 2 or 24 notifications and shown for 25', () => {
  for (const total of [2, 24, 25]) {
    const notifications = Array.from({ length: Math.min(total, 24) }, (_, index) => ({ id: String(index), title: `Notice ${index}` }));
    const { NotificationsPage } = load('features/notifications/components/NotificationsPage.tsx', mocks({ ...state, total, notifications, hasNextPage: total > 24 }));
    const html = render(NotificationsPage);
    if (total > 24) {
      assert.match(html, /1–24 de 25 notificaciones/);
      assert.match(html, /Siguiente/);
    } else {
      assert.doesNotMatch(html, /Paginación de notificaciones|Anterior|Siguiente/);
    }
  }
});
