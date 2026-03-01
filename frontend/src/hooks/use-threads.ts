import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { threadService } from '../services/thread-service'
import { queryKeys } from '../lib/query-provider'
import { useAuthStore } from '../stores/auth-store'
import type { Thread } from '../types/api'

export function useThreads(params?: {
  page?: number
  limit?: number
  search?: string
}) {
  return useQuery({
    queryKey: queryKeys.threads.list(params),
    queryFn: () => threadService.getThreads(params),
  })
}

export function useThread(id: number) {
  return useQuery({
    queryKey: queryKeys.threads.detail(id),
    queryFn: () => threadService.getThread(id),
    enabled: !!id,
  })
}

export function useCreateThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      title: string
      content?: string
      images?: File[]
    }) => threadService.createThread(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.lists() })
    },
  })
}

export function useDeleteThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => threadService.deleteThread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.lists() })
    },
  })
}

export function useCreatePost(threadId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) => threadService.createPost(threadId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.detail(threadId) })
    },
  })
}

export function useAddReaction(threadId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (emoji: string) => threadService.addReaction(threadId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.detail(threadId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.lists() })
    },
  })
}

export function useRemoveReaction(threadId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (emoji: string) => threadService.removeReaction(threadId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.detail(threadId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.lists() })
    },
  })
}
