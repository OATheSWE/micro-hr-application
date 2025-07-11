'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { User } from '@/lib/db/schema'
import { authApi, LoginRequest, SignupRequest } from '@/lib/api/auth'

// Define user roles
export type UserRole = 'admin' | 'employee'

// Define auth state interface
interface AuthState {
  user: Omit<User, 'password_hash'> | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  success: string | null
}

// Define auth actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: Omit<User, 'password_hash'> }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'SIGNUP_START' }
  | { type: 'SIGNUP_SUCCESS'; payload: string }
  | { type: 'SIGNUP_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_SUCCESS' }
  | { type: 'SET_LOADING'; payload: boolean }

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  success: null,
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
    case 'SIGNUP_START':
      return {
        ...state,
        isLoading: true,
        error: null,
        success: null,
      }
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
        success: action.payload,
      }
    case 'SIGNUP_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        success: null,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        success: null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    case 'CLEAR_SUCCESS':
      return {
        ...state,
        success: null,
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
  signup: (email: string, password: string, role?: 'admin' | 'employee') => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  clearSuccess: () => void
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
      console.log('Starting login process...', { email })
      dispatch({ type: 'LOGIN_START' })

      const credentials: LoginRequest = { email, password }
      console.log('Calling auth API...')
      const data = await authApi.login(credentials)
      console.log('Login successful:', data)

      // Store token in localStorage
      localStorage.setItem('token', data.token)
      console.log('Token stored in localStorage, verifying...')
      
      // Verify token was stored
      const storedToken = localStorage.getItem('token')
      console.log('Stored token verification:', !!storedToken, 'Length:', storedToken?.length)
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user })
      console.log('Login state updated successfully')
    } catch (error: any) {
      console.error('Login error:', error)
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.response?.data?.message || error.message || 'Login failed' 
      })
    }
  }

  // Signup function
  const signup = async (email: string, password: string, role: 'admin' | 'employee' = 'admin'): Promise<void> => {
    try {
      console.log('Starting signup process...', { email, role })
      dispatch({ type: 'SIGNUP_START' })

      const userData: SignupRequest = { email, password, role }
      console.log('Calling signup API...')
      const data = await authApi.signup(userData)
      console.log('Signup successful:', data)

      // Don't store token or authenticate - just show success message
      dispatch({ type: 'SIGNUP_SUCCESS', payload: 'Account created successfully! Please sign in.' })
      console.log('Signup state updated successfully')
    } catch (error: any) {
      console.error('Signup error:', error)
      dispatch({ 
        type: 'SIGNUP_FAILURE', 
        payload: error.response?.data?.message || error.message || 'Signup failed' 
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

  // Clear success function
  const clearSuccess = (): void => {
    dispatch({ type: 'CLEAR_SUCCESS' })
  }

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      console.log('Checking auth on mount, token exists:', !!token)
      
      if (!token) {
        console.log('No token found, setting loading to false')
        dispatch({ type: 'SET_LOADING', payload: false })
        return
      }

      try {
        console.log('Token found, calling /api/auth/me')
        const data = await authApi.me()
        console.log('Me API call successful:', data)
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user as User })
      } catch (error) {
        console.error('Me API call failed:', error)
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
    signup,
    logout,
    clearError,
    clearSuccess,
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