/**
 * UserForm - Formulario para crear/editar usuarios con tema cyberpunk
 * Responsabilidades:
 * - Mostrar formulario de usuario
 * - Validar datos de entrada
 * - Aplicar estilos cyberpunk consistentes
 */

import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { useToast } from '../Toast.jsx';

const UserForm = ({ user, onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'estudiante',
    isActive: user?.isActive !== undefined ? user.isActive : true
  });

  // Actualizar el estado del formulario cuando cambien los datos del usuario
  useEffect(() => {
    if (user) {
      console.log('🔄 UserForm - Actualizando datos del formulario:', user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // No cargar la contraseña por seguridad
        role: user.role || 'estudiante',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    }
  }, [user]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.email.includes('@')) newErrors.email = 'El email debe ser válido';
    if (!user && !formData.password.trim()) newErrors.password = 'La contraseña es requerida';
    if (formData.password && formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      showError(error.message || 'Error al procesar el formulario', 'Error de validación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onCancel();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={user ? '✏️ Editar Usuario' : '➕ Crear Usuario'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-bold text-pink-400 font-mono mb-2">
            👤 Nombre Completo
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg font-mono text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all duration-200 ${
              errors.name ? 'border-red-500/50' : 'border-gray-400/50'
            }`}
            placeholder="Ingresa el nombre completo"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400 font-mono">⚠️ {errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-pink-400 font-mono mb-2">
            📧 Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg font-mono text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all duration-200 ${
              errors.email ? 'border-red-500/50' : 'border-gray-400/50'
            }`}
            placeholder="usuario@ejemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400 font-mono">⚠️ {errors.email}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-bold text-pink-400 font-mono mb-2">
            🔒 Contraseña {user && <span className="text-gray-400 text-xs">(dejar vacío para mantener la actual)</span>}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg font-mono text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all duration-200 ${
              errors.password ? 'border-red-500/50' : 'border-gray-400/50'
            }`}
            placeholder={user ? "Nueva contraseña (opcional)" : "Mínimo 6 caracteres"}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-400 font-mono">⚠️ {errors.password}</p>
          )}
        </div>

        {/* Rol */}
        <div>
          <label className="block text-sm font-bold text-pink-400 font-mono mb-2">
            🎭 Rol de Usuario
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-400/50 rounded-lg font-mono text-white focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all duration-200"
          >
            <option value="estudiante">👨‍🎓 Estudiante</option>
            <option value="admin">👑 Administrador</option>
          </select>
        </div>

        {/* Estado Activo */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            disabled={isSubmitting}
            className="h-5 w-5 text-pink-400 bg-gray-800 border-gray-400 rounded focus:ring-pink-400 focus:ring-2"
          />
          <label className="text-sm font-bold text-pink-400 font-mono">
            ✅ Usuario Activo
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-600/30">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/30 hover:to-gray-700/30 text-gray-300 hover:text-white font-bold rounded-lg font-mono transition-all duration-300 border border-gray-500/50 hover:border-gray-400/70 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            ❌ Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-400 hover:text-emerald-300 font-bold rounded-lg font-mono transition-all duration-300 border border-emerald-500/50 hover:border-emerald-400/70 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <span>{user ? '💾 Actualizar' : '✨ Crear'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserForm;
