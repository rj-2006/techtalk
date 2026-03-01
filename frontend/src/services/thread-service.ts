import { api } from '../lib/api-client'
import { useAuthStore } from '../stores/auth-store'
import type { Thread, Post, ThreadReaction, ChatMessage, CustomEmoji, PaginatedResponse, Chatroom } from '../types/api'

export const threadService = {
  async getThreads(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<PaginatedResponse<Thread>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.search) searchParams.set('search', params.search)
    
    const query = searchParams.toString()
    return api.get(`/api/threads${query ? `?${query}` : ''}`)
  },

  async getThread(id: number): Promise<Thread> {
    return api.get(`/api/threads/${id}`)
  },

  async createThread(data: {
    title: string
    content?: string
    images?: File[]
  }): Promise<Thread> {
    if (data.images && data.images.length > 0) {
      const formData = new FormData()
      formData.append('title', data.title)
      if (data.content) formData.append('content', data.content)
      data.images.forEach((img) => formData.append('images', img))
      
      const headers: Record<string, string> = {}
      const token = useAuthStore.getState().token
      if (token) headers['Authorization'] = `Bearer ${token}`
      
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5070'
      const response = await fetch(`${baseUrl}/api/threads`, {
        method: 'POST',
        headers,
        body: formData,
      })
      
      if (!response.ok) throw new Error('Failed to create thread')
      return response.json()
    }
    
    return api.post<Thread>('/api/threads', {
      title: data.title,
      content: data.content,
    })
  },

  async deleteThread(id: number): Promise<void> {
    return api.delete(`/api/threads/${id}`)
  },

  async createPost(threadId: number, content: string): Promise<Post> {
    return api.post<Post>(`/api/threads/${threadId}/posts`, { content })
  },

  async addReaction(threadId: number, emoji: string): Promise<ThreadReaction> {
    return api.post<ThreadReaction>(`/api/threads/${threadId}/reactions`, { emoji })
  },

  async removeReaction(threadId: number, emoji: string): Promise<void> {
    return api.delete(`/api/threads/${threadId}/reactions/${encodeURIComponent(emoji)}`)
  },

  async getReactions(threadId: number): Promise<ThreadReaction[]> {
    return api.get(`/api/threads/${threadId}/reactions`)
  },
}

export const chatService = {
  async getChatrooms(): Promise<Chatroom[]> {
    return api.get('/api/chatrooms')
  },

  async getChatHistory(chatroomId: number, params?: {
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<ChatMessage>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    
    const query = searchParams.toString()
    return api.get(`/api/chatrooms/${chatroomId}/history${query ? `?${query}` : ''}`)
  },

  async createChatroom(data: {
    name: string
    description?: string
  }): Promise<Chatroom> {
    return api.post('/api/chatrooms', data)
  },
}

export const emojiService = {
  async getCustomEmojis(): Promise<CustomEmoji[]> {
    return api.get('/api/emojis')
  },

  async createEmoji(data: {
    name: string
    url: string
  }): Promise<CustomEmoji> {
    return api.post('/api/emojis', data)
  },

  async deleteEmoji(id: number): Promise<void> {
    return api.delete(`/api/emojis/${id}`)
  },
}
