/**
 * Sanitizes free-text numeric input: digits + one decimal separator, no leading zeros (except 0.x).
 */
export function sanitizeDecimalInput(raw: string, maxDecimals = 2): string {
  if (raw === '') return '';

  if (maxDecimals === 0) {
    const digits = raw.replace(/\D/g, '');
    if (digits === '') return '';
    return digits.length > 1 ? digits.replace(/^0+/, '') || '0' : digits;
  }

  let value = raw.replace(/,/g, '.').replace(/[^\d.]/g, '');

  const firstDot = value.indexOf('.');
  if (firstDot !== -1) {
    value = value.slice(0, firstDot + 1) + value.slice(firstDot + 1).replace(/\./g, '');
  }

  let [intPart = '', decPart] = value.split('.');

  if (intPart.length > 1) {
    intPart = intPart.replace(/^0+/, '') || '0';
  }

  if (decPart !== undefined) {
    decPart = decPart.slice(0, maxDecimals);
    if (value.endsWith('.')) {
      return decPart.length > 0 ? `${intPart}.${decPart}` : `${intPart}.`;
    }
    return `${intPart}.${decPart}`;
  }

  return intPart;
}

export function decimalInputToNumber(value: string): number | undefined {
  if (value === '' || value === '.') return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

export function numberToDecimalInput(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '';
  return String(value);
}
