import { COUNTRIES } from '@/shared/constants';

const DEFAULT_DIAL_CODE = COUNTRIES[0]?.dialCode ?? '598';

/**
 * Best-effort IP geolocation for suggesting a phone country code.
 * Falls back to the default (Uruguay) if the request fails, is blocked,
 * or the returned country isn't in our COUNTRIES list.
 */
export async function detectCountryDialCode(signal?: AbortSignal): Promise<string> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal });
    if (!res.ok) return DEFAULT_DIAL_CODE;
    const data = (await res.json()) as { country_code?: string };
    const iso2 = data.country_code?.toUpperCase();
    if (!iso2) return DEFAULT_DIAL_CODE;
    const match = COUNTRIES.find((c) => c.code === iso2);
    return match?.dialCode ?? DEFAULT_DIAL_CODE;
  } catch {
    return DEFAULT_DIAL_CODE;
  }
}
