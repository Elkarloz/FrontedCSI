/**
 * ContentService - Maneja las peticiones HTTP para contenidos
 * Responsabilidades:
 * - Realizar peticiones GET, POST, PUT, DELETE a la API
 * - Manejar headers y configuración de peticiones
 * - Procesar respuestas y errores de la API
 */

import { apiClient } from './apiClient.js';

class ContentService {
  constructor() {
    this.baseUrl = '/api/contents';
    this.apiClient = apiClient;
  }

  /**
   * Obtiene todos los contenidos
   * @param {Object} params - Parámetros de consulta (page, limit, type, search)
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getAllContents(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.type) queryParams.append('type', params.type);
      if (params.search) queryParams.append('search', params.search);
      
      const url = queryParams.toString() ? `${this.baseUrl}?${queryParams}` : this.baseUrl;
      const response = await this.apiClient.get(url);
      
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Contenidos obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener contenidos');
    }
  }

  /**
   * Obtiene un contenido por ID
   * @param {string} contentId - ID del contenido
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getContentById(contentId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/${contentId}`);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Contenido obtenido correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener contenido');
    }
  }

  /**
   * Obtiene contenidos por tipo
   * @param {string} type - Tipo de contenido (pdf, video)
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getContentsByType(type) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/type/${type}`);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Contenidos por tipo obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener contenidos por tipo');
    }
  }

  /**
   * Crea un nuevo contenido
   * @param {Object} contentData - Datos del contenido
   * @returns {Promise<Object>} Respuesta de la API
   */
  async createContent(contentData) {
    try {
      const response = await this.apiClient.post(this.baseUrl, contentData);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Contenido creado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al crear contenido');
    }
  }

  /**
   * Actualiza un contenido existente
   * @param {string} contentId - ID del contenido
   * @param {Object} contentData - Datos actualizados
   * @returns {Promise<Object>} Respuesta de la API
   */
  async updateContent(contentId, contentData) {
    try {
      const response = await this.apiClient.put(`${this.baseUrl}/${contentId}`, contentData);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Contenido actualizado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al actualizar contenido');
    }
  }

  /**
   * Elimina un contenido
   * @param {string} contentId - ID del contenido
   * @returns {Promise<Object>} Respuesta de la API
   */
  async deleteContent(contentId) {
    try {
      await this.apiClient.delete(`${this.baseUrl}/${contentId}`);
      return {
        success: true,
        data: null,
        message: 'Contenido eliminado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al eliminar contenido');
    }
  }

  /**
   * Obtiene estadísticas de contenidos
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getContentStats() {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/stats`);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Estadísticas de contenidos obtenidas correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener estadísticas de contenidos');
    }
  }

  /**
   * Busca contenidos por término
   * @param {string} searchTerm - Término de búsqueda
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} Respuesta de la API
   */
  async searchContents(searchTerm, params = {}) {
    try {
      const searchParams = {
        ...params,
        search: searchTerm
      };
      return await this.getAllContents(searchParams);
    } catch (error) {
      return this.handleError(error, 'Error al buscar contenidos');
    }
  }

  /**
   * Obtiene contenidos paginados
   * @param {number} page - Página actual
   * @param {number} limit - Elementos por página
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getContentsPaginated(page = 1, limit = 10, filters = {}) {
    try {
      const params = {
        page,
        limit,
        ...filters
      };
      return await this.getAllContents(params);
    } catch (error) {
      return this.handleError(error, 'Error al obtener contenidos paginados');
    }
  }

  /**
   * Obtiene contenidos PDF
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getPdfContents() {
    try {
      return await this.getContentsByType('pdf');
    } catch (error) {
      return this.handleError(error, 'Error al obtener contenidos PDF');
    }
  }

  /**
   * Obtiene contenidos de video
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getVideoContents() {
    try {
      return await this.getContentsByType('video');
    } catch (error) {
      return this.handleError(error, 'Error al obtener contenidos de video');
    }
  }

  /**
   * Maneja errores de la API
   * @param {Error} error - Error capturado
   * @param {string} defaultMessage - Mensaje por defecto
   * @returns {Object} Respuesta de error
   */
  handleError(error, defaultMessage) {
    console.error('ContentService Error:', error);
    
    let message = defaultMessage;
    let statusCode = 500;
    
    if (error.response) {
      statusCode = error.response.status;
      message = error.response.data?.message || error.response.data?.error || defaultMessage;
    } else if (error.request) {
      message = 'Error de conexión con el servidor';
    } else {
      message = error.message || defaultMessage;
    }
    
    return {
      success: false,
      data: null,
      message,
      statusCode
    };
  }
}

// Exportar instancia singleton
export const contentService = new ContentService();
export default contentService;
