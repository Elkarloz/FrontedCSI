/**
 * LoadingSpinner - Componente de carga
 * Responsabilidades:
 * - Mostrar indicador de carga
 * - Proporcionar mensajes de estado
 * - Manejar diferentes tipos de carga
 */

import React from 'react';

const LoadingSpinner = ({ 
  message = 'Cargando...', 
  size = 'medium',
  type = 'spinner',
  className = ''
}) => {
  const getSizeClasses = () => {
    const sizes = {
      small: 'w-4 h-4',
      medium: 'w-8 h-8',
      large: 'w-12 h-12',
      xl: 'w-16 h-16'
    };
    return sizes[size] || sizes.medium;
  };

  const getSpinnerClasses = () => {
    const baseClasses = 'animate-spin rounded-full border-2 border-gray-600 border-t-white';
    const sizeClasses = getSizeClasses();
    return `${baseClasses} ${sizeClasses} ${className}`;
  };

  const getDotsClasses = () => {
    const baseClasses = 'flex space-x-1';
    return `${baseClasses} ${className}`;
  };

  const getPulseClasses = () => {
    const baseClasses = 'animate-pulse bg-white rounded-full';
    const sizeClasses = getSizeClasses();
    return `${baseClasses} ${sizeClasses} ${className}`;
  };

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={getDotsClasses()}>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      
      case 'pulse':
        return <div className={getPulseClasses()}></div>;
      
      case 'spinner':
      default:
        return <div className={getSpinnerClasses()}></div>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {renderSpinner()}
      {message && (
        <p className="text-white text-sm font-mono font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

/**
 * LoadingOverlay - Overlay de carga para pantallas completas
 */
export const LoadingOverlay = ({ 
  message = 'Cargando...', 
  size = 'large',
  type = 'spinner',
  className = ''
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
        <LoadingSpinner 
          message={message}
          size={size}
          type={type}
          className={className}
        />
      </div>
    </div>
  );
};

/**
 * LoadingButton - Botón con estado de carga
 */
export const LoadingButton = ({ 
  children,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative px-4 py-2 rounded-md font-medium transition-colors
        ${loading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
        }
        ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

/**
 * LoadingCard - Tarjeta con estado de carga
 */
export const LoadingCard = ({ 
  message = 'Cargando...',
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-center space-y-4">
        <LoadingSpinner message={message} size="medium" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
