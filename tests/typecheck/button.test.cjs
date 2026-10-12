const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { MemoryRouter } = require('react-router');
const { load } = require('../settings/load.cjs');
const { Button } = load('shared/components/ui/button.tsx');
const render = (props) => renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(Button, props, 'Continuar')));

test('renders native button attributes and submitting state', () => {
  const html = render({ variant: 'primary', type: 'submit', name: 'save', isSubmitting: true });
  assert.match(html, /<button/);
  assert.match(html, /type="submit"/);
  assert.match(html, /name="save"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /aria-busy="true"/);
});
test('renders a router destination with shared styles and link attributes', () => {
  const html = render({ to: '/salon/calendar', variant: 'secondary', size: 'sm', target: '_blank', fullWidth: true });
  assert.match(html, /<a /);
  assert.match(html, /href="\/salon\/calendar"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /btn-secondary/);
  assert.match(html, /w-full/);
  assert.doesNotMatch(html, /<button/);
});
test('disabled and submitting links cannot navigate by click, keyboard or opening a new tab', () => {
  for (const props of [{ disabled: true }, { isSubmitting: true }]) {
    const html = render({ to: '/salon/calendar', 'aria-label': 'Abrir agenda', ...props });
    assert.match(html, /aria-label="Abrir agenda"/);
    assert.match(html, /role="link"/);
    assert.match(html, /aria-disabled="true"/);
    assert.doesNotMatch(html, /href=|<a /);
  }
});
test('enabled buttons retain their click callback', () => {
  let clicks = 0;
  const element = Button({ variant: 'primary', onClick: () => clicks++ });
  element.props.onClick();
  assert.equal(clicks, 1);
});
