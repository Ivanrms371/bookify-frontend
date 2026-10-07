const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function load(path, overrides = {}) {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } })
      .outputText,
    { exports, require: (id) => (id in overrides ? overrides[id] : require(id)) },
  );
  return exports;
}
const button = ({ children, variant, fullWidth, icon, iconPosition, ...props }) => React.createElement('button', props, children);
const text = ({ children, as = 'p', ...props }) => React.createElement(as, { className: props.className }, children);
const ui = { Button: button };
const typography = { Heading: text, Text: text };
const link = ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children);
const router = { useParams: () => ({ slug: 'business' }), Link: link };
const { planSelection } = load('app/features/billing/utils/plan-selection.ts');

test('unknown billing access disables selection without claiming the user is not the owner', () => {
  const { PlanCard } = load('app/features/billing/components/plans/plan-card.tsx', {
    '@/shared/components/typography': typography,
    '@/shared/components/ui': ui,
    '@/shared/utils': { cn: (...classes) => classes.filter(Boolean).join(' ') },
  });
  const plan = {
    id: 'free', title: 'Free', description: '', features: [], currency: 'USD',
    pricing: { MONTHLY: { amount: '0' } }, availability: { MONTHLY: true, ANNUAL: true },
  };
  const render = (canManage) => renderToStaticMarkup(React.createElement(PlanCard, {
    plan, isAnnual: false, canManage, pending: false, onSelect() {},
  }));
  assert.match(render(undefined), /disabled/);
  assert.doesNotMatch(render(undefined), /Solo el propietario/);
  assert.match(render(false), /Solo el propietario/);
  assert.doesNotMatch(render(true), /disabled|Solo el propietario/);
});

test('Free selection never sends a cycle, even on annual pricing', () => {
  for (const annual of [true, false]) assert.equal(JSON.stringify(planSelection('free', annual)), '{"planId":"free"}');
  assert.equal(planSelection('pro', true).cycle, 'ANNUAL');
  assert.equal(planSelection('pro_plus', false).cycle, 'MONTHLY');
});
function review(eligibility) {
  const { PlanChangeReview } = load('app/features/billing/components/plans/plan-change-review.tsx', {
    'react-router': router,
    '@/shared/components/ui': ui,
    '../../hooks/use-plan-change': {
      useChangeEligibility: () => ({ data: eligibility }),
      usePlanChange: () => ({ isPending: false, mutate() {} }),
    },
    '../../utils/billing-format': { formatBillingDate: (date) => date },
  });
  return renderToStaticMarkup(React.createElement(PlanChangeReview, { selection: { planId: 'free' }, canManage: true }));
}
test('trial review clearly explains immediate activation and loss of trial benefits', () => {
  const html = review({
    eligible: true,
    blockers: [],
    kind: 'free',
    effectiveAt: null,
    endsTrial: true,
    usage: { professionals: 1, services: 10 },
  });
  assert.match(html, /Activar Free/);
  assert.match(html, /Perderás los días restantes/);
  assert.match(html, /no recibirás una nueva prueba/);
  assert.match(html, /1 de 1 profesional/);
  assert.doesNotMatch(html, /pagar diferencia/);
});
test('paid review explains end-of-period activation, cancelled renewal and pending caps', () => {
  const html = review({ eligible: true, blockers: [], kind: 'free', effectiveAt: '2026-11-05', usage: { professionals: 1, services: 10 } });
  assert.match(html, /Programar cambio a Free/);
  assert.match(html, /2026-11-05/);
  assert.match(html, /dejará de renovarse/);
  assert.match(html, /Desde ahora/);
});
test('blocked review shows cleanup links and no confirmation button', () => {
  const html = review({
    eligible: false,
    blockers: [{ code: 'PLAN_LIMIT_REACHED', resource: 'services', message: 'Elimina 2 servicios' }],
  });
  assert.match(html, /\/business\/services/);
  assert.match(html, /Elimina 2 servicios/);
  assert.doesNotMatch(html, /Activar Free|Programar cambio a Free/);
});
test('Free card is selectable on annual view and disabled when already current', () => {
  const { PlanCard } = load('app/features/billing/components/plans/plan-card.tsx', {
    '@/shared/components/typography': typography,
    '@/shared/components/ui': ui,
    '@/shared/utils': { cn: (...values) => values.filter(Boolean).join(' ') },
  });
  const props = {
    plan: {
      id: 'free',
      title: 'Free',
      description: 'Free',
      features: [],
      pricing: { MONTHLY: { amount: '0' } },
      availability: { MONTHLY: true, ANNUAL: false },
    },
    isAnnual: true,
    canManage: true,
    pending: false,
    onSelect() {},
  };
  const available = renderToStaticMarkup(React.createElement(PlanCard, props));
  assert.match(available, /Elegir Free/);
  assert.doesNotMatch(available, /disabled=""/);
  const current = renderToStaticMarkup(React.createElement(PlanCard, { ...props, isCurrent: true }));
  assert.match(current, /disabled=""/);
  assert.match(current, /Tu plan actual/);
});
test('plan-change calls use existing routes, bind the tenant and prevent auth mutation retries', async () => {
  const requests = [];
  const client = Object.fromEntries(
    ['get', 'post', 'delete'].map((method) => [
      method,
      (...args) => {
        requests.push({ method, args });
        return Promise.resolve({});
      },
    ]),
  );
  const { billingApi } = load('app/features/billing/api/billing-api.ts', { '@/core/http/httpClient': { httpClient: client } });
  await billingApi.changePlan(planSelection('free', true), 'tenant-a');
  await billingApi.cancelPlanChange('tenant-a');
  await billingApi.refreshPlanChange('tenant-a');
  assert.equal(requests[0].args[0], '/subscriptions/plan-change');
  assert.equal(JSON.stringify(requests[0].args[1]), '{"planId":"free"}');
  assert.equal(requests[1].args[0], '/subscriptions/plan-change');
  assert.equal(requests[2].args[0], '/subscriptions/plan-change/refresh');
  for (const request of requests) {
    const options = request.args.at(-1);
    assert.equal(options.expectedTenantId, 'tenant-a');
    assert.equal(options.skipAuthRetry, true);
  }
});

