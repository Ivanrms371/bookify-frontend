export type LocationCountry = {
  code: string;
  label: string;
  currency: string | null;
  currencies: string[];
  defaultTimeZone: string | null;
  timeZones: string[];
  regionLabel: string;
  regions: { value: string; label: string; timeZone: string }[];
};
export type LocationOptions = { countries: LocationCountry[]; currencies: string[]; timeZones: string[] };
export type LocationValues = {
  country: string;
  province: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  phoneNumber?: string;
  currency: string;
  timeZone: string;
};
