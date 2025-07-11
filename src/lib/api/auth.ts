import { api } from './client'
import { User } from '@/lib/db/schema'

// Authentication API types
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  role?: 'admin' | 'employee'
}

export interface LoginResponse {
  message: string
  user: Omit<User, 'password_hash'>
  token: string
}

export interface LogoutResponse {
  message: string
}

export interface MeResponse {
  user: Omit<User, 'password_hash'>
}

// Authentication API service
export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', credentials)
  },

  // Signup user
  signup: async (userData: SignupRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/signup', userData)
  },

  // Logout user
  logout: async (): Promise<LogoutResponse> => {
    return api.post<LogoutResponse>('/auth/logout')
  },

  // Get current user
  me: async (): Promise<MeResponse> => {
    return api.get<MeResponse>('/auth/me')
  },
} 