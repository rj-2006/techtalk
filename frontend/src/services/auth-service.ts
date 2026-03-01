import { api } from '../lib/api-client'
import { useAuthStore } from '../stores/auth-store'
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/api'

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/login', credentials, false)
    
    useAuthStore.getState().login(response.user, response.token)
    
    return response
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/register', data, false)
    
    useAuthStore.getState().login(response.user, response.token)
    
    return response
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/auth/me')
    useAuthStore.getState().setUser(response)
    return response
  },

  logout() {
    useAuthStore.getState().logout()
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch<User>('/api/auth/profile', data)
    useAuthStore.getState().setUser(response)
    return response
  },

  async uploadAvatar(file: File): Promise<{ avatar: string }> {
    const response = await api.upload<{ avatar: string }>('/api/upload/avatar', file, 'avatar')
    return response
  },
}
