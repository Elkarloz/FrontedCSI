/**
 * ConfirmDialog - Diálogo de confirmación personalizado con tema cyberpunk
 * Responsabilidades:
 * - Mostrar diálogo de confirmación personalizado
 * - Aplicar estilos cyberpunk consistentes
 * - Manejar confirmación y cancelación
 */

import React from 'react';
import Modal from './Modal.jsx';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar Acción', 
  message = '¿Estás seguro de que quieres realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning' // success, error, warning, info
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '⚠️';
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case 'success':
        return {
          confirm: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-400 border-emerald-500/50',
          cancel: 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/30 hover:to-gray-700/30 text-gray-300 border-gray-500/50'
        };
      case 'error':
        return {
          confirm: 'bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 text-red-400 border-red-500/50',
          cancel: 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/30 hover:to-gray-700/30 text-gray-300 border-gray-500/50'
        };
      case 'warning':
        return {
          confirm: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 hover:from-yellow-500/30 hover:to-amber-500/30 text-yellow-400 border-yellow-500/50',
          cancel: 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/30 hover:to-gray-700/30 text-gray-300 border-gray-500/50'
        };
      case 'info':
        return {
          confirm: 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-blue-400 border-blue-500/50',
          cancel: 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/30 hover:to-gray-700/30 text-gray-300 border-gray-500/50'
        };
      default:
        return {
          confirm: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 hover:from-yellow-500/30 hover:to-amber-500/30 text-yellow-400 border-yellow-500/50',
          cancel: 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/30 hover:to-gray-700/30 text-gray-300 border-gray-500/50'
        };
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const buttonStyles = getButtonStyles();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-6">
        {/* Icono y mensaje */}
        <div className="text-center">
          <div className="text-6xl mb-4">{getIcon()}</div>
          <p className="text-gray-300 font-mono text-lg leading-relaxed">
            {message}
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className={`px-6 py-3 rounded-lg font-mono font-bold transition-all duration-300 border transform hover:scale-105 ${buttonStyles.cancel}`}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-6 py-3 rounded-lg font-mono font-bold transition-all duration-300 border transform hover:scale-105 ${buttonStyles.confirm}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
