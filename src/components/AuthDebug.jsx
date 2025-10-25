/**
 * AuthDebug - Componente para debuggear el estado de autenticación
 * Solo se muestra en modo desarrollo
 */

import React, { useState, useEffect } from 'react';
import { checkAuthStatus, clearAuth } from '../utils/authHelper.js';

const AuthDebug = () => {
  const [authState, setAuthState] = useState({
    token: null,
    isValid: false,
    isExpired: false,
    user: null,
    errors: []
  });

  useEffect(() => {
    checkAuthState();
    
    // Verificar cada 5 segundos
    const interval = setInterval(checkAuthState, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkAuthState = () => {
    const authStatus = checkAuthStatus();
    
    setAuthState({
      token: authStatus.token ? 'Presente' : 'Ausente',
      isValid: authStatus.isAuthenticated,
      isExpired: !authStatus.isAuthenticated && authStatus.error?.includes('expirado'),
      user: authStatus.user,
      errors: authStatus.error ? [authStatus.error] : []
    });
  };

  const handleClearAuth = () => {
    clearAuth();
  };

  // Solo mostrar en desarrollo
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/95 border border-cyan-400/30 rounded-lg p-4 max-w-sm text-xs font-mono z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-cyan-400 font-bold">🔐 Auth Debug</h3>
        <button
          onClick={handleClearAuth}
          className="text-red-400 hover:text-red-300 text-xs"
        >
          Limpiar
        </button>
      </div>
      
      <div className="space-y-1 text-gray-300">
        <div>Token: <span className={authState.token === 'Presente' ? 'text-green-400' : 'text-red-400'}>{authState.token}</span></div>
        <div>Válido: <span className={authState.isValid ? 'text-green-400' : 'text-red-400'}>{authState.isValid ? 'Sí' : 'No'}</span></div>
        <div>Expirado: <span className={authState.isExpired ? 'text-red-400' : 'text-green-400'}>{authState.isExpired ? 'Sí' : 'No'}</span></div>
        
        {authState.user && (
          <div>
            <div>Usuario: <span className="text-cyan-400">{authState.user.name || 'N/A'}</span></div>
            <div>Rol: <span className="text-purple-400">{authState.user.role || 'N/A'}</span></div>
          </div>
        )}
        
        {authState.errors.length > 0 && (
          <div className="text-red-400">
            <div>Errores:</div>
            {authState.errors.map((error, index) => (
              <div key={index} className="text-xs">• {error}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDebug;
