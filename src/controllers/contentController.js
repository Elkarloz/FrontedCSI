/**
 * ContentController - Maneja la lógica de negocio del lado del cliente para contenidos
 * Responsabilidades:
 * - Validar datos de contenidos antes de enviar a la API
 * - Coordinar acciones entre vista y servicio
 * - Manejar estados de carga y errores
 * - Transformar datos para la vista
 */

import { contentService } from '../services/contentService.js';

class ContentController {
  constructor() {
    this.contentService = contentService;
    this.currentContent = null;
    this.isLoading = false;
    this.error = null;
  }

  /**
   * Obtiene todos los contenidos con validación y manejo de errores
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise<Object>} Resultado con contenidos o error
   */
  async getAllContents(params = {}) {
    try {
      this.setLoading(true);
      this.clearError();
      
      const response = await this.contentService.getAllContents(params);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener contenidos');
      }
      
      // Verificar que response.data tenga la estructura correcta
      const contentsData = response.data?.contents || response.data || [];
      const pagination = response.data?.pagination || null;
      
      // Transformar datos para la vista
      const transformedContents = Array.isArray(contentsData) ? contentsData.map(content => ({
        id: content.id,
        title: content.title,
        description: content.description,
        resourceType: content.resourceType,
        resourceUrl: content.resourceUrl,
        createdBy: content.createdBy,
        creatorName: content.creatorName,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
        // Campos adicionales para la vista
        typeIcon: this.getTypeIcon(content.resourceType),
        typeColor: this.getTypeColor(content.resourceType),
        formattedDate: this.formatDate(content.createdAt),
        isPdf: content.resourceType === 'pdf',
        isVideo: content.resourceType === 'video'
      })) : [];
      
      return {
        success: true,
        data: {
          contents: transformedContents,
          pagination
        },
        message: 'Contenidos obtenidos correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: { contents: [], pagination: null },
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Obtiene un contenido específico
   * @param {string} contentId - ID del contenido
   * @returns {Promise<Object>} Resultado con contenido o error
   */
  async getContentById(contentId) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!contentId) {
        throw new Error('ID del contenido es requerido');
      }
      
      const response = await this.contentService.getContentById(contentId);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener contenido');
      }
      
      // Transformar datos para la vista
      const transformedContent = {
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        resourceType: response.data.resourceType,
        resourceUrl: response.data.resourceUrl,
        createdBy: response.data.createdBy,
        creatorName: response.data.creatorName,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        // Campos adicionales para la vista
        typeIcon: this.getTypeIcon(response.data.resourceType),
        typeColor: this.getTypeColor(response.data.resourceType),
        formattedDate: this.formatDate(response.data.createdAt),
        isPdf: response.data.resourceType === 'pdf',
        isVideo: response.data.resourceType === 'video'
      };
      
      this.currentContent = transformedContent;
      
      return {
        success: true,
        data: transformedContent,
        message: 'Contenido obtenido correctamente'
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
   * Obtiene contenidos por tipo
   * @param {string} type - Tipo de contenido (pdf, video)
   * @returns {Promise<Object>} Resultado con contenidos o error
   */
  async getContentsByType(type) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!type || !['pdf', 'video'].includes(type)) {
        throw new Error('Tipo de contenido debe ser "pdf" o "video"');
      }
      
