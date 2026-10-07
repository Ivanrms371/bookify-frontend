import type { ReactNode } from 'react';
import { COUNTRIES } from '@/shared/constants/countries-constants';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { Select } from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { useLocationOptions } from '../hooks/use-location-options';
import { countryChangeValues, regionChangeValues } from '../utils/location-model';
import type { LocationValues } from '../types/location.types';

function LocationSelect({
  name,
  id,
  label,
  placeholder,
  options,
  value,
  onValueChange,
  disabled,
  required,
}: {
  name: 'country' | 'province';
  id: string;
  label: string;
  placeholder: string;
  options: { value: string; label: string; icon?: ReactNode }[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled: boolean;
  required?: boolean;
}) {
  const { control } = useFormContext<LocationValues>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Select
          name={field.name}
          value={value ?? field.value ?? ''}
          label={label}
          icon={options.find((option) => option.value === (value ?? field.value))?.icon}
          placeholder={placeholder}
          options={disabled ? options.map((option) => ({ ...option, disabled: true })) : options}
          disabled={disabled}
          required={required}
          onValueChange={(next) => {
            if (disabled) return;
            field.onChange(next);
            onValueChange?.(next);
          }}
          triggerProps={{ id, ref: field.ref, onBlur: field.onBlur, 'aria-invalid': !!fieldState.error }}
          className={`input w-full rounded-lg text-left ${fieldState.error ? 'input-error' : ''}`}
        />
      )}
    />
  );
}

export function LocationFields({
  idPrefix = 'studio',
  requiredAddress = false,
  showPreferences = true,
  disabled = false,
}: {
  idPrefix?: string;
  requiredAddress?: boolean;
  showPreferences?: boolean;
  disabled?: boolean;
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useFormContext<LocationValues>();
  const query = useLocationOptions();
  const country = watch('country') ?? '';
  const province = watch('province') ?? '';
  const timeZone = watch('timeZone') ?? '';
  const currency = watch('currency') ?? '';
  const selected = query.data?.countries.find((option) => option.code === country || option.label.toLowerCase() === country.toLowerCase());
  const updateCountry = (code: string) => {
    const next = countryChangeValues(query.data?.countries.find((option) => option.code === code));
    for (const [key, value] of Object.entries(next))
      setValue(key as keyof LocationValues, value, { shouldDirty: true, shouldValidate: isSubmitted });
  };
  const updateRegion = (value: string) => {
    for (const [key, next] of Object.entries(regionChangeValues(selected, value)))
      setValue(key as keyof LocationValues, next, { shouldDirty: true, shouldValidate: isSubmitted });
  };
  if (query.isPending)
    return (
      <p role="status" className="text-sm text-gray-500">
        Cargando países y zonas horarias…
      </p>
    );
  if (!query.data)
    return (
      <div role="alert" className="space-y-2">
        <p>No se pudieron cargar los países.</p>
        <Button type="button" variant="secondary" onClick={() => void query.refetch()}>
          Reintentar
        </Button>
      </div>
    );
  const countryOptions = query.data.countries.map((option) => {
    const flag = COUNTRIES.find((country) => country.code === option.code);
    return {
      value: option.code,
      label: option.label,
      icon: flag ? <img src={flag.flagUrl} alt="" className="w-5 h-auto rounded-xs shadow-sm object-cover" /> : undefined,
    };
  });
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <FormField id={`${idPrefix}-country`} className="sm:col-span-2" label="País" error={errors.country?.message}>
        <LocationSelect
          id={`${idPrefix}-country`}
          name="country"
          label="País"
          placeholder="Selecciona un país"
          disabled={disabled}
          required={requiredAddress}
          value={selected?.code ?? country}
          onValueChange={updateCountry}
          options={countryOptions}
        />
      </FormField>
      <FormField id={`${idPrefix}-province`} label={selected?.regionLabel ?? 'Región / Provincia'} error={errors.province?.message}>
        <LocationSelect
          id={`${idPrefix}-province`}
          name="province"
          label={selected?.regionLabel ?? 'Provincia / Departamento'}
          placeholder={selected ? `Selecciona ${selected.regionLabel.toLowerCase()}` : 'Selecciona primero un país'}
          disabled={disabled || !selected}
          required={requiredAddress}
          value={province}
          onValueChange={updateRegion}
          options={[
            ...(selected?.regions.map((region) => ({ value: region.value, label: region.label })) ?? []),
            ...(!selected?.regions.some((region) => region.value === province) && province ? [{ value: province, label: province }] : []),
          ]}
        />
      </FormField>
      <FormField id={`${idPrefix}-city`} label="Ciudad / Localidad" error={errors.city?.message}>
        <Input id={`${idPrefix}-city`} {...register('city')} placeholder="Tu ciudad o localidad" required={requiredAddress} />
      </FormField>
      <FormField id={`${idPrefix}-address`} label="Dirección (calle 1)" error={errors.addressLine1?.message}>
        <Input id={`${idPrefix}-address`} {...register('addressLine1')} placeholder="Calle y número" required={requiredAddress} />
      </FormField>
      <FormField id={`${idPrefix}-complement`} label="Dirección (calle 2, opcional)" error={errors.addressLine2?.message}>
        <Input id={`${idPrefix}-complement`} {...register('addressLine2')} placeholder="Apartamento, piso o referencia" />
      </FormField>
      {showPreferences && (
        <>
          <FormField id={`${idPrefix}-currency`} label="Moneda">
            <Input id={`${idPrefix}-currency`} value={currency} readOnly aria-readonly="true" />
          </FormField>
          <FormField id={`${idPrefix}-timezone`} label="Zona horaria">
            <Input id={`${idPrefix}-timezone`} value={timeZone.replaceAll('_', ' ')} readOnly aria-readonly="true" />
          </FormField>
          <p className="text-xs text-gray-500 sm:col-span-2">
            La moneda y la zona horaria se determinan automáticamente según el país y la región de tu negocio.
          </p>
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 sm:col-span-2">
        <FormField
          id={`${idPrefix}-phone`}
          className="sm:col-span-2"
          label="Teléfono del estudio (opcional)"
          error={errors.phoneNumber?.message}
        >
          <Input id={`${idPrefix}-phone`} type="tel" {...register('phoneNumber')} placeholder="Incluye el código de país" />
        </FormField>
      </div>
    </div>
  );
}
