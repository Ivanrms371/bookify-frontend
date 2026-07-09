// shared/utils/getApiError.ts
import axios from 'axios'

export function getApiError(error: unknown): string {

  if (axios.isAxiosError(error)) {

    const data = error.response?.data

    if (!error.response) {
    return 'No se pudo conectar al servidor. Verificá tu conexión.'
    }

    if (typeof data?.message === 'string' && data.message.length > 0) {
      return data.message
    }

    if (Array.isArray(data?.message) && data.message.length > 0) {
      return data.message[0]
    }
  }

  if (error instanceof Error) return error.message

  return 'Ocurrió un error inesperado'
}