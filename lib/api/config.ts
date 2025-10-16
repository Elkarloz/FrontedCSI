// Importar configuración desde archivo JSON
import configData from '../../config.json'

// Configuración centralizada de la API
export const API_CONFIG = {
  BASE_URL: configData.api.baseUrl,
  ENDPOINTS: {
    AUTH: configData.endpoints.auth,
    ADMIN: configData.endpoints.admin, 
    CONTENTS: configData.endpoints.contents,
    USERS: configData.endpoints.users
  },
  TIMEOUT: configData.api.timeout,
  RETRY_ATTEMPTS: configData.api.retryAttempts
}

// Tipos base para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}

export interface PaginationResponse {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}
