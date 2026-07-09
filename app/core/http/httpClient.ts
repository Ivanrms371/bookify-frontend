import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/core/auth/useAuthStore';
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
  const tenantId = useAuthStore.getState().tenant?.id;

  if (tenantId) {
    config.headers['X-Tenant-Id'] = tenantId;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post('/auth/refresh');
        return axiosInstance(originalRequest);
      } catch (error) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/auth/login';
      }
    }

    if (error.response?.status === 400) {
      const { message, fields } = error.response.data;

      throw new ApiError('Revisa los campos ingresados en el formulario.', 400, 'VALIDATION_ERROR', fields);
    }

    if (axios.isAxiosError(error)) {
      return Promise.reject(
        new ApiError(error.response?.data?.message ?? 'Unexpected error', error.response?.status, error.response?.data?.code),
      );
    }

    return Promise.reject(error);
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
