/**
 * LevelController - Controlador para la lógica de negocio de niveles
 * Responsabilidades:
 * - Coordinar operaciones CRUD de niveles
 * - Manejar validaciones de negocio
 * - Gestionar comunicación con el servicio
 * - Procesar respuestas y errores
 */

import { levelService } from '../services/levelService.js';
import { planetService } from '../services/planetService.js';

class LevelController {
  constructor() {
    this.levelService = levelService;
    this.planetService = planetService;
  }

  /**
   * Obtiene todos los niveles
   * @param {Object} filters - Filtros opcionales (planetId, includeInactive)
   * @returns {Promise<Object>} Resultado de la operación
   */
  async getAllLevels(filters = {}) {
    try {
      
      const result = await this.levelService.getAllLevels(filters);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Niveles obtenidos correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error inesperado al obtener niveles: ' + error.message
      };
    }
  }

  /**
   * Obtiene un nivel por ID
   * @param {string} levelId - ID del nivel
   * @returns {Promise<Object>} Resultado de la operación
   */
  async getLevelById(levelId) {
    try {
      
      if (!levelId) {
        return {
          success: false,
          data: null,
          message: 'ID de nivel es requerido'
        };
      }
      
      const result = await this.levelService.getLevelById(levelId);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Nivel obtenido correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error inesperado al obtener nivel: ' + error.message
      };
    }
  }

  /**
   * Obtiene un nivel con sus ejercicios
   * @param {string} levelId - ID del nivel
   * @returns {Promise<Object>} Resultado de la operación
   */
  async getLevelWithExercises(levelId) {
    try {
      
      if (!levelId) {
        return {
          success: false,
          data: null,
          message: 'ID de nivel es requerido'
        };
      }
      
      const result = await this.levelService.getLevelWithExercises(levelId);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Nivel con ejercicios obtenido correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error inesperado al obtener nivel con ejercicios: ' + error.message
      };
    }
  }

  /**
   * Crea un nuevo nivel
   * @param {Object} levelData - Datos del nivel
   * @returns {Promise<Object>} Resultado de la operación
   */
  async createLevel(levelData) {
    try {
      
      // Validaciones de negocio
      const validation = this.validateLevelData(levelData);
      if (!validation.isValid) {
        return {
          success: false,
          data: null,
          message: validation.message
        };
      }
      
      // Preparar datos para enviar al backend
      const preparedData = this.prepareLevelData(levelData);
      const result = await this.levelService.createLevel(preparedData);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Nivel creado correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error inesperado al crear nivel: ' + error.message
      };
    }
  }

  /**
   * Actualiza un nivel existente
   * @param {string} levelId - ID del nivel
   * @param {Object} levelData - Datos actualizados
   * @returns {Promise<Object>} Resultado de la operación
   */
  async updateLevel(levelId, levelData) {
    try {
      
      if (!levelId) {
        return {
          success: false,
          data: null,
          message: 'ID de nivel es requerido'
        };
      }
      
      // Validaciones de negocio
      const validation = this.validateLevelData(levelData, true);
      if (!validation.isValid) {
        return {
          success: false,
          data: null,
          message: validation.message
        };
      }
      
      // Preparar datos para enviar al backend
      const preparedData = this.prepareLevelData(levelData);
      const result = await this.levelService.updateLevel(levelId, preparedData);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Nivel actualizado correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error inesperado al actualizar nivel: ' + error.message
      };
    }
  }

  /**
   * Elimina un nivel
   * @param {string} levelId - ID del nivel
   * @returns {Promise<Object>} Resultado de la operación
   */
  async deleteLevel(levelId) {
    try {
      
      if (!levelId) {
        return {
          success: false,
          data: null,
          message: 'ID de nivel es requerido'
        };
      }
      
      const result = await this.levelService.deleteLevel(levelId);
      
      if (result.success) {
        return {
          success: true,
          data: null,
          message: 'Nivel eliminado correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error inesperado al eliminar nivel: ' + error.message
      };
    }
  }

  /**
   * Reordena los niveles
   * @param {Array} levelOrders - Array de objetos con {id, orderIndex}
   * @returns {Promise<Object>} Resultado de la operación
   */
  async reorderLevels(levelOrders) {
    try {
      
      if (!Array.isArray(levelOrders) || levelOrders.length === 0) {
        return {
          success: false,
          data: null,
          message: 'Se requiere un array de órdenes de niveles'
        };
      }
      
      const result = await this.levelService.reorderLevels(levelOrders);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Niveles reordenados correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error inesperado al reordenar niveles: ' + error.message
      };
    }
  }

  /**
   * Obtiene estadísticas de un nivel
   * @param {string} levelId - ID del nivel
   * @returns {Promise<Object>} Resultado de la operación
   */
  async getLevelStats(levelId) {
    try {
      
      if (!levelId) {
        return {
          success: false,
          data: null,
          message: 'ID de nivel es requerido'
        };
      }
      
      const result = await this.levelService.getLevelStats(levelId);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Estadísticas del nivel obtenidas correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error inesperado al obtener estadísticas: ' + error.message
      };
    }
  }

  /**
   * Obtiene todos los planetas (para formularios)
   * @returns {Promise<Object>} Resultado de la operación
   */
  async getAllPlanets() {
    try {
      
      const result = await this.planetService.getAllPlanets();
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Planetas obtenidos correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error inesperado al obtener planetas: ' + error.message
      };
    }
  }

  /**
   * Valida los datos de un nivel
   * @param {Object} levelData - Datos del nivel
   * @param {boolean} isUpdate - Si es una actualización
   * @returns {Object} Resultado de la validación
   */
  validateLevelData(levelData, isUpdate = false) {
    // Validaciones básicas
    if (!levelData) {
      return {
        isValid: false,
        message: 'Datos del nivel son requeridos'
      };
    }

    // Para creación, validar campos requeridos
    if (!isUpdate) {
      if (!levelData.planetId && !levelData.idPlaneta) {
        return {
          isValid: false,
          message: 'Planeta es requerido'
        };
      }

      if (!levelData.orderIndex && !levelData.orden) {
        return {
          isValid: false,
          message: 'Orden del nivel es requerido'
        };
      }

      if ((!levelData.title || levelData.title.trim() === '') && (!levelData.titulo || levelData.titulo.trim() === '')) {
        return {
          isValid: false,
          message: 'Título del nivel es requerido'
        };
      }
    }

    // Validar orden del nivel
    if (levelData.orderIndex !== undefined) {
      const orderIndex = parseInt(levelData.orderIndex);
      if (isNaN(orderIndex) || orderIndex < 1) {
        return {
          isValid: false,
          message: 'El orden del nivel debe ser un número mayor a 0'
        };
      }
    }

    // Validar título
    if (levelData.title !== undefined) {
      if (levelData.title.trim() === '') {
        return {
          isValid: false,
          message: 'El título no puede estar vacío'
        };
      }

      if (levelData.title.length > 100) {
        return {
          isValid: false,
          message: 'El título no puede exceder 100 caracteres'
        };
      }
    }

    // Validar orderIndex
    if (levelData.orderIndex !== undefined) {
      const orderIndex = parseInt(levelData.orderIndex);
      if (isNaN(orderIndex) || orderIndex < 0) {
        return {
          isValid: false,
          message: 'El orden debe ser un número mayor o igual a 0'
        };
      }
    }

    return {
      isValid: true,
      message: 'Datos válidos'
    };
  }

  /**
   * Prepara los datos del nivel para enviar al backend
   * @param {Object} levelData - Datos originales del frontend
   * @returns {Object} Datos preparados para el backend
   */
  prepareLevelData(levelData) {
    
    const preparedData = {
      idPlaneta: levelData.planetId || levelData.idPlaneta, // Enviar como 'idPlaneta' al backend
      titulo: levelData.title || levelData.titulo, // Enviar como 'titulo' al backend
      orden: levelData.orderIndex || levelData.orden || 1, // Enviar como 'orden' al backend
      activo: levelData.isActive !== undefined ? levelData.isActive : true // Enviar como 'activo' al backend
    };
    
    return preparedData;
  }
}

// Exportar instancia singleton
export const levelController = new LevelController();
export default levelController;
