export function normalizePhone(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, '');

  if (digits.length > 1 && digits.startsWith('0')) {
    return digits.slice(1);
  }

  return digits;
}

export const formatPhoneForDisplay = (phoneNumber: string, countryCode: string): string => {
  const code = countryCode.replace(/\D/g, '');
  let number = phoneNumber.replace(/\D/g, '');

  // Si el número incluye el código de país al inicio, se lo quitamos
  if (number.startsWith(code)) {
    number = number.slice(code.length);
  }

  let formattedNumber = number;

  switch (code) {
    case '54': // Argentina
      if (number.startsWith('9')) {
        const mobilePrefix = number.slice(0, 1);
        const areaCode = number.slice(1, 3);
        const rest = number.slice(3);

        if (rest.length === 8) {
          formattedNumber = `${mobilePrefix} ${areaCode} ${rest.slice(0, 4)} ${rest.slice(4)}`;
        } else {
          formattedNumber = `${mobilePrefix} ${areaCode} ${rest}`;
        }
      } else {
        formattedNumber = number.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
      }
      break;

    case '598': // Uruguay
      if (number.startsWith('0')) number = number.slice(1);
      formattedNumber = number.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
      break;

    case '56': // Chile
      if (number.startsWith('9') && number.length === 9) {
        formattedNumber = `${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`;
      } else {
        formattedNumber = number.replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2 $3');
      }
      break;

    case '51': // Perú
      formattedNumber = number.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
      break;

    case '595': // Paraguay
      if (number.startsWith('0')) number = number.slice(1);
      formattedNumber = number.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
      break;

    default: // Fallback
      formattedNumber = number.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
      break;
  }

  return `+${code} ${formattedNumber}`.trim();
};
