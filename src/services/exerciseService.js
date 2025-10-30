/**
 * ExerciseService - Maneja las peticiones HTTP para ejercicios
 * Responsabilidades:
 * - Realizar peticiones GET, POST, PUT, DELETE a la API
 * - Manejar headers y configuración de peticiones
 * - Procesar respuestas y errores de la API
 */

import { apiClient } from './apiClient.js';

class ExerciseService {
  constructor() {
    this.baseUrl = '/api/exercises';
    this.apiClient = apiClient;
  }

  /**
   * Obtiene ejercicios por nivel
   * @param {string} levelId - ID del nivel
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getExercisesByLevel(levelId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/level/${levelId}`);
      return {
        success: true,
        data: response.data.data, // Acceder a response.data.data para obtener el array de ejercicios
        message: 'Ejercicios obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener ejercicios');
    }
  }

  /**
   * Obtiene un ejercicio por ID
   * @param {string} exerciseId - ID del ejercicio
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getExerciseById(exerciseId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/${exerciseId}`);
      return {
        success: true,
        data: response.data.data, // Acceder a response.data.data para obtener el ejercicio
        message: 'Ejercicio obtenido correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener ejercicio');
    }
  }

  /**
   * Crea un nuevo ejercicio
   * @param {Object} exerciseData - Datos del ejercicio
   * @returns {Promise<Object>} Respuesta de la API
   */
  async createExercise(exerciseData) {
    try {
      const response = await this.apiClient.post(this.baseUrl, exerciseData);
      return {
        success: true,
        data: response.data,
        message: 'Ejercicio creado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al crear ejercicio');
    }
  }

  /**
   * Actualiza un ejercicio existente
   * @param {string} exerciseId - ID del ejercicio
   * @param {Object} exerciseData - Datos actualizados
   * @returns {Promise<Object>} Respuesta de la API
   */
  async updateExercise(exerciseId, exerciseData) {
    try {
      const response = await this.apiClient.put(`${this.baseUrl}/${exerciseId}`, exerciseData);
      return {
        success: true,
        data: response.data,
        message: 'Ejercicio actualizado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al actualizar ejercicio');
    }
  }

  /**
   * Elimina un ejercicio
   * @param {string} exerciseId - ID del ejercicio
   * @returns {Promise<Object>} Respuesta de la API
   */
  async deleteExercise(exerciseId) {
    try {
      await this.apiClient.delete(`${this.baseUrl}/${exerciseId}`);
      return {
        success: true,
        data: null,
        message: 'Ejercicio eliminado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al eliminar ejercicio');
    }
  }

  /**
   * Envía una respuesta de ejercicio
   * @param {string} exerciseId - ID del ejercicio
   * @param {*} answer - Respuesta del usuario
   * @returns {Promise<Object>} Respuesta de la API
   */
  async submitAnswer(exerciseId, answer, { timeTaken = 0, hintsUsed = 0, userId } = {}) {
    try {
      const response = await this.apiClient.post(`${this.baseUrl}/${exerciseId}/submit`, {
        userAnswer: answer,
        timeTaken,
        hintsUsed,
        ...(userId ? { userId } : {})
      });
      return {
        success: true,
        data: response.data,
        message: 'Respuesta enviada correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al enviar respuesta');
    }
  }

  /**
   * Obtiene ejercicios por dificultad
   * @param {string} difficulty - Dificultad del ejercicio
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getExercisesByDifficulty(difficulty) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}?difficulty=${difficulty}`);
      return {
        success: true,
        data: response.data,
        message: 'Ejercicios por dificultad obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener ejercicios por dificultad');
    }
  }

  /**
   * Obtiene ejercicios por tipo
   * @param {string} type - Tipo del ejercicio
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getExercisesByType(type) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}?type=${type}`);
      return {
        success: true,
        data: response.data,
        message: 'Ejercicios por tipo obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener ejercicios por tipo');
    }
  }

  /**
   * Obtiene ejercicios aleatorios
   * @param {number} count - Cantidad de ejercicios
   * @param {string} difficulty - Dificultad opcional
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getRandomExercises(count = 10, difficulty = null) {
    try {
      const params = new URLSearchParams({ count: count.toString() });
      if (difficulty) params.append('difficulty', difficulty);
      
      const response = await this.apiClient.get(`${this.baseUrl}/random?${params}`);
      return {
        success: true,
        data: response.data,
        message: 'Ejercicios aleatorios obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener ejercicios aleatorios');
    }
  }

  /**
   * Obtiene el progreso de ejercicios del usuario
   * @param {string} userId - ID del usuario (opcional, usa el usuario actual)
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getExerciseProgress(userId = null) {
    try {
      const url = userId ? `${this.baseUrl}/progress/${userId}` : `${this.baseUrl}/progress`;
      const response = await this.apiClient.get(url);
      return {
        success: true,
        data: response.data,
        message: 'Progreso de ejercicios obtenido correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener progreso de ejercicios');
    }
  }

  /**
   * Obtiene estadísticas de ejercicios
   * @param {string} userId - ID del usuario (opcional, usa el usuario actual)
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getExerciseStats(userId = null) {
    try {
      const url = userId ? `${this.baseUrl}/stats/${userId}` : `${this.baseUrl}/stats`;
      const response = await this.apiClient.get(url);
      return {
        success: true,
        data: response.data,
        message: 'Estadísticas de ejercicios obtenidas correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener estadísticas de ejercicios');
    }
  }

  /**
   * Obtiene ejercicios completados por el usuario
   * @param {string} userId - ID del usuario (opcional, usa el usuario actual)
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getCompletedExercises(userId = null) {
    try {
      const url = userId ? `${this.baseUrl}/completed/${userId}` : `${this.baseUrl}/completed`;
      const response = await this.apiClient.get(url);
      return {
        success: true,
        data: response.data,
        message: 'Ejercicios completados obtenidos correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener ejercicios completados');
    }
  }

  /**
   * Marca un ejercicio como completado
   * @param {string} exerciseId - ID del ejercicio
   * @param {number} score - Puntuación obtenida
   * @param {number} timeSpent - Tiempo empleado en segundos
   * @returns {Promise<Object>} Respuesta de la API
   */
  async markAsCompleted(exerciseId, score, timeSpent) {
    try {
      const response = await this.apiClient.post(`${this.baseUrl}/${exerciseId}/complete`, {
        score,
        timeSpent
      });
      return {
        success: true,
        data: response.data,
        message: 'Ejercicio marcado como completado'
      };
    } catch (error) {
      return this.handleError(error, 'Error al marcar ejercicio como completado');
    }
  }

  /**
   * Obtiene pistas para un ejercicio
   * @param {string} exerciseId - ID del ejercicio
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getExerciseHints(exerciseId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/${exerciseId}/hints`);
      return {
        success: true,
        data: response.data,
        message: 'Pistas obtenidas correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener pistas');
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
export const exerciseService = new ExerciseService();
export default exerciseService;
