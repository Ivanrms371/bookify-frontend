import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
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

  if (urlSlug) {
    config.headers['x-tenant-slug'] = urlSlug;

    const session = useAuthStore.getState().session;

    if (session?.activeTenant?.slug === urlSlug) {
      config.headers['x-tenant-id'] = session.activeTenant.id;
    }
  }

  console.group(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);

  console.log('URL:', `${config.baseURL}${config.url}`);
  console.log('Method:', config.method?.toUpperCase());
  console.log('Headers:', config.headers);

  if (config.data) {
    console.log('Body:', config.data);
    console.log('Body JSON:', JSON.stringify(config.data, null, 2));
  }

  console.groupEnd();

  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log('ERROR AQUI -->', error);

    if (error.response?.status === 401 && !originalRequest._retry) {
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

    const responseData = error.response?.data;
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

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await axiosInstance.request<T>(config);
  return response.data;
};

export const httpClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, url, method: 'GET' }),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>({ ...config, url, method: 'POST', data }),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>({ ...config, url, method: 'PUT', data }),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>({ ...config, url, method: 'PATCH', data }),

  delete: <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, url, method: 'DELETE' }),
};
