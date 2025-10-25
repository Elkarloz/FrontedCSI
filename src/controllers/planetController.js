/**
 * PlanetController - Maneja la lógica de negocio del lado del cliente para planetas
 * Responsabilidades:
 * - Validar datos de planetas antes de enviar a la API
 * - Coordinar acciones entre vista y servicio
 * - Manejar estados de carga y errores
 * - Transformar datos para la vista
 */

import { planetService } from '../services/planetService.js';

class PlanetController {
  constructor() {
    this.planetService = planetService;
    this.currentPlanet = null;
    this.isLoading = false;
    this.error = null;
  }

  /**
   * Obtiene todos los planetas con validación y manejo de errores
   * @returns {Promise<Object>} Resultado con planetas o error
   */
  async getAllPlanets() {
    try {
      this.setLoading(true);
      this.clearError();
      
      const response = await this.planetService.getAllPlanets();
      
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener planetas');
      }
      
      // Verificar que response.data sea un array
      const planetsData = Array.isArray(response.data) ? response.data : [];
      
      // Transformar datos para la vista
      const transformedPlanets = planetsData.map(planet => ({
        id: planet.id,
        title: planet.title || planet.name, // Mantener el campo title para consistencia con el backend
        name: planet.title || planet.name, // También mantener name para compatibilidad
        description: planet.description,
        difficulty: 'medium', // El backend no tiene campo difficulty, usar default
        orderIndex: planet.orderIndex || 0, // Incluir el campo de orden
        isUnlocked: planet.isActive === 1,
        totalLevels: planet.totalLevels || planet.levelsCount || 0,
        completedLevels: 0, // No hay información de progreso en el backend actual
        progress: 0, // No hay información de progreso en el backend actual
        color: planet.color || '#00f0ff',
        position: {
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10
        }
      }));
      
      return {
        success: true,
        data: transformedPlanets,
        message: 'Planetas obtenidos correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: [],
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Obtiene un planeta específico con sus niveles
   * @param {string} planetId - ID del planeta
   * @returns {Promise<Object>} Resultado con planeta o error
   */
  async getPlanetById(planetId) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!planetId) {
        throw new Error('ID del planeta es requerido');
      }
      
      const response = await this.planetService.getPlanetById(planetId);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener planeta');
      }
      