      const response = await this.contentService.getContentsByType(type);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener contenidos por tipo');
      }
      
      // Transformar datos para la vista
      const transformedContents = Array.isArray(response.data) ? response.data.map(content => ({
        id: content.id,
        title: content.title,
        description: content.description,
        resourceType: content.resourceType,
        resourceUrl: content.resourceUrl,
        createdBy: content.createdBy,
        creatorName: content.creatorName,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
        // Campos adicionales para la vista
        typeIcon: this.getTypeIcon(content.resourceType),
        typeColor: this.getTypeColor(content.resourceType),
        formattedDate: this.formatDate(content.createdAt),
        isPdf: content.resourceType === 'pdf',
        isVideo: content.resourceType === 'video'
      })) : [];
      
      return {
        success: true,
        data: transformedContents,
        message: 'Contenidos por tipo obtenidos correctamente'
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
   * Crea un nuevo contenido
   * @param {Object} contentData - Datos del contenido
   * @returns {Promise<Object>} Resultado de la creación
   */
  async createContent(contentData) {
    try {
      this.setLoading(true);
      this.clearError();
      
      const validation = this.validateContentData(contentData);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }
      
      const preparedData = this.prepareContentData(contentData);
      const response = await this.contentService.createContent(preparedData);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al crear contenido');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Contenido creado correctamente'
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
   * Actualiza un contenido existente
   * @param {string} contentId - ID del contenido
   * @param {Object} contentData - Datos actualizados
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async updateContent(contentId, contentData) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!contentId) {
        throw new Error('ID del contenido es requerido');
      }
      
      const validation = this.validateContentData(contentData, true);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }
      
      const preparedData = this.prepareContentData(contentData);
      const response = await this.contentService.updateContent(contentId, preparedData);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar contenido');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Contenido actualizado correctamente'
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
   * Elimina un contenido
   * @param {string} contentId - ID del contenido
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteContent(contentId) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!contentId) {
        throw new Error('ID del contenido es requerido');
      }
      
      const response = await this.contentService.deleteContent(contentId);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al eliminar contenido');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Contenido eliminado correctamente'
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
   * Busca contenidos por término
   * @param {string} searchTerm - Término de búsqueda
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} Resultado de la búsqueda
   */
  async searchContents(searchTerm, params = {}) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error('El término de búsqueda debe tener al menos 2 caracteres');
      }
      
      const response = await this.contentService.searchContents(searchTerm, params);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al buscar contenidos');
      }
      
      // Transformar datos para la vista
      const contentsData = response.data?.contents || response.data || [];
      const transformedContents = Array.isArray(contentsData) ? contentsData.map(content => ({
        id: content.id,
        title: content.title,
        description: content.description,
        resourceType: content.resourceType,
        resourceUrl: content.resourceUrl,
        createdBy: content.createdBy,
        creatorName: content.creatorName,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
        // Campos adicionales para la vista
        typeIcon: this.getTypeIcon(content.resourceType),
        typeColor: this.getTypeColor(content.resourceType),
        formattedDate: this.formatDate(content.createdAt),
        isPdf: content.resourceType === 'pdf',
        isVideo: content.resourceType === 'video'
      })) : [];
      
      return {
        success: true,
        data: transformedContents,
        message: 'Búsqueda completada correctamente'
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
   * Obtiene estadísticas de contenidos
   * @returns {Promise<Object>} Resultado con estadísticas
   */
  async getContentStats() {
    try {
      this.setLoading(true);
      this.clearError();
      
      const response = await this.contentService.getContentStats();
      
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener estadísticas');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Estadísticas obtenidas correctamente'
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
   * Valida los datos del contenido
   * @param {Object} contentData - Datos a validar
   * @param {boolean} isUpdate - Si es una actualización
   * @returns {Object} Resultado de la validación
   */
  validateContentData(contentData, isUpdate = false) {
    const errors = [];
    
    if (!isUpdate) {
      if (!contentData.title || contentData.title.trim().length < 2) {
        errors.push('El título debe tener al menos 2 caracteres');
      }
      
      if (!contentData.resourceType || !['pdf', 'video'].includes(contentData.resourceType)) {
        errors.push('El tipo de recurso debe ser "pdf" o "video"');
      }
      
      if (!contentData.resourceUrl || contentData.resourceUrl.trim().length < 5) {
        errors.push('La URL del recurso es requerida y debe ser válida');
      }
      
      // Validar URL
      try {
        new URL(contentData.resourceUrl);
      } catch (error) {
        errors.push('La URL del recurso no es válida');
      }
    } else {
      if (contentData.title && contentData.title.trim().length < 2) {
        errors.push('El título debe tener al menos 2 caracteres');
      }
      
      if (contentData.resourceType && !['pdf', 'video'].includes(contentData.resourceType)) {
        errors.push('El tipo de recurso debe ser "pdf" o "video"');
      }
      
      if (contentData.resourceUrl) {
        if (contentData.resourceUrl.trim().length < 5) {
          errors.push('La URL del recurso debe ser válida');
        } else {
          try {
            new URL(contentData.resourceUrl);
          } catch (error) {
            errors.push('La URL del recurso no es válida');
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      message: errors.join(', ')
    };
  }

  /**
   * Prepara los datos del contenido para enviar al servicio
   * @param {Object} contentData - Datos originales
   * @returns {Object} Datos preparados
   */
  prepareContentData(contentData) {
    console.log('📄 ContentController.prepareContentData() - Datos recibidos:', contentData);
    const preparedData = {
      title: contentData.title?.trim(),
      description: contentData.description?.trim() || '',
      resourceType: contentData.resourceType,
      resourceUrl: contentData.resourceUrl?.trim()
    };
    console.log('📄 ContentController.prepareContentData() - Datos preparados:', preparedData);
    return preparedData;
  }

  /**
   * Obtiene el icono del tipo de contenido
   * @param {string} resourceType - Tipo de recurso
   * @returns {string} Icono
   */
  getTypeIcon(resourceType) {
    const icons = {
      pdf: '📄',
      video: '🎥'
    };
    return icons[resourceType] || '📄';
  }

  /**
   * Obtiene el color del tipo de contenido
   * @param {string} resourceType - Tipo de recurso
   * @returns {string} Color hexadecimal
   */
  getTypeColor(resourceType) {
    const colors = {
      pdf: '#ff4444',
      video: '#4444ff'
    };
    return colors[resourceType] || '#666666';
  }

  /**
   * Formatea una fecha para mostrar
   * @param {string} dateString - Fecha en formato string
   * @returns {string} Fecha formateada
   */
  formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
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
      currentContent: this.currentContent,
      isLoading: this.isLoading,
      error: this.error
    };
  }
}

// Exportar instancia singleton
export const contentController = new ContentController();
export default contentController;
