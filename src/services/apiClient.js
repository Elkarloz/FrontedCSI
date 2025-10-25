
import axios from 'axios';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL:  'https://apicsi.codevalcanos.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });

    this.setupInterceptors();
  }

  /**
   * Configura interceptores para peticiones y respuestas
   */
  setupInterceptors() {
    // Interceptor de peticiones
    this.client.interceptors.request.use(
      (config) => {
        // Agregar token de autenticación si existe
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log de peticiones en desarrollo
        if (import.meta.env.DEV) {
          console.log('API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
            headers: config.headers
          });
        }

        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor de respuestas
    this.client.interceptors.response.use(
      (response) => {
        // Log de respuestas en desarrollo
        if (import.meta.env.DEV) {
          console.log('API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data
          });
        }

        return response;
      },
      (error) => {
        // Log de errores
        console.error('API Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data
        });

        // Manejar errores de autenticación solo si no es una petición de login
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
          this.handleUnauthorized();
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Obtiene el token de autenticación del localStorage
   * @returns {string|null} Token de autenticación
   */
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Establece el token de autenticación
   * @param {string} token - Token de autenticación
   */
  setAuthToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  /**
   * Elimina el token de autenticación
   */
  removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Maneja errores de autenticación
   */
  handleUnauthorized() {
    console.log('🔐 Token no válido, limpiando autenticación...');
    this.removeAuthToken();
    
    // Solo redirigir si no estamos en la página de auth y no estamos en el proceso de login
    if (typeof window !== 'undefined' && 
        !window.location.pathname.includes('/auth') && 
        !window.location.pathname.includes('/login')) {
      console.log('🔐 Redirigiendo a /auth');
      window.location.href = '/auth';
    }
  }

  /**
   * Realiza una petición GET
   * @param {string} url - URL de la petición
   * @param {Object} config - Configuración adicional
   * @returns {Promise} Respuesta de la petición
   */
  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  /**
   * Realiza una petición POST
   * @param {string} url - URL de la petición
   * @param {Object} data - Datos a enviar
   * @param {Object} config - Configuración adicional
   * @returns {Promise} Respuesta de la petición
   */
  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  /**
   * Realiza una petición PUT
   * @param {string} url - URL de la petición
   * @param {Object} data - Datos a enviar
   * @param {Object} config - Configuración adicional
   * @returns {Promise} Respuesta de la petición
   */
  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  /**
   * Realiza una petición PATCH
   * @param {string} url - URL de la petición
   * @param {Object} data - Datos a enviar
   * @param {Object} config - Configuración adicional
   * @returns {Promise} Respuesta de la petición
   */
  async patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }

  /**
   * Realiza una petición DELETE
   * @param {string} url - URL de la petición
   * @param {Object} config - Configuración adicional
   * @returns {Promise} Respuesta de la petición
   */
  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  /**
   * Realiza una petición con método personalizado
   * @param {string} method - Método HTTP
   * @param {string} url - URL de la petición
   * @param {Object} data - Datos a enviar
   * @param {Object} config - Configuración adicional
   * @returns {Promise} Respuesta de la petición
   */
  async request(method, url, data = {}, config = {}) {
    return this.client.request({
      method,
      url,
      data,
      ...config
    });
  }

  /**
   * Realiza múltiples peticiones en paralelo
   * @param {Array} requests - Array de peticiones
   * @returns {Promise} Respuestas de las peticiones
   */
  async all(requests) {
    return Promise.all(requests);
  }

  /**
   * Realiza múltiples peticiones y devuelve la primera que se resuelva
   * @param {Array} requests - Array de peticiones
   * @returns {Promise} Primera respuesta que se resuelva
   */
  async race(requests) {
    return Promise.race(requests);
  }

  /**
   * Obtiene la configuración actual del cliente
   * @returns {Object} Configuración del cliente
   */
  getConfig() {
    return {
      baseURL: this.client.defaults.baseURL,
      timeout: this.client.defaults.timeout,
      headers: this.client.defaults.headers
    };
  }

  /**
   * Actualiza la configuración del cliente
   * @param {Object} config - Nueva configuración
   */
  updateConfig(config) {
    Object.assign(this.client.defaults, config);
  }
}

// Exportar instancia singleton
export const apiClient = new ApiClient();
export default apiClient;
