// src/core/query/register.ts
import '@tanstack/react-query';
import type { ApiError } from '@/core/error/api-error';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
  }
}
