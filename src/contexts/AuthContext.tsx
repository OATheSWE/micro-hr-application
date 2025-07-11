'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { User } from '@/lib/db/schema'
import { authApi, LoginRequest } from '@/lib/api/auth'

// Define user roles
export type UserRole = 'admin' | 'employee'

// Define auth state interface
interface AuthState {
  user: Omit<User, 'password_hash'> | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Define auth actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: Omit<User, 'password_hash'> }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Auth reducer function
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}

// Auth context interface
interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  isAdmin: () => boolean
  isEmployee: () => boolean
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is admin
  const isAdmin = (): boolean => {
    return state.user?.role === 'admin'
  }

  // Check if user is employee
  const isEmployee = (): boolean => {
    return state.user?.role === 'employee'
  }

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' })

      const credentials: LoginRequest = { email, password }
      const data = await authApi.login(credentials)

      // Store token in localStorage
      localStorage.setItem('token', data.token)
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user })
    } catch (error: any) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.response?.data?.message || error.message || 'Login failed' 
      })
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Call logout API to invalidate token
      await authApi.logout()
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Remove token from localStorage
      localStorage.removeItem('token')
      dispatch({ type: 'LOGOUT' })
    }
  }

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false })
        return
      }

      try {
        const data = await authApi.me()
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user as User })
      } catch (error) {
        localStorage.removeItem('token')
        dispatch({ type: 'LOGOUT' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  const value: AuthContextType = {
    state,
    login,
    logout,
    clearError,
    isAdmin,
    isEmployee,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 