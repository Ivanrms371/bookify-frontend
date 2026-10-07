const assert = require('node:assert/strict');
const { test } = require('node:test');
const React = require('react');
const { load } = require('./load.cjs');

// Exercise the actual tab/controller callbacks without a browser or business API.
function fixture() {
  const slots = [],
    effects = [],
    listeners = new Map();
  let cursor = 0,
    tree,
    predicate,
    modal;
  const same = (a, b) => a && b && a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
  const hooks = {
    ...React,
    useState(initial) {
      const slot = cursor++;
      if (!(slot in slots)) slots[slot] = typeof initial === 'function' ? initial() : initial;
      return [
        slots[slot],
        (next) => {
          slots[slot] = typeof next === 'function' ? next(slots[slot]) : next;
        },
      ];
    },
    useRef(value) {
      const slot = cursor++;
      return (slots[slot] ??= { current: value });
    },
    useMemo(fn, deps) {
      const slot = cursor++;
      if (!slots[slot] || !same(slots[slot].deps, deps)) slots[slot] = { deps, value: fn() };
      return slots[slot].value;
    },
    useCallback(fn, deps) {
      return hooks.useMemo(() => fn, deps);
    },
    useEffect(fn, deps) {
      const slot = cursor++;
      if (!slots[slot] || !same(slots[slot].deps, deps))
        effects.push(() => {
          slots[slot]?.cleanup?.();
          slots[slot] = { deps, cleanup: fn() };
        });
    },
  };
  const General = () => null,
    Booking = () => null,
    Schedule = () => null;
  let proceeded = 0,
    stayed = 0;
  const blocker = {
    state: 'unblocked',
    proceed: () => {
      proceeded++;
    },
    reset: () => {
      stayed++;
    },
  };
  const overlay = {
    open: (props) => {
      modal = props;
    },
    close: () => {
      modal = null;
    },
  };
  const { TenantSettingsSection } = load(
    'features/settings/components/tenant-settings.tsx',
    {
      react: hooks,
      'react-router': {
        useBlocker: (callback) => {
          predicate = callback;
          return blocker;
        },
      },
      '@/core/auth/use-auth-store': {
        useAuthStore: (selector) => selector({ session: { id: 'user', activeTenant: { id: 'a', slug: 'salon', role: 'OWNER' } } }),
      },
      '@/shared/hooks/use-overlay': { useOverlay: () => overlay },
      '../hooks/use-settings-draft': { SettingsDraftContext: React.createContext(null) },
      './tenant-general-settings': { TenantGeneralSettings: General },
      './appointment-settings': { AppointmentSettings: Booking },
      './schedule-settings': { ScheduleSettings: Schedule },
      '../team/team-settings': { TeamSettings: () => null },
    },
    {
      window: {
        addEventListener: (name, callback) => listeners.set(name, callback),
        removeEventListener: (name) => listeners.delete(name),
      },
    },
  );
  const element = TenantSettingsSection();
  function render() {
    cursor = 0;
    tree = element.type();
    while (effects.length) effects.shift()();
    return tree;
  }
  function nodes(node) {
    if (Array.isArray(node)) return node.flatMap(nodes);
    if (!node || typeof node !== 'object') return [];
    return [node, ...nodes(node.props?.children)];
  }
  function clickTab(name) {
    nodes(tree)
      .find((node) => node.type === 'button' && node.props.children === name)
      .props.onClick();
    render();
  }
  render();
  return {
    render,
    nodes: () => nodes(tree),
    clickTab,
    listeners,
    blocker,
    dirty: (id, status) => {
      tree.props.value.report(id, status);
      render();
    },
    context: () => tree.props.value,
    modal: () => modal,
    predicate: () => predicate,
    proceeded: () => proceeded,
    stayed: () => stayed,
    General,
    Booking,
  };
}
test('visited Settings forms remain mounted between tabs and only the active tab shows its save bar', () => {
  const f = fixture();
  f.dirty('general', { dirty: true, pending: false });
  f.clickTab('Ajustes de Reservas');
  const general = f.nodes().find((node) => node.type === f.General);
  const booking = f.nodes().find((node) => node.type === f.Booking);
  assert.equal(general.props.active, false);
  assert.equal(booking.props.active, true);
  f.clickTab('Ajustes Generales');
  assert.equal(f.nodes().find((node) => node.type === f.Booking).props.active, false);
  assert.equal(f.nodes().find((node) => node.type === f.General).props.active, true);
});
test('dirty drafts block leaving Settings and browser reload; stay/leave are explicit and canonical slug redirects are allowed once', () => {
  const f = fixture();
  const transition = { currentLocation: { pathname: '/salon/settings' }, nextLocation: { pathname: '/salon/calendar' } };
  assert.equal(f.predicate()(transition), false);
  f.dirty('general', { dirty: true, pending: false });
  assert.equal(f.predicate()(transition), true);
  let prevented = false;
  const event = {
    preventDefault() {
      prevented = true;
    },
  };
  f.listeners.get('beforeunload')(event);
  assert.equal(prevented, true);
  assert.equal(event.returnValue, '');
  f.blocker.state = 'blocked';
  f.render();
  f.modal().stay();
  assert.equal(f.stayed(), 1);
  // Refresh the changed blocker object as React Router does for each transition.
  f.blocker.state = 'unblocked';
  f.render();
  f.blocker.state = 'blocked';
  f.dirty('booking', { dirty: true, pending: true });
  assert.equal(f.modal().pending, true);
  f.dirty('booking', { dirty: true, pending: false });
  f.modal().leave();
  assert.equal(f.proceeded(), 1);
  f.context().allowNavigation('/renamed/settings');
  const renamed = { ...transition, nextLocation: { pathname: '/renamed/settings' } };
  assert.equal(f.predicate()(renamed), false);
  assert.equal(f.predicate()(renamed), true);
  f.dirty('general', null);
  f.dirty('booking', null);
  assert.equal(f.listeners.has('beforeunload'), false);
});
