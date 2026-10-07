const assert = require('node:assert/strict');
const { test } = require('node:test');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { load } = require('../settings/load.cjs');
const uy = {
  code: 'UY',
  label: 'Uruguay',
  currency: 'UYU',
  currencies: ['UYU'],
  defaultTimeZone: 'America/Montevideo',
  timeZones: ['America/Montevideo'],
  regionLabel: 'Departamento',
  regions: [{ value: 'Montevideo', label: 'Montevideo', timeZone: 'America/Montevideo' }],
};
const cl = {
  code: 'CL',
  label: 'Chile',
  currency: 'CLP',
  currencies: ['CLP'],
  defaultTimeZone: 'America/Santiago',
  timeZones: ['America/Santiago', 'Pacific/Easter'],
  regionLabel: 'Región',
  regions: [{ value: 'Valparaíso', label: 'Valparaíso', timeZone: '' }],
};
const data = { countries: [uy, cl], currencies: ['UYU', 'USD'], timeZones: [...uy.timeZones, ...cl.timeZones] };

test('country changes clear dependent region/city and derive currency while multiple-zone countries require a selection', () => {
  const { countryChangeValues } = load('shared/location/utils/location-model.ts');
  assert.deepEqual(JSON.parse(JSON.stringify(countryChangeValues(uy))), {
    country: 'UY',
    province: '',
    city: '',
    currency: 'UYU',
    timeZone: 'America/Montevideo',
  });
  assert.equal(countryChangeValues(cl).timeZone, 'America/Santiago');
});
test('region changes clear city and derive the timezone only when region metadata exists', () => {
  const { regionChangeValues } = load('shared/location/utils/location-model.ts');
  assert.deepEqual(JSON.parse(JSON.stringify(regionChangeValues(uy, 'Montevideo'))), {
    province: 'Montevideo',
    city: '',
    timeZone: 'America/Montevideo',
  });
  assert.deepEqual(JSON.parse(JSON.stringify(regionChangeValues(cl, 'Valparaíso'))), {
    province: 'Valparaíso',
    city: '',
    timeZone: 'America/Santiago',
  });
});
test('shared location options use the neutral API with request cancellation', async () => {
  let args;
  const { locationApi } = load('shared/location/api/location-api.ts', {
    '@/core/http/httpClient': {
      httpClient: {
        get: async (...input) => {
          args = input;
          return data;
        },
      },
    },
  });
  const signal = new AbortController().signal;
  assert.equal(await locationApi.getOptions(signal), data);
  assert.equal(args[0], '/locations/options');
  assert.equal(args[1].signal, signal);
});
function render(country, query = { data, isPending: false }, captures = [], props = {}, selects = [], isSubmitted = false) {
  const { Select } = load('shared/components/ui/select.tsx');
  const values = { country, province: '', city: '', currency: '', timeZone: '' };
  const { LocationFields } = load('shared/location/components/location-fields.tsx', {
    'react-hook-form': {
      Controller: ({ name, render }) =>
        render({
          field: { name, value: values[name] ?? '', onChange: (value) => captures.push([name, value]), onBlur() {}, ref() {} },
          fieldState: {},
        }),
      useFormContext: () => ({
        register: (name) => ({ name }),
        watch: (name) => values[name],
        setValue: (key, value, options) => captures.push([key, value, options]),
        formState: { errors: {}, isSubmitted },
      }),
    },
    '../hooks/use-location-options': { useLocationOptions: () => query },
    '@/shared/components/ui/select': {
      Select: (props) => {
        selects.push(props);
        return React.createElement(Select, props);
      },
    },
  });
  return renderToStaticMarkup(React.createElement(LocationFields, props));
}
test('shared fields offer country-specific region selectors and timezone choices', () => {
  const uyHtml = render('UY');
  assert.match(uyHtml, /<button[^>]*role="combobox"[^>]*id="studio-province"/);
  assert.match(uyHtml, /Departamento/);
  const selects = [];
  const clHtml = render('CL', undefined, [], {}, selects);
  assert.match(clHtml, /<button[^>]*role="combobox"[^>]*id="studio-province"/);
  assert.equal(selects.length, 2);
  assert.match(clHtml, /<input[^>]*id="studio-currency"[^>]*readOnly=""/i);
  assert.match(clHtml, /<input[^>]*id="studio-timezone"[^>]*readOnly=""/i);
  assert.match(clHtml, /Teléfono del estudio \(opcional\)/);
});
test('loading and failure show useful states without replacing form values', () => {
  assert.match(render('UY', { isPending: true }), /Cargando países/);
  assert.match(render('UY', { isPending: false, refetch() {} }), /Reintentar/);
});
test('address validates independently from business and only accepts the five countries', () => {
  const { locationSchema } = load('shared/location/schemas/location-schema.ts');
  const { businessStepSchema } = load('features/onboarding/schemas/business-step.schema.ts');
  const { TENANT_TYPE_VALUES } = load('shared/constants/tenant-type.ts');
  const valid = {
    country: 'UY',
    province: 'Montevideo',
    city: 'Montevideo',
    addressLine1: 'Calle 123',
    currency: 'UYU',
    timeZone: 'America/Montevideo',
  };
  assert.equal(locationSchema.safeParse(valid).success, true);
  assert.equal(locationSchema.safeParse({ ...valid, country: 'US' }).success, false);
  assert.equal(locationSchema.safeParse({ ...valid, addressLine1: '' }).success, false);
  assert.equal(locationSchema.safeParse({ ...valid, phoneNumber: '123' }).success, false);
  assert.equal(businessStepSchema.safeParse({ name: 'Studio', type: TENANT_TYPE_VALUES[0] }).success, true);
});
test('address route follows business in the seven-step navigation', () => {
  const { ONBOARDING_STEPS, ONBOARDING_STATUS_TO_ROUTE } = load('shared/constants/onboarding.ts');
  const { getOnboardingStepIdFromPathname, getOnboardingStepIndex } = load('shared/utils/onboarding-steps.ts');
  assert.equal(ONBOARDING_STEPS.length, 7);
  assert.equal(ONBOARDING_STEPS[1].id, 'address');
  assert.equal(ONBOARDING_STATUS_TO_ROUTE.LOCATION, '/onboarding/address');
  assert.equal(getOnboardingStepIdFromPathname('/onboarding/address'), 'LOCATION');
  assert.equal(getOnboardingStepIndex('/onboarding/address'), 1);
});
test('shared address fields have country first, region/city beside each other and phone last', () => {
  const html = render('UY');
  const positions = ['country', 'province', 'city', 'addressLine1', 'addressLine2', 'phoneNumber'].map((name) =>
    html.indexOf(`name="${name}"`),
  );
  assert.ok(positions.every((position, i) => position >= 0 && (i === 0 || position > positions[i - 1])));
  assert.match(html, /class="[^"]*sm:col-span-2[^"]*"><label[^>]*for="studio-country"/);
  assert.match(html, /class="[^"]*sm:col-span-2[^"]*"><label[^>]*for="studio-phone"/);
});
test('address API saves separately from business', async () => {
  let args;
  const { onboardingApi } = load('features/onboarding/api/onboarding-api.ts', {
    '@/core/http/httpClient': {
      httpClient: {
        patch: async (...input) => {
          args = input;
          return {};
        },
      },
    },
  });
  const payload = {
    country: 'PE',
    province: 'Lima',
    city: 'Lima',
    addressLine1: 'Calle 123',
    currency: 'USD',
    timeZone: 'America/Montevideo',
  };
  await onboardingApi.updateLocation(payload);
  assert.equal(args[0], '/onboarding/location');
  assert.deepEqual(JSON.parse(JSON.stringify(args[1])), { country: 'PE', province: 'Lima', city: 'Lima', addressLine1: 'Calle 123' });
});

