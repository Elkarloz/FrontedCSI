// Cliente HTTP centralizado
import { API_CONFIG, ApiResponse } from './config'
import { tokenUtils } from './auth'

export interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
}

export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const token = tokenUtils.getToken()
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    console.log(`[API] ${options.method || 'GET'} ${url}`)
    console.log(`[API] Token presente:`, !!token)
    console.log(`[API] Token value:`, token ? `${token.substring(0, 20)}...` : 'null')

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || API_CONFIG.TIMEOUT)

      const response = await fetch(url, {
        ...defaultOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const error: any = new Error(
          (data?.message || data?.error) || 
          response.statusText || 
          'Request failed'
        )
        error.response = { status: response.status, data }
        throw error
      }

      return {
        success: response.ok,
        status: response.status,
        data,
      }
    } catch (error) {
      if ((error as any)?.response) {
        throw error
      }
      console.error('[API] Request Error:', error)
      throw new Error('Error de conexión con el servidor')
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Instancia global del cliente
export const apiClient = new ApiClient()