test('resource gate uses total non-deleted usage and handles a scheduled Free downgrade', () => {
  const { hasFreeResourceLimit } = load('app/features/billing/utils/resource-limit.ts');
  const summary = (planId, professionals, services = 0, pendingPlanId = null) => ({
    subscription: { planId, pendingPlanId }, usage: { professionals, services },
  });
  assert.equal(hasFreeResourceLimit(undefined, 'professionals'), false);
  assert.equal(hasFreeResourceLimit(summary('free', 0), 'professionals'), false);
  assert.equal(hasFreeResourceLimit(summary('free', 1), 'professionals'), true);
  assert.equal(hasFreeResourceLimit(summary('free', 3), 'professionals'), true);
  assert.equal(hasFreeResourceLimit(summary('pro', 1), 'professionals'), false);
  assert.equal(hasFreeResourceLimit(summary('pro', 1, 0, 'free'), 'professionals'), true);
  assert.equal(hasFreeResourceLimit(summary('free', 0, 9), 'services'), false);
  assert.equal(hasFreeResourceLimit(summary('free', 0, 10), 'services'), true);
});

test('reusable limit modal provides resource-specific copy and both requested actions', () => {
  let destination;
  let closed = false;
  const { PlanLimitModal } = load('app/features/billing/components/plan-limit-modal.tsx', {
    '@/core/auth/permissions': { can: () => true },
    react: { ...React, useEffect() {}, useRef: (value) => ({ current: value }) },
    'react-router': { useLocation: () => ({ pathname: '/business/professionals' }), useNavigate: () => (to) => { destination = to; } },
    '@/core/auth/use-auth-store': { useAuthStore: (select) => select({ session: { activeTenant: { id: 'tenant', slug: 'business', role: 'OWNER' } } }) },
    '@/shared/hooks/use-overlay': { useOverlay: () => ({ close: () => { closed = true; } }) },
    '@/shared/components/ui': { Button: button, Modal: ({ title, children, footer }) => React.createElement('section', null, title, children, footer) },
  });
  const element = PlanLimitModal({ resource: 'professionals', tenantId: 'tenant' });
  const html = renderToStaticMarkup(element);
  assert.match(html, /Tu plan incluye 1 profesional/);
  assert.match(html, /Aceptar/);
  assert.match(html, /Ver planes/);
  element.props.footer.props.children[1].props.onClick();
  assert.equal(closed, true);
  assert.equal(destination, '/business/billing/plans');
  assert.match(renderToStaticMarkup(PlanLimitModal({ resource: 'services', tenantId: 'tenant' })), /hasta 10 servicios/);
  assert.equal(PlanLimitModal({ resource: 'professionals', tenantId: 'other-tenant' }), null);
});
