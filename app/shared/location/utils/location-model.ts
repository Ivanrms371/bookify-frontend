import type { LocationCountry } from '../types/location.types';
export function countryChangeValues(country?: LocationCountry) {
  return {
    country: country?.code ?? '',
    province: '',
    city: '',
    currency: country?.currency ?? '',
    timeZone: country?.defaultTimeZone ?? '',
  };
}
export function regionChangeValues(country: LocationCountry | undefined, province: string) {
  const region = country?.regions.find((option) => option.value === province);
  return { province, city: '', ...(country?.regions.length ? { timeZone: region?.timeZone || country.defaultTimeZone || '' } : {}) };
}
