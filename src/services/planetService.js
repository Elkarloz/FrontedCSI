/**
 * PlanetService - Maneja las peticiones HTTP para planetas
 * Responsabilidades:
 * - Realizar peticiones GET, POST, PUT, DELETE a la API
 * - Manejar headers y configuración de peticiones
 * - Procesar respuestas y errores de la API
 */

import { apiClient } from './apiClient.js';

class PlanetService {
  constructor() {
    this.baseUrl = '/api/planets';
    this.apiClient = apiClient;
  }

  /**
   * Obtiene todos los planetas
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getAllPlanets() {
    try {
      const response = await this.apiClient.get(this.baseUrl);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Planetas obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener planetas');
    }
  }

  /**
   * Obtiene un planeta por ID
   * @param {string} planetId - ID del planeta
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getPlanetById(planetId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/${planetId}`);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Planeta obtenido correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener planeta');
    }
  }

  /**
   * Obtiene los niveles de un planeta
   * @param {string} planetId - ID del planeta
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getPlanetLevels(planetId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/${planetId}/levels`);
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
   * Crea un nuevo planeta
   * @param {Object} planetData - Datos del planeta
   * @returns {Promise<Object>} Respuesta de la API
   */
  async createPlanet(planetData) {
    try {
      const response = await this.apiClient.post(this.baseUrl, planetData);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Planeta creado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al crear planeta');
    }
  }

  /**
   * Actualiza un planeta existente
   * @param {string} planetId - ID del planeta
   * @param {Object} planetData - Datos actualizados
   * @returns {Promise<Object>} Respuesta de la API
   */
  async updatePlanet(planetId, planetData) {
    try {
      const response = await this.apiClient.put(`${this.baseUrl}/${planetId}`, planetData);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Planeta actualizado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al actualizar planeta');
    }
  }

  /**
   * Elimina un planeta
   * @param {string} planetId - ID del planeta
   * @returns {Promise<Object>} Respuesta de la API
   */
  async deletePlanet(planetId) {
    try {
      await this.apiClient.delete(`${this.baseUrl}/${planetId}`);
      return {
        success: true,
        data: null,
        message: 'Planeta eliminado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al eliminar planeta');
    }
  }

  /**
   * Desbloquea un planeta
   * @param {string} planetId - ID del planeta
   * @returns {Promise<Object>} Respuesta de la API
   */
  async unlockPlanet(planetId) {
    try {
      const response = await this.apiClient.put(`${this.baseUrl}/${planetId}/unlock`);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Planeta desbloqueado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al desbloquear planeta');
    }
  }

  /**
   * Obtiene el progreso de un planeta
   * @param {string} planetId - ID del planeta
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getPlanetProgress(planetId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/${planetId}/progress`);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Progreso del planeta obtenido correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener progreso del planeta');
    }
  }

  /**
   * Actualiza el progreso de un planeta
   * @param {string} planetId - ID del planeta
   * @param {Object} progressData - Datos del progreso
   * @returns {Promise<Object>} Respuesta de la API
   */
  async updatePlanetProgress(planetId, progressData) {
    try {
      const response = await this.apiClient.put(`${this.baseUrl}/${planetId}/progress`, progressData);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Progreso del planeta actualizado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al actualizar progreso del planeta');
    }
  }

  /**
   * Obtiene planetas por dificultad
   * @param {string} difficulty - Dificultad del planeta
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getPlanetsByDifficulty(difficulty) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}?difficulty=${difficulty}`);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Planetas por dificultad obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener planetas por dificultad');
    }
  }

  /**
   * Obtiene planetas desbloqueados del usuario
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getUnlockedPlanets() {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/unlocked`);
      return {
        success: true,
        data: response.data.data, // El backend devuelve {success, data, message}, necesitamos response.data.data
        message: 'Planetas desbloqueados obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener planetas desbloqueados');
    }
  }

  /**
   * Reordena los planetas
   * @param {Array} planetOrders - Array de objetos con {id, orderIndex}
   * @returns {Promise<Object>} Respuesta de la API
   */
  async reorderPlanets(planetOrders) {
    try {
      const response = await this.apiClient.put(`${this.baseUrl}/reorder`, { planetOrders });
      return {
        success: true,
        data: response.data.data,
        message: 'Planetas reordenados correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al reordenar planetas');
    }
  }

  /**
   * Maneja errores de la API
   * @param {Error} error - Error capturado
   * @param {string} defaultMessage - Mensaje por defecto
   * @returns {Object} Respuesta de error
   */
  handleError(error, defaultMessage) {
    console.error('PlanetService Error:', error);
    
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
export const planetService = new PlanetService();
export default planetService;
