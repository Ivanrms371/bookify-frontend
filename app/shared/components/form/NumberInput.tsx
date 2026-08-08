import { useEffect, useState } from 'react';
import { type Control, type FieldPath, type FieldValues, useController } from 'react-hook-form';
import { Input } from './input';
import { decimalInputToNumber, numberToDecimalInput, sanitizeDecimalInput } from '@/shared/utils/numeric-input';

type Props<T extends FieldValues> = Omit<React.ComponentProps<typeof Input>, 'type' | 'value' | 'onChange' | 'onBlur'> & {
  name: FieldPath<T>;
  control: Control<T>;
  maxDecimals?: number;
};

export function NumberInput<T extends FieldValues>({ name, control, maxDecimals = 2, ...inputProps }: Props<T>) {
  const { field, fieldState } = useController({ name, control });

  const [display, setDisplay] = useState(() => numberToDecimalInput(field.value as number));

  useEffect(() => {
    const external = numberToDecimalInput(field.value as number);
    setDisplay((current) => (current.endsWith('.') ? current : external));
  }, [field.value]);

  return (
    <Input
      {...inputProps}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      hasError={!!fieldState.error}
      value={display}
      onChange={(e) => {
        const next = sanitizeDecimalInput(e.target.value, maxDecimals);
        setDisplay(next);

        if (next === '' || next === '.') {
          field.onChange(undefined);
          return;
        }

        if (!next.endsWith('.')) {
          field.onChange(decimalInputToNumber(next));
        }
      }}
      onBlur={() => {
        const trimmed = display.endsWith('.') ? display.slice(0, -1) : display;
        setDisplay(trimmed);
        field.onChange(decimalInputToNumber(trimmed));
        field.onBlur();
      }}
    />
  );
}
