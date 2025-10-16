// Exportaciones centralizadas de la API
export * from './config'
export * from './client'
export * from './auth'
export * from './content'
export * from './admin'

// Re-exportar las APIs principales para facilitar el uso
export { authAPI } from './auth'
export { contentAPI } from './content'
export { adminAPI } from './admin'
export { apiClient } from './client'