      // Transformar datos para la vista
      const transformedPlanet = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        difficulty: response.data.difficulty,
        isUnlocked: response.data.isUnlocked,
        levels: response.data.levels?.map(level => ({
          id: level.id,
          name: level.name,
          description: level.description,
          order: level.order,
          isCompleted: level.isCompleted,
          isUnlocked: level.isUnlocked,
          exercises: level.exercises?.length || 0
        })) || [],
        color: this.getPlanetColor(response.data.difficulty)
      };
      
      this.currentPlanet = transformedPlanet;
      
      return {
        success: true,
        data: transformedPlanet,
        message: 'Planeta obtenido correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: null,
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Crea un nuevo planeta
   * @param {Object} planetData - Datos del planeta
   * @returns {Promise<Object>} Resultado de la creación
   */
  async createPlanet(planetData) {
    try {
      this.setLoading(true);
      this.clearError();
      
      const validation = this.validatePlanetData(planetData);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }
      
      const preparedData = this.preparePlanetData(planetData);
      const response = await this.planetService.createPlanet(preparedData);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al crear planeta');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Planeta creado correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: null,
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Actualiza un planeta existente
   * @param {string} planetId - ID del planeta
   * @param {Object} planetData - Datos actualizados
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async updatePlanet(planetId, planetData) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!planetId) {
        throw new Error('ID del planeta es requerido');
      }
      
      const validation = this.validatePlanetData(planetData, true);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }
      
      const preparedData = this.preparePlanetData(planetData);
      const response = await this.planetService.updatePlanet(planetId, preparedData);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar planeta');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Planeta actualizado correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: null,
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Elimina un planeta
   * @param {string} planetId - ID del planeta
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deletePlanet(planetId) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!planetId) {
        throw new Error('ID del planeta es requerido');
      }
      
      const response = await this.planetService.deletePlanet(planetId);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al eliminar planeta');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Planeta eliminado correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: null,
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Desbloquea un planeta
   * @param {string} planetId - ID del planeta
   * @returns {Promise<Object>} Resultado del desbloqueo
   */
  async unlockPlanet(planetId) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!planetId) {
        throw new Error('ID del planeta es requerido');
      }
      
      const response = await this.planetService.updatePlanet(planetId, { isUnlocked: true });
      
      if (!response.success) {
        throw new Error(response.message || 'Error al desbloquear planeta');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Planeta desbloqueado correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: null,
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Reordena los planetas
   * @param {Array} planetOrders - Array de objetos con {id, orderIndex}
   * @returns {Promise<Object>} Resultado del reordenamiento
   */
  async reorderPlanets(planetOrders) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!Array.isArray(planetOrders) || planetOrders.length === 0) {
        throw new Error('Se requiere un array de órdenes de planetas');
      }
      
      const response = await this.planetService.reorderPlanets(planetOrders);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al reordenar planetas');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Planetas reordenados correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: null,
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Valida los datos del planeta
   * @param {Object} planetData - Datos a validar
   * @param {boolean} isUpdate - Si es una actualización
   * @returns {Object} Resultado de la validación
   */
  validatePlanetData(planetData, isUpdate = false) {
    const errors = [];
    
    if (!isUpdate) {
      if (!planetData.name || planetData.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
      }
      
      // La descripción es opcional, no se valida
      
      if (!planetData.difficulty || !['easy', 'medium', 'hard'].includes(planetData.difficulty)) {
        errors.push('La dificultad debe ser: easy, medium o hard');
      }
    } else {
      if (planetData.name && planetData.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
      }
      
      // La descripción es opcional, no se valida
      
      if (planetData.difficulty && !['easy', 'medium', 'hard'].includes(planetData.difficulty)) {
        errors.push('La dificultad debe ser: easy, medium o hard');
      }
    }
    
    return {
      isValid: errors.length === 0,
      message: errors.join(', ')
    };
  }

  /**
   * Prepara los datos del planeta para enviar al servicio
   * @param {Object} planetData - Datos originales
   * @returns {Object} Datos preparados
   */
  preparePlanetData(planetData) {
    console.log('🪐 PlanetController.preparePlanetData() - Datos recibidos:', planetData);
    const preparedData = {
      title: planetData.name?.trim(),
      description: planetData.description?.trim(),
      orderIndex: planetData.orderIndex || 1,
      isActive: planetData.isUnlocked !== undefined ? planetData.isUnlocked : true
    };
    console.log('🪐 PlanetController.preparePlanetData() - Datos preparados:', preparedData);
    return preparedData;
  }

  /**
   * Calcula el progreso de un planeta basado en sus niveles
   * @param {Array} levels - Array de niveles
   * @returns {number} Porcentaje de progreso
   */
  calculateProgress(levels) {
    if (!levels || levels.length === 0) return 0;
    
    const completedLevels = levels.filter(level => level.isCompleted).length;
    return Math.round((completedLevels / levels.length) * 100);
  }

  /**
   * Obtiene el color del planeta basado en su dificultad
   * @param {string} difficulty - Dificultad del planeta
   * @returns {string} Color hexadecimal
   */
  getPlanetColor(difficulty) {
    const colors = {
      easy: '#00ff88',
      medium: '#ff8800',
      hard: '#ff0088'
    };
    return colors[difficulty] || '#00f0ff';
  }

  /**
   * Establece el estado de carga
   * @param {boolean} loading - Estado de carga
   */
  setLoading(loading) {
    this.isLoading = loading;
  }

  /**
   * Establece un error
   * @param {string} error - Mensaje de error
   */
  setError(error) {
    this.error = error;
  }

  /**
   * Limpia el error actual
   */
  clearError() {
    this.error = null;
  }

  /**
   * Obtiene el estado actual del controlador
   * @returns {Object} Estado actual
   */
  getState() {
    return {
      currentPlanet: this.currentPlanet,
      isLoading: this.isLoading,
      error: this.error
    };
  }
}

// Exportar instancia singleton
export const planetController = new PlanetController();
export default planetController;
