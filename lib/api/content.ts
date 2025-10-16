// API de contenidos
import { apiClient } from './client'
import { API_CONFIG, PaginationParams, PaginationResponse } from './config'

// Tipos para contenidos
export interface Content {
  id: number
  title: string
  description: string
  resourceType: 'pdf' | 'video'
  resourceUrl: string
  createdBy: number
  creatorName?: string
  createdAt: string
  updatedAt: string
}

export interface CreateContentData {
  title: string
  description?: string
  resourceType: 'pdf' | 'video'
  resourceUrl: string
}

export interface UpdateContentData {
  title: string
  description?: string
  resourceType: 'pdf' | 'video'
  resourceUrl: string
}

export interface ContentListResponse {
  success: boolean
  data: {
    contents: Content[]
    pagination: PaginationResponse
  }
}

export interface ContentResponse {
  success: boolean
  data: {
    content: Content
  }
  message?: string
}

export interface ContentStatsResponse {
  success: boolean
  data: {
    total: number
    pdf: number
    video: number
    breakdown: {
      pdfPercentage: string
      videoPercentage: string
    }
  }
}

// Funciones de API
export const contentAPI = {
  // Obtener todos los contenidos (pública)
  async getAll(params?: PaginationParams & {
    type?: 'pdf' | 'video'
  }): Promise<ContentListResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.type) searchParams.append('type', params.type)
    if (params?.search) searchParams.append('search', params.search)

    const queryString = searchParams.toString()
    const endpoint = `${API_CONFIG.ENDPOINTS.CONTENTS}${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClient.get<ContentListResponse>(endpoint)
    return response.data
  },

  // Obtener contenido por ID (pública)
  async getById(id: number): Promise<ContentResponse> {
    const response = await apiClient.get<ContentResponse>(
      `${API_CONFIG.ENDPOINTS.CONTENTS}/${id}`
    )
    return response.data
  },

  // Obtener contenidos por tipo (pública)
  async getByType(type: 'pdf' | 'video'): Promise<{
    success: boolean
    data: {
      contents: Content[]
      type: string
      count: number
    }
  }> {
    const response = await apiClient.get<{
      success: boolean
      data: {
        contents: Content[]
        type: string
        count: number
      }
    }>(`${API_CONFIG.ENDPOINTS.CONTENTS}/type/${type}`)
    return response.data
  },

  // Obtener estadísticas de contenidos (requiere autenticación admin)
  async getStats(): Promise<ContentStatsResponse> {
    const response = await apiClient.get<ContentStatsResponse>(
      `${API_CONFIG.ENDPOINTS.CONTENTS}/stats`
    )
    return response.data
  },

  // Crear contenido (requiere autenticación admin)
  async create(contentData: CreateContentData): Promise<ContentResponse> {
    const response = await apiClient.post<ContentResponse>(
      API_CONFIG.ENDPOINTS.CONTENTS,
      contentData
    )
    return response.data
  },

  // Actualizar contenido (requiere autenticación admin)
  async update(id: number, contentData: UpdateContentData): Promise<ContentResponse> {
    const response = await apiClient.put<ContentResponse>(
      `${API_CONFIG.ENDPOINTS.CONTENTS}/${id}`,
      contentData
    )
    return response.data
  },

  // Eliminar contenido (requiere autenticación admin)
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `${API_CONFIG.ENDPOINTS.CONTENTS}/${id}`
    )
    return response.data
  },

  // Funciones de utilidad
  
  // Validar URL
  isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  // Validar tipo de recurso
  isValidResourceType(type: string): type is 'pdf' | 'video' {
    return ['pdf', 'video'].includes(type)
  },

  // Formatear fecha para mostrar
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Obtener icono según tipo de recurso
  getResourceIcon(resourceType: 'pdf' | 'video'): string {
    return resourceType === 'pdf' ? '📄' : '🎥'
  },

  // Obtener color según tipo de recurso
  getResourceColor(resourceType: 'pdf' | 'video'): string {
    return resourceType === 'pdf' ? 'text-red-600' : 'text-blue-600'
  },

  // Truncar descripción
  truncateDescription(description: string, maxLength: number = 100): string {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + '...'
  }
}
