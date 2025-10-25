/**
 * ErrorBoundary - Componente para manejar errores de React
 * Responsabilidades:
 * - Capturar errores de renderizado
 * - Mostrar interfaz de error amigable
 * - Proporcionar opciones de recuperación
 * - Logging de errores
 */

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  /**
   * Método estático para actualizar el estado cuando hay un error
   * @param {Error} error - Error capturado
   * @returns {Object} Nuevo estado
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Método de ciclo de vida para capturar errores
   * @param {Error} error - Error capturado
   * @param {Object} errorInfo - Información adicional del error
   */
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log del error para debugging
    this.logError(error, errorInfo);
  }

  /**
   * Registra el error en la consola y opcionalmente en un servicio externo
   * @param {Error} error - Error capturado
   * @param {Object} errorInfo - Información adicional del error
   */
  logError = (error, errorInfo) => {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Detalles del error:', errorDetails);

    // Aquí podrías enviar el error a un servicio de logging
    // this.sendErrorToLoggingService(errorDetails);
  };

  /**
   * Maneja el reintento de renderizado
   */
  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  /**
   * Maneja el reinicio completo de la aplicación
   */
  handleReset = () => {
    window.location.reload();
  };

  /**
   * Maneja el reporte del error
   */
  handleReportError = () => {
    const { error, errorInfo } = this.state;
    
    // Crear un enlace de email con los detalles del error
    const subject = encodeURIComponent('Error en la aplicación');
    const body = encodeURIComponent(`
Error: ${error?.message || 'Error desconocido'}

Stack trace:
${error?.stack || 'No disponible'}

Component stack:
${errorInfo?.componentStack || 'No disponible'}

URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}
    `);
    
    const mailtoLink = `mailto:support@example.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
          onReset={this.handleReset}
          onReportError={this.handleReportError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * ErrorFallback - Componente que se muestra cuando hay un error
 */
const ErrorFallback = ({ 
  error, 
  errorInfo, 
  retryCount, 
  onRetry, 
  onReset, 
  onReportError 
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          {/* Icono de error */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Título del error */}
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            ¡Oops! Algo salió mal
          </h1>
          
          {/* Descripción del error */}
          <p className="text-gray-600 mb-6">
            La aplicación ha encontrado un error inesperado. 
            Por favor, intenta recargar la página o contacta al soporte si el problema persiste.
          </p>

          {/* Detalles del error (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Ver detalles técnicos
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32">
                <div><strong>Error:</strong> {error.message}</div>
                {error.stack && (
                  <div className="mt-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap">{error.stack}</pre>
                  </div>
                )}
                {errorInfo?.componentStack && (
                  <div className="mt-2">
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Intentar de nuevo
            </button>
            
            <button
              onClick={onReset}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Recargar página
            </button>
            
            <button
              onClick={onReportError}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Reportar error
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-6 text-xs text-gray-500">
            <p>Si el problema persiste, contacta al soporte técnico.</p>
            {retryCount > 0 && (
              <p>Intentos de recuperación: {retryCount}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
