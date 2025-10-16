// API de autenticación
import { apiClient } from './client'
import { API_CONFIG } from './config'

// Tipos para autenticación
export interface User {
  id: string
  name: string
  email: string
  role: 'estudiante' | 'admin'
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
    token: string
  }
  errors?: Array<{
    field: string
    message: string
  }>
}

// Utilidades para manejo de token
export const tokenUtils = {
  saveToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  },

  hasToken: (): boolean => {
    return !!tokenUtils.getToken()
  }
}

// Funciones de API
export const authAPI = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${API_CONFIG.ENDPOINTS.AUTH}/login`,
      credentials
    )
    return response.data
  },

  // Registro
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${API_CONFIG.ENDPOINTS.AUTH}/register`,
      userData
    )
    return response.data
  },

  // Verificar token
  async verifyToken(token: string): Promise<AuthResponse> {
    const response = await apiClient.get<AuthResponse>(
      `${API_CONFIG.ENDPOINTS.AUTH}/verify`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    )
    return response.data
  },

  // Obtener perfil                                  m
  async getProfile(token: string): Promise<AuthResponse> {
    const response = await apiClient.get<AuthResponse>(
      `${API_CONFIG.ENDPOINTS.AUTH}/profile`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    )
    return response.data
  },

  // Actualizar perfil
  async updateProfile(profileData: { name: string; email: string }): Promise<AuthResponse> {
    const response = await apiClient.put<AuthResponse>(
      `${API_CONFIG.ENDPOINTS.AUTH}/profile`,
      profileData
    )
    return response.data
  }
}
