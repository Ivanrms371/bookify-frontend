import { QueryCache, MutationCache, QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },

  queryCache: new QueryCache({
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        console.warn('[QueryCache] 403 Forbidden')
      }
    },
  }),

  mutationCache: new MutationCache({
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        console.warn('[MutationCache] 403 Forbidden')
      }
    },
  }),
})