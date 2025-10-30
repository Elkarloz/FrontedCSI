/**
 * UserController - Maneja la lógica de negocio del lado del cliente para usuarios
 * Responsabilidades:
 * - Validar datos antes de enviar a la API
 * - Coordinar acciones entre vista y servicio
 * - Manejar estados de carga y errores
 * - Transformar datos para la vista
 */

import { userService } from '../services/userService.js';

class UserController {
  constructor() {
    this.userService = userService;
    this.currentUser = null;
    this.isLoading = false;
    this.error = null;
  }

  /**
   * Obtiene todos los usuarios con validación y manejo de errores
   * @returns {Promise<Object>} Resultado con usuarios o error
   */
  async getAllUsers() {
    try {
      this.setLoading(true);
      this.clearError();
      
      const response = await this.userService.getAllUsers();
      
      // Validar respuesta del servicio
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener usuarios');
      }
      
      // Transformar datos para la vista
      const transformedUsers = response.data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: new Date(user.created_at || user.createdAt).toLocaleDateString('es-ES')
      }));
      
      
      return {
        success: true,
        data: transformedUsers,
        message: 'Usuarios obtenidos correctamente'
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
   * Registra un nuevo usuario (endpoint público)
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Resultado del registro
   */
  async register(userData) {
    try {
      this.setLoading(true);
      this.clearError();
      
      // Validar datos antes de enviar
      const validation = this.validateUserData(userData);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }
      
      // Preparar datos para el servicio (sin role, se asigna automáticamente como 'estudiante')
      const preparedData = this.prepareUserData(userData, false);
      
      const response = await this.userService.register(preparedData);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al registrar usuario');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Usuario registrado correctamente'
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
   * Crea un nuevo usuario (endpoint de admin)
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Resultado de la creación
   */
  async createUser(userData) {
    try {
      this.setLoading(true);
      this.clearError();
      
      // Validar datos antes de enviar
      const validation = this.validateUserData(userData);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }
      
      // Preparar datos para el servicio
      const preparedData = this.prepareUserData(userData);
      
      const response = await this.userService.createUser(preparedData);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al crear usuario');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Usuario creado correctamente'
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
   * Actualiza un usuario existente
   * @param {string} userId - ID del usuario
   * @param {Object} userData - Datos actualizados
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async updateUser(userId, userData) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!userId) {
        throw new Error('ID de usuario es requerido');
      }
      
      const validation = this.validateUserData(userData, true);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }
      
      const preparedData = this.prepareUserData(userData);
      
      // Si es para actualizar el perfil del usuario actual, usar 'current'
      const serviceUserId = (userId === this.currentUser?.id) ? 'current' : userId;
      const response = await this.userService.updateUser(serviceUserId, preparedData);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar usuario');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Usuario actualizado correctamente'
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
   * Autentica un usuario (login)
   * @param {Object} credentials - Credenciales de login
   * @returns {Promise<Object>} Resultado del login
   */
  async login(credentials) {
    try {
      this.setLoading(true);
      this.clearError();
      
      // Validar credenciales
      if (!credentials.email || !credentials.password) {
        throw new Error('Email y contraseña son requeridos');
      }
      
      if (!this.isValidEmail(credentials.email)) {
        throw new Error('El email debe ser válido');
      }
      
      const response = await this.userService.login(credentials);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
      
      // Guardar token si existe
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        this.currentUser = response.data.user;
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Login exitoso'
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
   * Elimina un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteUser(userId) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!userId) {
        throw new Error('ID de usuario es requerido');
      }
      
      const response = await this.userService.deleteUser(userId);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al eliminar usuario');
      }
      
      return {
        success: true,
        data: null,
        message: 'Usuario eliminado correctamente'
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
   * Obtiene el usuario actual autenticado
   * @returns {Promise<Object>} Resultado con el usuario actual
   */
  async getCurrentUser() {
    try {
      this.setLoading(true);
      this.clearError();
      
      const response = await this.userService.getCurrentUser();
      
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener usuario actual');
      }
      
      // Actualizar usuario actual en el controlador
      this.currentUser = response.data;
      
      return {
        success: true,
        data: response.data,
        message: 'Usuario actual obtenido correctamente'
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
   * Cierra la sesión del usuario actual
   * @returns {Promise<Object>} Resultado del logout
   */
  async logout() {
    try {
      this.setLoading(true);
      this.clearError();
      
      // Limpiar token del localStorage
      localStorage.removeItem('authToken');
      this.currentUser = null;
      
      return {
        success: true,
        data: null,
        message: 'Sesión cerrada correctamente'
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
   * Valida los datos del usuario antes de enviar a la API
   * @param {Object} userData - Datos a validar
   * @param {boolean} isUpdate - Si es una actualización
   * @returns {Object} Resultado de la validación
   */
  validateUserData(userData, isUpdate = false) {
    const errors = [];
    
    if (!isUpdate) {
      if (!userData.name || userData.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
      }
      
      if (!userData.email || !this.isValidEmail(userData.email)) {
        errors.push('El email debe ser válido');
      }
      
      if (!userData.password || userData.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
      }
    } else {
      if (userData.name && userData.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
      }
      
      if (userData.email && !this.isValidEmail(userData.email)) {
        errors.push('El email debe ser válido');
      }
      
      if (userData.password && userData.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
      }
    }
    
    return {
      isValid: errors.length === 0,
      message: errors.join(', ')
    };
  }

  /**
   * Prepara los datos del usuario para enviar al servicio
   * @param {Object} userData - Datos originales
   * @param {boolean} includeRole - Si debe incluir el role (por defecto true)
   * @returns {Object} Datos preparados
   */
  prepareUserData(userData, includeRole = true) {
    const preparedData = {
      name: userData.name?.trim(),
      email: userData.email?.toLowerCase().trim(),
      password: userData.password,
      isActive: userData.isActive !== undefined ? userData.isActive : true
    };
    if (includeRole) {
      preparedData.role = userData.role || 'estudiante';
    }
    return preparedData;
  }

  /**
   * Valida formato de email
   * @param {string} email - Email a validar
   * @returns {boolean} Es válido
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
      currentUser: this.currentUser,
      isLoading: this.isLoading,
      error: this.error
    };
  }
}

// Exportar instancia singleton
export const userController = new UserController();
export default userController;