test('Radix selection updates form values and dependent fields; disabled selectors prevent edits', () => {
  const captures = [];
  const selects = [];
  render('UY', undefined, captures, { requiredAddress: true }, selects);
  const country = selects.find((select) => select.name === 'country');
  assert.equal(country.required, true);
  assert.equal(country.triggerProps.id, 'studio-country');
  assert.equal(
    country.options.some((option) => option.value === ''),
    false,
  );
  country.onValueChange('CL');
  assert.ok(captures.some(([name, value]) => name === 'country' && value === 'CL'));
  assert.ok(captures.some(([name, value]) => name === 'province' && value === ''));
  assert.ok(captures.some(([name, value]) => name === 'city' && value === ''));
  assert.ok(captures.some(([name, value]) => name === 'currency' && value === 'CLP'));
  const disabled = [];
  const blockedChanges = [];
  render('UY', undefined, blockedChanges, { disabled: true }, disabled);
  assert.ok(disabled.every((select) => select.disabled && select.options.every((option) => option.disabled)));
  disabled.find((select) => select.name === 'country').onValueChange('CL');
  assert.equal(blockedChanges.length, 0);
});

test('address errors appear on submit and clear as the city is corrected', async () => {
  const { createFormControl } = require('react-hook-form');
  let form;
  const { AddressStep } = load('features/onboarding/steps/address-step.tsx', {
    'react-hook-form': {
      useForm: (options) => {
        form = createFormControl(options);
        return { ...form, formState: { isSubmitting: false } };
      },
      FormProvider: ({ children }) => children,
    },
    '../components/step-navigation': { StepNavigation: ({ children }) => children, BackButton: () => null, NextButton: () => null },
    '@/shared/location/components/location-fields': { LocationFields: () => null },
    '@/shared/location/hooks/use-location-options': { useLocationOptions: () => ({ data }) },
    '../hooks/use-onboarding': {
      useOnboarding: () => ({
        savedData: {
          country: 'UY',
          province: 'Montevideo',
          city: '',
          addressLine1: 'Calle 123',
          currency: 'UYU',
          timeZone: 'America/Montevideo',
        },
        back() {},
        next() {},
      }),
    },
    '../hooks/use-save-location': { useSaveLocation: () => ({ mutateAsync() {}, isPending: false }) },
  });
  renderToStaticMarkup(React.createElement(AddressStep));
  form.subscribe({ formState: { errors: true }, callback() {} });
  const field = form.register('city');
  const input = { name: 'city', type: 'text', value: '' };
  field.ref(input);
  form.setValue('city', '', { shouldValidate: false });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(form.getFieldState('city').error, undefined);
  await form.handleSubmit(() => assert.fail('An empty city must block submission'))();
  assert.equal(form.getFieldState('city').error.message, 'Ingresa una ciudad o localidad');
  input.value = 'Montevideo';
  await field.onChange({ type: 'change', target: input });
  assert.equal(form.getValues('city'), 'Montevideo');
  assert.equal(form.getFieldState('city').error, undefined);
  input.value = '   ';
  await field.onChange({ type: 'change', target: input });
  assert.equal(form.getFieldState('city').error.message, 'Ingresa una ciudad o localidad');
});

