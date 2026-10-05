import axios from 'axios';
import type { HttpRequestConfig } from './request-config';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { ApiError } from '../error/api-error';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  let urlSlug: string | null = null;

  if (typeof window !== 'undefined') {
    const { pathname } = window.location;
    const pathParts = pathname.replace(/^\/|\/$/g, '').split('/');
    const firstSegment = pathParts[0];

    const globalRoutes = ['onboarding', 'auth', '404', 'maintenance'];
    const isGlobalRoute = globalRoutes.includes(firstSegment);

    if (firstSegment && !isGlobalRoute) {
      urlSlug = firstSegment;
    }
  }

  const session = useAuthStore.getState().session;
  const expectedTenantId = (config as typeof config & HttpRequestConfig).expectedTenantId;
  if (expectedTenantId && (session?.activeTenant?.id !== expectedTenantId || (urlSlug && session.activeTenant.slug !== urlSlug))) {
    throw new ApiError('El espacio seleccionado cambió. Volvé a abrir el formulario.');
  }

  if (urlSlug) {
    config.headers['x-tenant-slug'] = urlSlug;

    const session = useAuthStore.getState().session;

    if (session?.activeTenant?.slug === urlSlug) {
      config.headers['x-tenant-id'] = session.activeTenant.id;
    }
  } else if (session?.activeTenant?.id && !config.headers['x-tenant-id']) {
    config.headers['x-tenant-id'] = session.activeTenant.id;
  }

  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error instanceof ApiError) throw error;
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipAuthRetry) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post('/auth/refresh');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (axios.isAxiosError(refreshError)) {
          const status = refreshError.response?.status;

          if (!status) {
            throw new ApiError('No se pudo conectar con el servidor.', {
              code: 'NETWORK_ERROR',
            });
          }

          if (status >= 500) {
            throw new ApiError('El servidor no está disponible en este momento.', { status, code: 'SERVER_ERROR' });
          }

          useAuthStore.getState().clearAuth();
          throw new ApiError('Tu sesión ha expirado', { status: 401, code: 'SESSION_EXPIRED' });
        }
      }
    }

    if (!error.response) {
    }

    const responseData = error.response?.data ?? {};
    const { message, code, fields } = responseData;

    if (axios.isAxiosError(error)) {
      throw new ApiError(message ?? 'Ha ocurrido un error inesperado', {
        status: error.response?.status,
        fields,
        code,
      });
    }

    throw new ApiError('Ha ocurrido un error inesperado', { code: 'UNKNOWN_ERROR' });
  },
);

const request = async <T>(config: HttpRequestConfig): Promise<T> => {
  const response = await axiosInstance.request<T>(config);
  return response.data;
};

export const httpClient = {
  get: <T>(url: string, config?: HttpRequestConfig) => request<T>({ ...config, url, method: 'GET' }),

  post: <T>(url: string, data?: any, config?: HttpRequestConfig) => request<T>({ ...config, url, method: 'POST', data }),

  put: <T>(url: string, data?: any, config?: HttpRequestConfig) => request<T>({ ...config, url, method: 'PUT', data }),

  patch: <T>(url: string, data?: any, config?: HttpRequestConfig) => request<T>({ ...config, url, method: 'PATCH', data }),

  delete: <T>(url: string, config?: HttpRequestConfig) => request<T>({ ...config, url, method: 'DELETE' }),
};
