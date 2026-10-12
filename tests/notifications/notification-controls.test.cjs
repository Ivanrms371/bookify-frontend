const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { MemoryRouter } = require('react-router');
const { load } = require('../settings/load.cjs');
const { Button } = load('shared/components/ui/button.tsx');
const session = { id: 'user', activeTenant: { id: 'tenant', slug: 'salon' } };
const auth = { useAuthStore: (select) => select({ session }) };
const render = (component) => renderToStaticMarkup(React.createElement(MemoryRouter, null, component));

test('notification body uses a native keyboard control; only unread items are highlighted and marked', () => {
  const marked = [];
  const { NotificationItem } = load('features/notifications/components/NotificationItem.tsx', {
    '@/core/auth/use-auth-store': auth,
    '@/shared/components/ui': { Button },
    '../hooks/useMarkAsRead': { useMarkAsRead: () => ({ mutate: (id) => marked.push(id) }) },
    '../utils/notification.utils': { notificationIcon: () => null, notificationColor: () => 'bg-blue-100' },
  });
  for (const readAt of [null, '2026-10-11T10:00:00Z']) {
    const item = NotificationItem({ notification: { id: 'notice', title: 'Hello', message: 'Welcome', type: 'tenant.created', createdAt: '2026-10-11T10:00:00Z', readAt } });
    assert.equal(item.props.children[0].type, 'button');
    const html = render(item);
    assert.equal(html.includes('hover:bg-gray-50'), readAt === null);
    item.props.children[0].props.onClick();
  }
  assert.deepEqual(marked, ['notice']);
});

test('mobile notification bell navigates to scoped history rather than opening a hidden dropdown', () => {
  const { NotificationToggle } = load('features/notifications/components/NotificationToggle.tsx', {
    '@/core/auth/use-auth-store': auth,
    '@/shared/components/ui': { Button },
    '@/features/notifications': { NotificationDropdown: () => null },
    '../hooks/useNotifications': { useNotifications: () => ({ unreadCount: 2 }), useNotificationScope: () => ({ tenantId: 'tenant' }) },
    '../hooks/useNotificationSubscription': { useNotificationSubscription() {} },
    '@/shared/hooks/useMediaQuery': { useMediaQuery: () => true },
    react: { ...React, useState: () => [false, () => {}], useRef: () => ({ current: null }), useEffect() {} },
  });
  const html = render(React.createElement(NotificationToggle));
  assert.match(html, /href="\/salon\/notifications"/);
  assert.match(html, /aria-label="Notificaciones"/);
});

test('dropdown cancels its pending animation timer on visibility change or unmount', () => {
  let effect;
  let scheduled;
  let cancelled;
  const { NotificationDropdown } = load('features/notifications/components/NotificationDropdown.tsx', {
    '@/core/auth/use-auth-store': auth,
    '../hooks/useNotifications': { useNotifications: () => ({ notifications: [], unreadCount: 0 }) },
    '../hooks/useMarkAllAsRead': { useMarkAllAsRead: () => ({ mutate() {} }) },
    './NotificationItem': { NotificationItem: () => null },
    react: { ...React, useState: () => [true, () => {}], useEffect: (callback) => { effect = callback; } },
  }, {
    setTimeout: (_callback, delay) => { scheduled = delay; return 42; },
    clearTimeout: (id) => { cancelled = id; },
  });
  for (const isVisible of [true, false]) {
    NotificationDropdown({ isVisible, onClose() {} });
    const cleanup = effect();
    assert.equal(scheduled, isVisible ? 50 : 200);
    cleanup();
    assert.equal(cancelled, 42);
  }
});
