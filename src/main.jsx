/**
 * main.jsx - Punto de entrada de la aplicación
 * Responsabilidades:
 * - Renderizar la aplicación en el DOM
 * - Configurar providers globales
 * - Manejar errores de renderizado
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Importar estilos globales
import './styles/globals.css';

/**
 * Configuración de la aplicación
 */
const appConfig = {
  // Configuración de desarrollo
  development: {
    enableStrictMode: true,
    enableDevTools: true,
    logLevel: 'debug'
  },
  
  // Configuración de producción
  production: {
    enableStrictMode: false,
    enableDevTools: false,
    logLevel: 'error'
  }
};

/**
 * Obtiene la configuración según el entorno
 */
const getConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return appConfig[env] || appConfig.development;
};

/**
 * Configuración de React
 */
const config = getConfig();

/**
 * Componente raíz con configuración
 */
const RootComponent = () => {
  if (config.enableStrictMode) {
    return (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
  
  return <App />;
};

/**
 * Maneja errores de renderizado
 */
const handleRenderError = (error) => {
  console.error('Error de renderizado:', error);
  
  // Mostrar error en pantalla
  const errorElement = document.createElement('div');
  errorElement.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="
        text-align: center;
        max-width: 500px;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      ">
        <h1 style="color: #dc3545; margin-bottom: 1rem;">
          Error de la Aplicación
        </h1>
        <p style="color: #6c757d; margin-bottom: 1.5rem;">
          Ha ocurrido un error inesperado. Por favor, recarga la página.
        </p>
        <button 
          onclick="window.location.reload()"
          style="
            background: #007bff;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          "
        >
          Recargar Página
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(errorElement);
};

/**
 * Inicializa la aplicación
 */
const initializeApp = () => {
  try {
    // Obtener el elemento raíz
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error('No se encontró el elemento con id "root"');
    }

    // Crear el root de React
    const root = ReactDOM.createRoot(rootElement);

    // Renderizar la aplicación
    root.render(<RootComponent />);

    // Configurar manejo de errores
    if (config.logLevel === 'debug') {
      console.log('Aplicación inicializada correctamente');
      console.log('Configuración:', config);
    }

  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    handleRenderError(error);
  }
};

/**
 * Configurar eventos globales
 */
const setupGlobalEvents = () => {
  // Manejar errores no capturados
  window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
  });

  // Manejar promesas rechazadas
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada:', event.reason);
  });

  // Manejar errores de recursos
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      console.error('Error de recurso:', event.target.src || event.target.href);
    }
  }, true);
};

/**
 * Configurar el entorno de desarrollo
 */
const setupDevelopment = () => {
  if (config.enableDevTools && import.meta.env.MODE === 'development') {
    // Agregar herramientas de desarrollo
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
    
    // Configurar logging
    if (config.logLevel === 'debug') {
      console.log('Modo de desarrollo activado');
      console.log('Variables de entorno:', import.meta.env);
    }
  }
};

/**
 * Punto de entrada principal
 */
const main = () => {
  // Configurar eventos globales
  setupGlobalEvents();
  
  // Configurar desarrollo si es necesario
  setupDevelopment();
  
  // Inicializar la aplicación
  initializeApp();
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

// Exportar para uso en tests
export { initializeApp, handleRenderError };
