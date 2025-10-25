/**
 * Toast - Sistema de notificaciones toast con tema cyberpunk
 * Responsabilidades:
 * - Mostrar notificaciones de éxito, error, advertencia e información
 * - Auto-ocultar después de un tiempo configurable
 * - Aplicar estilos cyberpunk consistentes
 * - Manejar múltiples toasts simultáneos
 */

import React, { useState, useEffect, createContext, useContext } from 'react';

// Context para manejar toasts globalmente
const ToastContext = createContext();

// Hook para usar el contexto de toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de ToastProvider');
  }
  return context;
};

// Componente individual de toast
const ToastItem = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animar entrada
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-remover después del tiempo especificado
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Tiempo de animación de salida
  };

  const getToastStyles = () => {
    const baseStyles = "relative p-4 rounded-lg border-l-4 shadow-lg transform transition-all duration-300 font-mono min-w-[300px] max-w-[400px]";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-emerald-900/90 border-emerald-400 text-emerald-100 shadow-emerald-500/50`;
      case 'error':
        return `${baseStyles} bg-red-900/90 border-red-400 text-red-100 shadow-red-500/50`;
      case 'warning':
        return `${baseStyles} bg-yellow-900/90 border-yellow-400 text-yellow-100 shadow-yellow-500/50`;
      case 'info':
        return `${baseStyles} bg-blue-900/90 border-blue-400 text-blue-100 shadow-blue-500/50`;
      default:
        return `${baseStyles} bg-gray-900/90 border-gray-400 text-gray-100 shadow-gray-500/50`;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div
      className={`${getToastStyles()} ${
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{
        transform: isVisible && !isLeaving ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible && !isLeaving ? 1 : 0,
        zIndex: 99999,
        position: 'relative',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg flex-shrink-0">{getIcon()}</span>
        <div className="flex-1">
          {toast.title && (
            <h4 className="font-bold text-sm mb-1">{toast.title}</h4>
          )}
          <p className="text-sm">{toast.message}</p>
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Contenedor de toasts
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div 
      className="fixed top-4 right-4 space-y-2 max-w-sm"
      style={{ 
        zIndex: 99999,
        position: 'fixed',
        top: '16px',
        right: '16px',
        pointerEvents: 'auto'
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ zIndex: 99999, position: 'relative' }}>
          <ToastItem
            toast={toast}
            onRemove={onRemove}
          />
        </div>
      ))}
    </div>
  );
};

// Provider del contexto
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000, // 5 segundos por defecto
      ...toast,
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // Métodos de conveniencia
  const showSuccess = (message, title = 'Éxito', duration = 4000) => {
    return addToast({ type: 'success', message, title, duration });
  };

  const showError = (message, title = 'Error', duration = 6000) => {
    return addToast({ type: 'error', message, title, duration });
  };

  const showWarning = (message, title = 'Advertencia', duration = 5000) => {
    return addToast({ type: 'warning', message, title, duration });
  };

  const showInfo = (message, title = 'Información', duration = 4000) => {
    return addToast({ type: 'info', message, title, duration });
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
