/**
 * UserService - Maneja las peticiones HTTP para usuarios
 * Responsabilidades:
 * - Realizar peticiones GET, POST, PUT, DELETE a la API
 * - Manejar headers y configuración de peticiones
 * - Procesar respuestas y errores de la API
 */

import { apiClient } from './apiClient.js';

class UserService {
  constructor() {
    this.baseUrl = '/api/admin/users';
    this.apiClient = apiClient;
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getAllUsers() {
    try {
      const response = await this.apiClient.get(this.baseUrl);
      
      // Verificar si la respuesta del backend fue exitosa
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data.users,
          message: response.data.message || 'Usuarios obtenidos correctamente'
        };
      } else {
        return {
          success: false,
          data: [],
          message: response.data?.message || 'Error al obtener usuarios'
        };
      }
    } catch (error) {
      return this.handleError(error, 'Error al obtener usuarios');
    }
  }

  /**
   * Obtiene un usuario por ID
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getUserById(userId) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/${userId}`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data.user,
          message: response.data.message || 'Usuario obtenido correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: response.data?.message || 'Error al obtener usuario'
        };
      }
    } catch (error) {
      return this.handleError(error, 'Error al obtener usuario');
    }
  }

  /**
   * Registra un nuevo usuario (endpoint público)
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Respuesta de la API
   */
  async register(userData) {
    try {
      const response = await this.apiClient.post('/api/auth/register', userData);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Usuario registrado correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: response.data?.message || 'Error al registrar usuario'
        };
      }
    } catch (error) {
      return this.handleError(error, 'Error al registrar usuario');
    }
  }

  /**
   * Crea un nuevo usuario (endpoint de admin)
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Respuesta de la API
   */
  async createUser(userData) {
    try {
      const response = await this.apiClient.post(this.baseUrl, userData);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Usuario creado correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: response.data?.message || 'Error al crear usuario'
        };
      }
    } catch (error) {
      return this.handleError(error, 'Error al crear usuario');
    }
  }

  /**
   * Actualiza un usuario existente
   * @param {string} userId - ID del usuario
   * @param {Object} userData - Datos actualizados
   * @returns {Promise<Object>} Respuesta de la API
   */
  async updateUser(userId, userData) {
    try {
      // Si es para actualizar el perfil del usuario actual, usar la ruta de auth
      if (userId === 'current' || userId === 'profile') {
        const response = await this.apiClient.put('/api/auth/profile', userData);
        
        if (response.data && response.data.success) {
          return {
            success: true,
            data: response.data.data,
            message: response.data.message || 'Perfil actualizado correctamente'
          };
        } else {
          return {
            success: false,
            data: null,
            message: response.data?.message || 'Error al actualizar perfil'
          };
        }
      } else {
        // Para actualizar otros usuarios (admin), usar la ruta de admin
        const response = await this.apiClient.put(`${this.baseUrl}/${userId}`, userData);
        
        if (response.data && response.data.success) {
          return {
            success: true,
            data: response.data.data,
            message: response.data.message || 'Usuario actualizado correctamente'
          };
        } else {
          return {
            success: false,
            data: null,
            message: response.data?.message || 'Error al actualizar usuario'
          };
        }
      }
    } catch (error) {
      return this.handleError(error, 'Error al actualizar usuario');
    }
  }

  /**
   * Elimina un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Respuesta de la API
   */
  async deleteUser(userId) {
    try {
      const response = await this.apiClient.delete(`${this.baseUrl}/${userId}`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: null,
          message: response.data.message || 'Usuario eliminado correctamente'
        };
      } else {
        return {
          success: false,
          data: null,
          message: response.data?.message || 'Error al eliminar usuario'
        };
      }
    } catch (error) {
      return this.handleError(error, 'Error al eliminar usuario');
    }
  }

  /**
   * Autentica un usuario
   * @param {Object} credentials - Credenciales de login
   * @returns {Promise<Object>} Respuesta de la API
   */
  async login(credentials) {
    try {
      const response = await this.apiClient.post('/api/auth/login', credentials);
      
      // Verificar si la respuesta del backend fue exitosa
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Login exitoso'
        };
      } else {
        return {
          success: false,
          data: null,
          message: response.data?.message || 'Error al iniciar sesión'
        };
      }
    } catch (error) {
      return this.handleError(error, 'Error al iniciar sesión');
    }
  }

  /**
   * Cierra la sesión del usuario
   * @returns {Promise<Object>} Respuesta de la API
   */
  async logout() {
    try {
      await this.apiClient.post('/api/auth/logout');
      return {
        success: true,
        data: null,
        message: 'Logout exitoso'
      };
    } catch (error) {
      return this.handleError(error, 'Error al cerrar sesión');
    }
  }

  /**
   * Obtiene el perfil del usuario actual
   * @returns {Promise<Object>} Respuesta de la API
   */
  async getCurrentUser() {
    try {
      const response = await this.apiClient.get('/api/auth/me');
      
      return {
        success: true,
        data: response.data,
        message: 'Perfil obtenido correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener perfil');
    }
  }

  /**
   * Actualiza el perfil del usuario actual
   * @param {Object} userData - Datos actualizados
   * @returns {Promise<Object>} Respuesta de la API
   */
  async updateProfile(userData) {
    try {
      const response = await this.apiClient.put('/api/auth/profile', userData);
      return {
        success: true,
        data: response.data,
        message: 'Perfil actualizado correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al actualizar perfil');
    }
  }

  /**
   * Cambia la contraseña del usuario
   * @param {Object} passwordData - Datos de la contraseña
   * @returns {Promise<Object>} Respuesta de la API
   */
  async changePassword(passwordData) {
    try {
      const response = await this.apiClient.put('/api/auth/password', passwordData);
      return {
        success: true,
        data: response.data,
        message: 'Contraseña cambiada correctamente'
      };
    } catch (error) {
      return this.handleError(error, 'Error al cambiar contraseña');
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
export const userService = new UserService();
export default userService;
