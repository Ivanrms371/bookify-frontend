import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/modules/auth/store/auth-store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 15000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Process queue of requests that failed because the token was expired
const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) return Promise.reject(error);

    // no interceptar refresh
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // solo manejar 401
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // si ya intentamos refresh, salir
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // if the request is already being retried, add it to the queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Call refresh endpoint
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      // Process queue of requests that failed because the token was expired
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      // Call process queue with error, clear auth and redirect to login
      processQueue(new Error("Session expired"));
      useAuthStore.getState().clearSession();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export { api as apiClient };
