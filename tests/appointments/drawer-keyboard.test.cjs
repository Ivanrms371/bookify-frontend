const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');

function setup(dismissible = true) {
  const listeners = new Map();
  const effects = [];
  let closes = 0;
  const document = { activeElement: null, body: { style: { overflow: '' } },
    addEventListener: (key, handler) => listeners.set(key, handler),
    removeEventListener: (key) => listeners.delete(key),
  };
  class Element {
    isConnected = true;
    focus() { document.activeElement = this; }
    getClientRects() { return [1]; }
  }
  const first = new Element();
  const last = new Element();
  const trigger = new Element();
  const dialog = new Element();
  dialog.querySelectorAll = () => [first, last];
  dialog.contains = (element) => [dialog, first, last].includes(element);
  const refs = [{ current: dialog }, { current: dismissible }];
  let refIndex = 0;
  const primitive = ({ children }) => React.createElement('div', null, children);
  const exports = {};
  const mocks = {
    react: { ...React, useId: () => 'title', useRef: () => refs[refIndex++], useEffect: (fn) => effects.push(fn) },
    'react-dom': { createPortal: (children) => children },
    '@/shared/hooks/use-overlay': { useOverlay: () => ({ isVisible: true, shouldRender: true, close: () => closes++ }) },
    '@/shared/utils/cn': { cn: (...values) => values.filter(Boolean).join(' ') },
    './button': { Button: primitive },
    '../typography': { Heading: primitive },
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/shared/components/ui/drawer.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { exports, document, HTMLElement: Element, require: (id) => mocks[id] ?? require(id) });
  const props = { overlayKey: 'view-appointment-drawer', containFocus: true, returnFocus: trigger, isDismissible: dismissible };
  exports.Drawer(props);
  const cleanups = effects.map((effect) => effect()).filter(Boolean);
  const key = (key, shiftKey = false) => {
    let prevented = false;
    listeners.get('keydown')({ key, shiftKey, preventDefault() { prevented = true; }, stopPropagation() {} });
    return prevented;
  };
  return { first, last, trigger, dialog, document, listeners, key,
    closes: () => closes,
    cleanup: () => cleanups.forEach((cleanup) => cleanup()),
    setDismissible: (isDismissible) => { refIndex = 0; exports.Drawer({ ...props, isDismissible }); },
  };
}

test('shared drawer contains keyboard focus and returns it to its trigger', () => {
  const f = setup();
  assert.equal(f.document.activeElement, f.first);
  f.last.focus(); assert.equal(f.key('Tab'), true);
  assert.equal(f.document.activeElement, f.first);
  assert.equal(f.key('Tab', true), true);
  assert.equal(f.document.activeElement, f.last);
  f.trigger.focus(); f.listeners.get('focusin')({ target: f.trigger });
  assert.equal(f.document.activeElement, f.first);
  f.key('Escape'); assert.equal(f.closes(), 1);
  f.cleanup(); assert.equal(f.document.activeElement, f.trigger);
  assert.equal(f.listeners.size, 0);
  assert.equal(f.document.body.style.overflow, '');
});

test('Escape cannot dismiss during saving and reacts to updated dismissal eligibility', () => {
  const f = setup(false);
  f.key('Escape'); assert.equal(f.closes(), 0);
  f.setDismissible(true);
  f.key('Escape'); assert.equal(f.closes(), 1);
  f.cleanup();
});
