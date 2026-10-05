import type { AxiosRequestConfig } from 'axios';

export interface HttpRequestConfig extends AxiosRequestConfig {
  expectedTenantId?: string;
  skipAuthRetry?: boolean;
}
