import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api-client'
import { queryKeys } from '../lib/query-provider'
import type { CustomEmoji } from '../types/api'

export function useCustomEmojis() {
  return useQuery({
    queryKey: queryKeys.emojis.custom(),
    queryFn: () => api.get<CustomEmoji[]>('/api/emojis'),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateEmoji() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; url: string }) =>
      api.post<CustomEmoji>('/api/emojis', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.emojis.custom() })
    },
  })
}

export function useDeleteEmoji() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/emojis/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.emojis.custom() })
    },
  })
}
