/**
 * LevelService - Maneja las peticiones HTTP para niveles
 * Responsabilidades:
 * - Realizar peticiones GET, POST, PUT, DELETE a la API
 * - Manejar headers y configuración de peticiones
 * - Procesar respuestas y errores de la API
 */

import { apiClient } from './apiClient.js';

class LevelService {
  constructor() {
    this.baseUrl = '/api/levels';
    this.apiClient = apiClient;
  }

  /**
   * Obtiene todos los niveles
   * @param {Object} filters - Filtros opcionales (planetId, includeInactive)
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getAllLevels(filters = {}) {
    try {
      let url = this.baseUrl;
      const params = new URLSearchParams();
      
      if (filters.planetId) {
        params.append('planetId', filters.planetId);
      }
      
      if (filters.includeInactive) {
        params.append('includeInactive', filters.includeInactive);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await this.apiClient.get(url);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Niveles obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener niveles');
    }
  }

  /**
   * Obtiene un nivel por ID
   * @param {string} levelId - ID del nivel
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getLevelById(levelId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/${levelId}`);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Nivel obtenido correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener nivel');
    }
  }

  /**
   * Obtiene un nivel con sus ejercicios
   * @param {string} levelId - ID del nivel
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getLevelWithExercises(levelId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/${levelId}/exercises`);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Nivel con ejercicios obtenido correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener nivel con ejercicios');
    }
  }

  /**
   * Crea un nuevo nivel
   * @param {Object} levelData - Datos del nivel
   * @returns {Promise<Object>} Respuesta de la API
   */
  async createLevel(levelData) {
    try {
      const response = await this.apiClient.post(this.baseUrl, levelData);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Nivel creado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al crear nivel');
    }
  }

  /**
   * Actualiza un nivel existente
   * @param {string} levelId - ID del nivel
   * @param {Object} levelData - Datos actualizados
   * @returns {Promise<Object>} Respuesta de la API
   */
  async updateLevel(levelId, levelData) {
    try {
      const response = await this.apiClient.put(`${this.baseUrl}/${levelId}`, levelData);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Nivel actualizado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al actualizar nivel');
    }
  }

  /**
   * Elimina un nivel
   * @param {string} levelId - ID del nivel
   * @returns {Promise<Object>} Respuesta de la API
   */
  async deleteLevel(levelId) {
    try {
      await this.apiClient.delete(`${this.baseUrl}/${levelId}`);
      return {
        success: true,
        data: null,
        message: 'Nivel eliminado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al eliminar nivel');
    }
  }

  /**
   * Elimina un nivel permanentemente
   * @param {string} levelId - ID del nivel
   * @returns {Promise<Object>} Respuesta de la API
   */
  async deleteLevelPermanently(levelId) {
    try {
      await this.apiClient.delete(`${this.baseUrl}/${levelId}/permanent`);
      return {
        success: true,
        data: null,
        message: 'Nivel eliminado permanentemente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al eliminar nivel permanentemente');
    }
  }

  /**
   * Reordena los niveles
   * @param {Array} levelOrders - Array de objetos con {id, orderIndex}
   * @returns {Promise<Object>} Respuesta de la API
   */
  async reorderLevels(levelOrders) {
    try {
      const response = await this.apiClient.put(`${this.baseUrl}/reorder`, { levelOrders });
      return {
        success: true,
        data: response.data.data,
        message: 'Niveles reordenados correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al reordenar niveles');
    }
  }

  /**
   * Obtiene estadísticas de un nivel
   * @param {string} levelId - ID del nivel
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getLevelStats(levelId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/${levelId}/stats`);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Estadísticas del nivel obtenidas correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener estadísticas del nivel');
    }
  }

  /**
   * Obtiene el conteo de niveles
   * @param {Object} filters - Filtros opcionales (includeInactive)
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getLevelsCount(filters = {}) {
    try {
      let url = `${this.baseUrl}/count`;
      const params = new URLSearchParams();
      
      if (filters.includeInactive) {
        params.append('includeInactive', filters.includeInactive);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await this.apiClient.get(url);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Conteo de niveles obtenido correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener conteo de niveles');
    }
  }

  /**
   * Obtiene un nivel por planeta y número
   * @param {string} planetId - ID del planeta
   * @param {number} levelNumber - Número del nivel
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getLevelByPlanetAndNumber(planetId, levelNumber) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/planet/${planetId}/number/${levelNumber}`);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Nivel obtenido correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener nivel por planeta y número');
    }
  }

  /**
   * Obtiene niveles por planeta
   * @param {string} planetId - ID del planeta
   * @param {Object} filters - Filtros opcionales (includeInactive)
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getLevelsByPlanet(planetId, filters = {}) {
    try {
      let url = `${this.baseUrl}`;
      const params = new URLSearchParams();
      
      params.append('planetId', planetId);
      
      if (filters.includeInactive) {
        params.append('includeInactive', filters.includeInactive);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await this.apiClient.get(url);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Niveles del planeta obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener niveles del planeta');
    }
  }

  /**
   * Obtiene niveles activos
   * @param {Object} filters - Filtros opcionales (planetId)
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getActiveLevels(filters = {}) {
    try {
      let url = `${this.baseUrl}`;
      const params = new URLSearchParams();
      
      if (filters.planetId) {
        params.append('planetId', filters.planetId);
      }
      
      // Por defecto, solo obtener niveles activos
      params.append('includeInactive', 'false');
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await this.apiClient.get(url);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Niveles activos obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener niveles activos');
    }
  }

  /**
   * Maneja errores de la API
   * @param {Error} error - Error capturado
   * @param {string} defaultMessage - Mensaje por defecto
   * @returns {Object} Respuesta de error
   */
  handleError(error, defaultMessage) {
    console.error('LevelService Error:', error);
    
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
export const levelService = new LevelService();
export default levelService;
