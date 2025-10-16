// API de administración
import { apiClient } from './client'
import { API_CONFIG, PaginationParams, PaginationResponse } from './config'

// Tipos para administración
export interface DashboardStats {
  totalUsers: number
  totalContents: number
  adminUsers: number
  studentUsers: number
}

export interface DashboardResponse {
  success: boolean
  data: {
    stats: DashboardStats
    recentContents: any[]
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: 'estudiante' | 'admin'
  createdAt: string
}

export interface UserListResponse {
  success: boolean
  data: {
    users: User[]
    pagination: PaginationResponse
  }
}

export interface AdminProfileData {
  name: string
  email: string
}

// Funciones de API
export const adminAPI = {
  // Dashboard
  async getDashboard(): Promise<DashboardResponse> {
    const response = await apiClient.get<DashboardResponse>(
      `${API_CONFIG.ENDPOINTS.ADMIN}/dashboard`
    )
    return response.data
  },

  // Perfil del admin
  async updateProfile(data: AdminProfileData): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put<{ success: boolean; message: string }>(
      `${API_CONFIG.ENDPOINTS.ADMIN}/profile`,
      data
    )
    return response.data
  },

  // Gestión de usuarios
  async getUsers(params?: PaginationParams): Promise<UserListResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)

    const queryString = searchParams.toString()
    const endpoint = `${API_CONFIG.ENDPOINTS.ADMIN}/users${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClient.get<UserListResponse>(endpoint)
    return response.data
  },

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `${API_CONFIG.ENDPOINTS.ADMIN}/users/${id}`
    )
    return response.data
  },

  // Gestión de contenidos (admin)
  async getContents(params?: PaginationParams & {
    type?: 'pdf' | 'video'
  }): Promise<{
    success: boolean
    data: {
      contents: any[]
      pagination: PaginationResponse
    }
  }> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.type) searchParams.append('type', params.type)
    if (params?.search) searchParams.append('search', params.search)

    const queryString = searchParams.toString()
    const endpoint = `${API_CONFIG.ENDPOINTS.ADMIN}/contents${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClient.get<{
      success: boolean
      data: {
        contents: any[]
        pagination: PaginationResponse
      }
    }>(endpoint)
    return response.data
  },

  async createContent(data: any): Promise<{ success: boolean; data: { content: any }; message: string }> {
    const response = await apiClient.post<{ success: boolean; data: { content: any }; message: string }>(
      `${API_CONFIG.ENDPOINTS.ADMIN}/contents`,
      data
    )
    return response.data
  },

  async updateContent(id: string, data: any): Promise<{ success: boolean; data: { content: any }; message: string }> {
    const response = await apiClient.put<{ success: boolean; data: { content: any }; message: string }>(
      `${API_CONFIG.ENDPOINTS.ADMIN}/contents/${id}`,
      data
    )
    return response.data
  },

  async deleteContent(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `${API_CONFIG.ENDPOINTS.ADMIN}/contents/${id}`
    )
    return response.data
  }
}
