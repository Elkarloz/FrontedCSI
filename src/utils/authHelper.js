/**
 * AuthHelper - Utilidades para manejo de autenticación
 */

/**
 * Verifica si hay un token válido en localStorage
 * @returns {Object} Estado de autenticación
 */
export const checkAuthStatus = () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        isAuthenticated: false,
        token: null,
        user: null,
        error: 'No hay token de autenticación'
      };
    }

    // Decodificar el token
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = Date.now() > payload.exp * 1000;
    
    if (isExpired) {
      // Limpiar token expirado
      localStorage.removeItem('authToken');
      return {
        isAuthenticated: false,
        token: null,
        user: null,
        error: 'Token expirado'
      };
    }

    // Normalizar usuario para exponer tanto 'rol' (ES) como 'role' (EN)
    const normalizedUser = {
      ...payload,
      role: payload.role || payload.rol || null,
      rol: payload.rol || payload.role || null
    };

    return {
      isAuthenticated: true,
      token,
      user: normalizedUser,
      error: null
    };
  } catch (error) {
    // Limpiar token inválido
    localStorage.removeItem('authToken');
    return {
      isAuthenticated: false,
      token: null,
      user: null,
      error: 'Token inválido: ' + error.message
    };
  }
};

/**
 * Limpia la sesión del usuario
 */
export const clearAuth = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/auth';
};

/**
 * Guarda el token de autenticación
 * @param {string} token - Token JWT
 */
export const saveAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * Obtiene el token de autenticación
 * @returns {string|null} Token JWT
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Verifica si el usuario es administrador
 * @returns {boolean} True si es admin
 */
export const isAdmin = () => {
  const authStatus = checkAuthStatus();
  return authStatus.isAuthenticated && (authStatus.user?.role === 'admin' || authStatus.user?.rol === 'admin');
};

/**
 * Obtiene información del usuario actual
 * @returns {Object|null} Información del usuario
 */
export const getCurrentUser = () => {
  const authStatus = checkAuthStatus();
  return authStatus.isAuthenticated ? authStatus.user : null;
};

/**
 * Redirige según el estado de autenticación
 * @param {string} currentPath - Ruta actual
 */
export const handleAuthRedirect = (currentPath) => {
  const authStatus = checkAuthStatus();
  
  // Si no está autenticado y no está en auth, redirigir a auth
  if (!authStatus.isAuthenticated && currentPath !== '/auth') {
    window.location.href = '/auth';
    return;
  }
  
  // Si está autenticado y está en auth, redirigir según rol
  if (authStatus.isAuthenticated && currentPath === '/auth') {
    const userRole = authStatus.user?.rol || authStatus.user?.role;
    if (userRole === 'admin') {
      window.location.href = '/admin';
    } else if (userRole === 'estudiante') {
      window.location.href = '/student';
    } else {
      window.location.href = '/space-map';
    }
    return;
  }
  
  // Si está en admin pero no es admin, redirigir al mapa
  if (currentPath === '/admin' && !isAdmin()) {
    window.location.href = '/student';
    return;
  }
};
