/**
 * Modal - Componente modal profesional y moderno
 * Modal completamente refactorizado para centrado perfecto
 */

import React, { useEffect, useRef } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  showFooter = false
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)'
        }}
      />
      
      {/* Modal Container - Centrado perfecto */}
      <div
        ref={modalRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: size === 'small' ? '28rem' : size === 'medium' ? '42rem' : size === 'large' ? '56rem' : '80rem',
          maxHeight: '95vh',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(88, 28, 135, 0.98) 100%)',
          border: '1px solid rgba(244, 114, 182, 0.3)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(244, 114, 182, 0.3), 0 0 0 1px rgba(244, 114, 182, 0.1)',
          transform: isOpen ? 'scale(1)' : 'scale(0.95)',
          opacity: isOpen ? 1 : 0,
          transition: 'all 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {title && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem',
            borderBottom: '1px solid rgba(244, 114, 182, 0.2)',
            background: 'linear-gradient(90deg, rgba(17, 24, 39, 0.5) 0%, rgba(88, 28, 135, 0.5) 100%)',
            borderRadius: '1rem 1rem 0 0'
          }}>
            <h2
              id="modal-title"
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #f472b6 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                fontFamily: 'monospace'
              }}
            >
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{
                  color: '#9ca3af',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#f472b6';
                  e.target.style.backgroundColor = 'rgba(244, 114, 182, 0.1)';
                  e.target.style.borderColor = 'rgba(244, 114, 182, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#9ca3af';
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'rgba(244, 114, 182, 0.3)';
                }}
                aria-label="Cerrar modal"
              >
                <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          maxHeight: 'calc(95vh - 120px)',
          backgroundColor: 'rgba(17, 24, 39, 0.3)'
        }}>
          {children}
        </div>

        {/* Optional Footer */}
        {showFooter && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            padding: '1.5rem',
            borderTop: '1px solid rgba(244, 114, 182, 0.2)',
            background: 'linear-gradient(90deg, rgba(17, 24, 39, 0.3) 0%, rgba(88, 28, 135, 0.3) 100%)',
            borderRadius: '0 0 1rem 1rem'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                color: '#9ca3af',
                background: 'transparent',
                border: '1px solid rgba(244, 114, 182, 0.3)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500',
                fontFamily: 'monospace',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#f472b6';
                e.target.style.backgroundColor = 'rgba(244, 114, 182, 0.1)';
                e.target.style.borderColor = 'rgba(244, 114, 182, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#9ca3af';
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'rgba(244, 114, 182, 0.3)';
              }}
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(90deg, #f472b6 0%, #a855f7 100%)',
                color: 'white',
                border: '1px solid rgba(244, 114, 182, 0.5)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500',
                fontFamily: 'monospace',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 10px rgba(244, 114, 182, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 0 20px rgba(244, 114, 182, 0.5)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 0 10px rgba(244, 114, 182, 0.3)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Confirmar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
