export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface AuthTokens {
  accessToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Thread {
  id: number
  title: string
  user_id: number
  user: User
  posts: Post[]
  images: ThreadImage[]
  reactions: ThreadReaction[]
  created_at: string
  updated_at: string
}

export interface Post {
  id: number
  content: string
  thread_id: number
  user_id: number
  user: User
  created_at: string
  updated_at: string
}

export interface ThreadImage {
  id: number
  thread_id: number
  url: string
  caption?: string
}

export interface ThreadReaction {
  id: number
  thread_id: number
  user_id: number
  user: User
  emoji: string
  created_at: string
}

export interface Chatroom {
  id: number
  name: string
  description?: string
  created_by: number
  created_at: string
}

export interface ChatMessage {
  id: number
  chatroom_id: number
  user_id: number
  user: User
  content: string
  created_at: string
  reactions: MessageReaction[]
}

export interface MessageReaction {
  id: number
  message_id: number
  user_id: number
  user: User
  emoji: string
  created_at: string
}

export interface CustomEmoji {
  id: number
  name: string
  url: string
  created_by: number
  created_at: string
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
