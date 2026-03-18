import { isAxiosError } from "axios";

type ApiErrorResult = {
  data: null;
  error: string;
};

export const handleApiError = (error: unknown): ApiErrorResult => {
  if (import.meta.env.DEV) {
    console.log("dev", error);
  }

  if (isAxiosError(error)) {
    const data = error.response?.data as any;

    return {
      data: null,
      error: data?.message || data?.error || "Ocurrió un error inesperado",
    };
  }

  return {
    data: null,
    error: "Ocurrió un error inesperado",
  };
};
