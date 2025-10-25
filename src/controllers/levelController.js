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
      console.log('📚 LevelController.getAllLevels() - Iniciando...', filters);
      
      const result = await this.levelService.getAllLevels(filters);
      
      if (result.success) {
        console.log('✅ LevelController.getAllLevels() - Niveles obtenidos:', result.data?.length || 0);
        return {
          success: true,
          data: result.data,
          message: 'Niveles obtenidos correctamente'
        };
      } else {
        console.error('❌ LevelController.getAllLevels() - Error del servicio:', result.message);
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      console.error('💥 LevelController.getAllLevels() - Error inesperado:', error);
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
      console.log('📚 LevelController.getLevelById() - Obteniendo nivel:', levelId);
      
      if (!levelId) {
        return {
          success: false,
          data: null,
          message: 'ID de nivel es requerido'
        };
      }
      
      const result = await this.levelService.getLevelById(levelId);
      
      if (result.success) {
        console.log('✅ LevelController.getLevelById() - Nivel obtenido');
        return {
          success: true,
          data: result.data,
          message: 'Nivel obtenido correctamente'
        };
      } else {
        console.error('❌ LevelController.getLevelById() - Error del servicio:', result.message);
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      console.error('💥 LevelController.getLevelById() - Error inesperado:', error);
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
      console.log('📚 LevelController.getLevelWithExercises() - Obteniendo nivel con ejercicios:', levelId);
      
      if (!levelId) {
        return {
          success: false,
          data: null,
          message: 'ID de nivel es requerido'
        };
      }
      
      const result = await this.levelService.getLevelWithExercises(levelId);
      
      if (result.success) {
        console.log('✅ LevelController.getLevelWithExercises() - Nivel con ejercicios obtenido');
        return {
          success: true,
          data: result.data,
          message: 'Nivel con ejercicios obtenido correctamente'
        };
      } else {
        console.error('❌ LevelController.getLevelWithExercises() - Error del servicio:', result.message);
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      console.error('💥 LevelController.getLevelWithExercises() - Error inesperado:', error);
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
      console.log('📚 LevelController.createLevel() - Creando nivel:', levelData);
      
      // Validaciones de negocio
      const validation = this.validateLevelData(levelData);
      if (!validation.isValid) {
        return {
          success: false,
          data: null,
          message: validation.message
        };
      }
      
      const result = await this.levelService.createLevel(levelData);
      
      if (result.success) {
        console.log('✅ LevelController.createLevel() - Nivel creado exitosamente');
        return {
          success: true,
          data: result.data,
          message: 'Nivel creado correctamente'
        };
      } else {
        console.error('❌ LevelController.createLevel() - Error del servicio:', result.message);
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      console.error('💥 LevelController.createLevel() - Error inesperado:', error);
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
      console.log('📚 LevelController.updateLevel() - Actualizando nivel:', levelId, levelData);
      
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
      
      const result = await this.levelService.updateLevel(levelId, levelData);
      
      if (result.success) {
        console.log('✅ LevelController.updateLevel() - Nivel actualizado exitosamente');
        return {
          success: true,
          data: result.data,
          message: 'Nivel actualizado correctamente'
        };
      } else {
        console.error('❌ LevelController.updateLevel() - Error del servicio:', result.message);
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      console.error('💥 LevelController.updateLevel() - Error inesperado:', error);
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
      console.log('📚 LevelController.deleteLevel() - Eliminando nivel:', levelId);
      
      if (!levelId) {
        return {
          success: false,
          data: null,
          message: 'ID de nivel es requerido'
        };
      }
      
      const result = await this.levelService.deleteLevel(levelId);
      
      if (result.success) {
        console.log('✅ LevelController.deleteLevel() - Nivel eliminado exitosamente');
        return {
          success: true,
          data: null,
          message: 'Nivel eliminado correctamente'
        };
      } else {
        console.error('❌ LevelController.deleteLevel() - Error del servicio:', result.message);
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      console.error('💥 LevelController.deleteLevel() - Error inesperado:', error);
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
      console.log('📚 LevelController.reorderLevels() - Reordenando niveles:', levelOrders);
      
      if (!Array.isArray(levelOrders) || levelOrders.length === 0) {
        return {
          success: false,
          data: null,
          message: 'Se requiere un array de órdenes de niveles'
        };
      }
      
      const result = await this.levelService.reorderLevels(levelOrders);
      
      if (result.success) {
        console.log('✅ LevelController.reorderLevels() - Niveles reordenados exitosamente');
        return {
          success: true,
          data: result.data,
          message: 'Niveles reordenados correctamente'
        };
      } else {
        console.error('❌ LevelController.reorderLevels() - Error del servicio:', result.message);
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      console.error('💥 LevelController.reorderLevels() - Error inesperado:', error);
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
      console.log('📚 LevelController.getLevelStats() - Obteniendo estadísticas:', levelId);
      
      if (!levelId) {
        return {
          success: false,
          data: null,
          message: 'ID de nivel es requerido'
        };
      }
      
      const result = await this.levelService.getLevelStats(levelId);
      
      if (result.success) {
        console.log('✅ LevelController.getLevelStats() - Estadísticas obtenidas');
        return {
          success: true,
          data: result.data,
          message: 'Estadísticas del nivel obtenidas correctamente'
        };
      } else {
        console.error('❌ LevelController.getLevelStats() - Error del servicio:', result.message);
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      console.error('💥 LevelController.getLevelStats() - Error inesperado:', error);
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
      console.log('📚 LevelController.getAllPlanets() - Obteniendo planetas...');
      
      const result = await this.planetService.getAllPlanets();
      
      if (result.success) {
        console.log('✅ LevelController.getAllPlanets() - Planetas obtenidos:', result.data?.length || 0);
        return {
          success: true,
          data: result.data,
          message: 'Planetas obtenidos correctamente'
        };
      } else {
        console.error('❌ LevelController.getAllPlanets() - Error del servicio:', result.message);
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      console.error('💥 LevelController.getAllPlanets() - Error inesperado:', error);
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
      if (!levelData.planetId) {
        return {
          isValid: false,
          message: 'Planeta es requerido'
        };
      }

      if (!levelData.levelNumber) {
        return {
          isValid: false,
          message: 'Número de nivel es requerido'
        };
      }

      if (!levelData.title || levelData.title.trim() === '') {
        return {
          isValid: false,
          message: 'Título del nivel es requerido'
        };
      }
    }

    // Validar número de nivel
    if (levelData.levelNumber !== undefined) {
      const levelNumber = parseInt(levelData.levelNumber);
      if (isNaN(levelNumber) || levelNumber < 1 || levelNumber > 5) {
        return {
          isValid: false,
          message: 'El número de nivel debe estar entre 1 y 5'
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
}

// Exportar instancia singleton
export const levelController = new LevelController();
export default levelController;
