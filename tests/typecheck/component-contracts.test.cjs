const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { File } = require('node:buffer');
function load(path, overrides = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { exports, File, require: (id) => id in overrides ? overrides[id] : require(id) });
  return exports;
}
const cn = (...values) => values.filter((value) => typeof value === 'string').join(' ');
const { Select } = load('app/shared/components/form/Select.tsx', { '@/shared/utils/cn': { cn } });
const field = ({ children }) => React.createElement('div', null, children);
const input = ({ hasError, ...props }) => React.createElement('input', props);
const { SERVICE_DURATION_OPTIONS } = load('app/features/services/constants/service-duration.ts');

test('service duration select renders options, matches the current value, and submits numbers', () => {
  let submitted;
  let durationSelect;
  const { ServiceForm } = load('app/features/services/components/ServiceForm.tsx', {
    'react-hook-form': { Controller: ({ name, render }) => {
      const node = render({ field: { value: name === 'durationMinutes' ? 30 : null, onChange: (value) => { submitted = value; }, onBlur() {} } });
      if (name === 'durationMinutes') durationSelect = node;
      return node;
    } },
    '@/shared/components/form/form-field': { FormField: field },
    '@/shared/components/form/Label': { Label: field },
    '@/shared/components/form/input': { Input: input },
    '@/shared/components/form/NumberInput': { NumberInput: () => null },
    '@/shared/components/form/Textarea': { Textarea: () => null },
    '@/shared/components/feedback/Alert': { Alert: () => null },
    '@/shared/components/form/ImageInput': { ImageInput: () => null },
    '@/shared/components/form/Select': { Select },
    '../constants/service-duration': { SERVICE_DURATION_OPTIONS },
  });
  const html = renderToStaticMarkup(React.createElement(ServiceForm, {
    methods: { register: (name) => ({ name }), control: {}, formState: { errors: {} } },
  }));
  assert.match(html, /value="30" selected=""/);
  assert.doesNotMatch(html, /value=" 30"/);
  durationSelect.props.onChange({ target: { value: '60' } });
  assert.equal(submitted, 60);
});

test('address department renders options and registers the province field', () => {
  const { AddressForm } = load('app/features/tenant/components/AddressForm.tsx', {
    'react-hook-form': { useForm: () => ({ register: (name) => ({ name }), formState: { errors: {} }, handleSubmit: () => () => {} }) },
    'react-router': { useParams: () => ({ tenantId: 'tenant' }) },
    '@/shared/components/form/form-field': { FormField: field },
    '@/shared/components/form/input': { Input: input },
    '@/shared/components/form/Label': { Label: field },
    '@/shared/components/form/Select': { Select },
    '@/shared/constants/provinces': { URUGUAY_DEPARTMENTS: ['Flores', 'Montevideo'] },
    '../hooks/useUpdateTenantAddress': { useUpdateTenantAddress: () => ({ mutate() {} }) },
  });
  const html = renderToStaticMarkup(React.createElement(AddressForm, { initialData: {}, children: null }));
  assert.match(html, /<select[^>]*id="department"[^>]*name="province"/);
  assert.match(html, /value="Montevideo"/);
});

test('service image schema accepts optional files and rejects arbitrary values', () => {
  const { serviceFormSchema } = load('app/features/services/schemas/service-form-schema.ts');
  const base = { name: 'Haircut', durationMinutes: 30, price: 100, professionalIds: [] };
  for (const image of [undefined, null, new File(['image'], 'photo.png', { type: 'image/png' })]) {
    assert.equal(serviceFormSchema.safeParse({ ...base, image }).success, true);
  }
  for (const image of ['photo.png', 42, { name: 'photo.png' }]) {
    const result = serviceFormSchema.safeParse({ ...base, image });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].path[0], 'image');
  }
});

test('reports reads the active tenant from the session and handles missing sessions', () => {
  let session = { activeTenant: { id: 'tenant' } };
  const { default: Reports } = load('app/routes/app/reports.tsx', {
    '@/core/auth/use-auth-store': { useAuthStore: (select) => select({ session }) },
    '@/shared/components/typography': { Heading: field, Text: field },
  });
  assert.match(renderToStaticMarkup(React.createElement(Reports)), /Reportes/);
  session = null;
  assert.equal(renderToStaticMarkup(React.createElement(Reports)), '');
});

test('Radix wrappers load and render using React displayName without mutating function names', () => {
  const { Tabs, TabsList, TabsTrigger, TabsContent } = load('app/shared/components/ui/tabs.tsx', { '@/shared/utils/cn': { cn } });
  const { Accordion, AccordionItem, AccordionTrigger, AccordionContent } = load('app/shared/components/ui/accordion.tsx', { '@/shared/utils/cn': { cn } });
  const tabs = renderToStaticMarkup(React.createElement(Tabs, { defaultValue: 'one' },
    React.createElement(TabsList, null, React.createElement(TabsTrigger, { value: 'one' }, 'Tab')),
    React.createElement(TabsContent, { value: 'one' }, 'Content')));
  const accordion = renderToStaticMarkup(React.createElement(Accordion, { type: 'single', defaultValue: 'one' },
    React.createElement(AccordionItem, { value: 'one' }, React.createElement(AccordionTrigger, null, 'Section'),
      React.createElement(AccordionContent, null, 'Details'))));
  assert.match(tabs, /Content/);
  assert.match(accordion, /Details/);
});