test('province validation describes choosing from a selector', () => {
  const { locationSchema } = load('shared/location/schemas/location-schema.ts');
  const result = locationSchema.shape.province.safeParse('');
  assert.equal(result.success, false);
  assert.equal(result.error.issues[0].message, 'Selecciona una provincia, departamento o región');
});

test('region remains a disabled selector until a country is chosen', () => {
  const selects = [];
  const html = render('', undefined, [], {}, selects);
  const region = selects.find((select) => select.name === 'province');
  assert.equal(region.disabled, true);
  assert.equal(region.placeholder, 'Selecciona primero un país');
  assert.match(html, /<button[^>]*role="combobox"[^>]*disabled=""[^>]*id="studio-province"/);
  assert.doesNotMatch(html, /<input[^>]*name="province"/);
});

test('country and region changes defer validation until the first submit attempt', () => {
  for (const submitted of [false, true]) {
    const changes = [];
    const selects = [];
    render('UY', undefined, changes, {}, selects, submitted);
    selects.find((select) => select.name === 'country').onValueChange('CL');
    selects.find((select) => select.name === 'province').onValueChange('Montevideo');
    const updates = changes.filter((change) => change[2]);
    assert.ok(updates.length > 0);
    assert.ok(updates.every((change) => change[2].shouldValidate === submitted));
  }
});
