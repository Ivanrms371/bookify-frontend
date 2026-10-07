import { httpClient } from '@/core/http/httpClient';
import type { LocationOptions } from '../types/location.types';
export const locationApi = {
  getOptions: (signal?: AbortSignal) => httpClient.get<LocationOptions>('/locations/options', { signal }),
};
