const assert = require('node:assert/strict');
const { test } = require('node:test');
const React = require('react');
const { load } = require('./load.cjs');

test('a leave confirmation above an exception traps focus/Escape only in the top modal and restores scrolling', () => {
  const layers = [],
    windowHandlers = new Set(),
    focusHandlers = new Set();
  const body = { style: { overflow: 'auto' } };
  let active, currentDialog, cleanups;
  class Node {}
  const window = {
    addEventListener: (_name, callback) => windowHandlers.add(callback),
    removeEventListener: (_name, callback) => windowHandlers.delete(callback),
  };
  const document = {
    body,
    activeElement: null,
    querySelectorAll: () => layers,
    addEventListener: (_name, callback) => focusHandlers.add(callback),
    removeEventListener: (_name, callback) => focusHandlers.delete(callback),
  };
  const closed = [];
  const { Modal } = load(
    'shared/components/ui/modal.tsx',
    {
      react: { ...React, useRef: () => ({ current: currentDialog }), useId: () => 'title', useEffect: (fn) => cleanups.push(fn()) },
      'react-dom': { createPortal: (element) => element },
      '@/shared/hooks/use-overlay': { useOverlay: (key) => ({ close: () => closed.push(key), isVisible: true, shouldRender: true }) },
      './button': { Button: () => null },
      '../typography': { Heading: () => null },
      './drawer': { DrawerHeader: () => null, DrawerTitle: () => null },
    },
    {
      document,
      window,
      Node,
      requestAnimationFrame: (fn) => {
        fn();
        return 1;
      },
      cancelAnimationFrame() {},
    },
  );
  function mount(key) {
    currentDialog = {
      isConnected: true,
      contains: (target) => target === currentDialog,
      focus: () => {
        active = key;
      },
      querySelectorAll: () => [],
    };
    layers.push(currentDialog);
    cleanups = [];
    Modal({ overlayKey: key, children: 'content', manageFocus: true });
    return { dialog: currentDialog, cleanups: [...cleanups] };
  }
  const exception = mount('add-exception-modal');
  const confirmation = mount('settings-leave-modal');
  assert.equal(body.style.overflow, 'hidden');
  active = null;
  for (const callback of focusHandlers) callback({ target: new Node() });
  assert.equal(active, 'settings-leave-modal');
  for (const callback of windowHandlers) callback({ key: 'Escape' });
  assert.deepEqual(closed, ['settings-leave-modal']);
  // Both can unmount in one navigation; cleanup order must not leave overflow hidden.
  layers.splice(0);
  for (const cleanup of exception.cleanups) cleanup?.();
  for (const cleanup of confirmation.cleanups) cleanup?.();
  assert.equal(body.style.overflow, 'auto');
});
