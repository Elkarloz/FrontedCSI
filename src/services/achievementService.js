/**
 * AchievementService - Maneja las peticiones HTTP para logros
 * Responsabilidades:
 * - Obtener lista de logros disponibles
 * - Obtener logros del usuario
 * - Manejar errores de la API
 */

import { apiClient } from './apiClient.js';

class AchievementService {
  constructor() {
    this.baseUrl = '/api/achievements';
    this.apiClient = apiClient;
  }

  /**
   * Obtiene todos los logros disponibles
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getAllAchievements() {
    try {
      const response = await this.apiClient.get(this.baseUrl);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Logros obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener logros');
    }
  }

  /**
   * Obtiene los logros de un usuario
   * @param {number|string} userId - ID del usuario
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getUserAchievements(userId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/users/${userId}`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Logros del usuario obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener logros del usuario');
    }
  }

  /**
   * Maneja errores de la API
   * @param {Error} error - Error capturado
   * @param {string} defaultMessage - Mensaje por defecto
   * @returns {Object} Respuesta de error
   */
  handleError(error, defaultMessage) {
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
export const achievementService = new AchievementService();
export default achievementService;

