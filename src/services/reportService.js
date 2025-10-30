/**
 * ReportService - Maneja las peticiones HTTP para reportes
 * Responsabilidades:
 * - Realizar peticiones GET para obtener reportes
 * - Manejar headers y configuración de peticiones
 * - Procesar respuestas y errores de la API
 */

import { apiClient } from './apiClient.js';

class ReportService {
  constructor() {
    this.baseUrl = '/api/reports';
    this.apiClient = apiClient;
  }

  /**
   * Obtiene el reporte general del sistema
   * @returns {Promise<Object>} Respuesta de la API con estadísticas generales
   */
  async getGeneralReport() {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/general`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Reporte general obtenido correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: response.data?.message || 'Error al obtener reporte general'
        };
      }
    } catch (error) {
      return this.handleError(error, 'Error al obtener reporte general');
    }
  }

  /**
   * Obtiene el reporte de todos los estudiantes
   * @returns {Promise<Object>} Respuesta de la API con reporte de estudiantes
   */
  async getStudentsReport() {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/students`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Reporte de estudiantes obtenido correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: response.data?.message || 'Error al obtener reporte de estudiantes'
        };
      }
    } catch (error) {
      return this.handleError(error, 'Error al obtener reporte de estudiantes');
    }
  }

  /**
   * Obtiene el reporte detallado de un estudiante específico
   * @param {string} userId - ID del estudiante
   * @returns {Promise<Object>} Respuesta de la API con reporte del estudiante
   */
  async getStudentReport(userId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/student/${userId}`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Reporte del estudiante obtenido correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: response.data?.message || 'Error al obtener reporte del estudiante'
        };
      }
    } catch (error) {
      return this.handleError(error, 'Error al obtener reporte del estudiante');
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
export const reportService = new ReportService();
export default reportService;

