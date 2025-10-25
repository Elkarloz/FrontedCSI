/**
 * AuthTest - Componente para probar el flujo de autenticación
 * Solo se muestra en modo desarrollo
 */

import React, { useState, useEffect } from 'react';
import { userController } from '../controllers/userController.js';
import { checkAuthStatus } from '../utils/authHelper.js';

const AuthTest = () => {
  const [authState, setAuthState] = useState({
    token: null,
    isValid: false,
    user: null,
    errors: []
  });
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    const authStatus = checkAuthStatus();
    
    setAuthState({
      token: authStatus.token ? 'Presente' : 'Ausente',
      isValid: authStatus.isAuthenticated,
      user: authStatus.user,
      errors: authStatus.error ? [authStatus.error] : []
    });
  };

  const testGetCurrentUser = async () => {
    try {
      console.log('🧪 Probando getCurrentUser...');
      const result = await userController.getCurrentUser();
      console.log('🧪 Resultado getCurrentUser:', result);
      
      setTestResults(prev => [...prev, {
        test: 'getCurrentUser',
        success: result.success,
        message: result.message,
        data: result.data,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('🧪 Error en getCurrentUser:', error);
      setTestResults(prev => [...prev, {
        test: 'getCurrentUser',
        success: false,
        message: error.message,
        data: null,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const testLogin = async () => {
    try {
      console.log('🧪 Probando login...');
      const result = await userController.login({
        email: 'carlosroa@pixelia.com.co',
        password: 'Carlos123#'
      });
      console.log('🧪 Resultado login:', result);
      
      setTestResults(prev => [...prev, {
        test: 'login',
        success: result.success,
        message: result.message,
        data: result.data,
        timestamp: new Date().toISOString()
      }]);
      
      if (result.success) {
        checkAuthState();
        
        // Verificar si es admin
        if (result.data?.user?.role === 'admin') {
          console.log('👑 Usuario admin detectado en test');
          setTestResults(prev => [...prev, {
            test: 'admin_detection',
            success: true,
            message: 'Usuario admin detectado correctamente',
            data: result.data.user,
            timestamp: new Date().toISOString()
          }]);
        }
      }
    } catch (error) {
      console.error('🧪 Error en login:', error);
      setTestResults(prev => [...prev, {
        test: 'login',
        success: false,
        message: error.message,
        data: null,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Solo mostrar en desarrollo
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-gray-900/95 border border-cyan-400/30 rounded-lg p-4 max-w-md text-xs font-mono z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-cyan-400 font-bold">🧪 Auth Test</h3>
        <button
          onClick={clearResults}
          className="text-red-400 hover:text-red-300 text-xs"
        >
          Limpiar
        </button>
      </div>
      
      <div className="space-y-2 text-gray-300">
        <div>Token: <span className={authState.token === 'Presente' ? 'text-green-400' : 'text-red-400'}>{authState.token}</span></div>
        <div>Válido: <span className={authState.isValid ? 'text-green-400' : 'text-red-400'}>{authState.isValid ? 'Sí' : 'No'}</span></div>
        
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
        
        <div className="flex space-x-2 mt-2">
          <button
            onClick={testLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
          >
            Test Login
          </button>
          <button
            onClick={testGetCurrentUser}
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
          >
            Test GetUser
          </button>
        </div>
        
        {testResults.length > 0 && (
          <div className="mt-2 max-h-32 overflow-y-auto">
            <div className="text-cyan-400 font-bold">Resultados:</div>
            {testResults.map((result, index) => (
              <div key={index} className="text-xs">
                <div className={result.success ? 'text-green-400' : 'text-red-400'}>
                  {result.test}: {result.success ? '✅' : '❌'} {result.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthTest;
