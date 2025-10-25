/**
 * useAuth - Hook personalizado para manejo de autenticación
 */

import { useState, useEffect } from 'react';
import { checkAuthStatus, clearAuth } from '../utils/authHelper.js';

/**
 * Hook para manejar el estado de autenticación
 * @returns {Object} Estado y funciones de autenticación
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const authStatus = checkAuthStatus();
      setAuthState({
        isAuthenticated: authStatus.isAuthenticated,
        isLoading: false,
        user: authStatus.user,
        error: authStatus.error
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error.message
      });
    }
  };

  const logout = () => {
    clearAuth();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null
    });
  };

  const isAdmin = () => {
    return authState.isAuthenticated && authState.user?.role === 'admin';
  };

  return {
    ...authState,
    logout,
    isAdmin,
    checkAuth
  };
};
