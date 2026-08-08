export type Country = {
  name: string;
  code: string;
  flagUrl: string;
  dialCode: string;
};

const flagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

export const COUNTRIES: Country[] = [
  {
    code: 'UY',
    name: 'Uruguay',
    flagUrl: flagUrl('UY'),
    dialCode: '598',
  },
  {
    code: 'AR',
    name: 'Argentina',
    flagUrl: flagUrl('AR'),
    dialCode: '54',
  },
  {
    code: 'CL',
    name: 'Chile',
    flagUrl: flagUrl('CL'),
    dialCode: '56',
  },
  {
    code: 'PE',
    name: 'Perú',
    flagUrl: flagUrl('PE'),
    dialCode: '51',
  },
  {
    code: 'PY',
    name: 'Paraguay',
    flagUrl: flagUrl('PY'),
    dialCode: '595',
  },
];

COUNTRIES.sort((a, b) => a.name.localeCompare(b.name, 'es'));
