/**
 * AdminUsers - Página de administración de usuarios
 * Maneja la gestión completa de usuarios del sistema
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from '../UserList.jsx';
import Modal from '../../components/Modal.jsx';
import { userController } from '../../controllers/userController.js';
import { useToast } from '../../components/Toast.jsx';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [showUserList, setShowUserList] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    data: null
  });

  // Modal handlers
  const openModal = (type, data = null) => {
    setModalState({
      isOpen: true,
      type,
      data
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      data: null
    });
  };

  // Modal helper functions
  const getModalTitle = (type) => {
    const titles = {
      'create-user': 'Crear Nuevo Usuario',
      'edit-user': 'Editar Usuario',
      'user-stats': 'Estadísticas de Usuarios'
    };
    return titles[type] || 'Modal';
  };

  const renderModalContent = (type, data) => {
    switch (type) {
      case 'create-user':
        return <CreateUserForm onClose={closeModal} userData={data} />;
      case 'edit-user':
        return <CreateUserForm onClose={closeModal} userData={data} isEdit={true} />;
      case 'user-stats':
        return <UserStatsPanel data={data} />;
      default:
        return <div className="text-center text-gray-400 font-mono">Contenido no disponible</div>;
    }
  };

  if (showUserList) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white font-mono">
                👥 Lista de Usuarios
              </h2>
              <button
                onClick={() => setShowUserList(false)}
                className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-mono transition-all duration-300"
              >
                <span>←</span>
                <span>Volver</span>
              </button>
            </div>
            <UserList />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white font-mono mb-3">
                👥 Administración de Usuarios
              </h2>
              <p className="text-gray-400 font-mono">
                Gestiona todos los aspectos relacionados con los usuarios del sistema
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="group bg-gradient-to-br from-pink-800/30 to-rose-800/30 rounded-xl p-6 border border-pink-400/30 hover:border-pink-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-pink-400/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-xl font-bold text-pink-400 font-mono">Ver Usuarios</h3>
                </div>
                <p className="text-gray-300 font-mono mb-6 leading-relaxed">
                  Listar y gestionar todos los usuarios del sistema, ver perfiles y estados
                </p>
                <button 
                  onClick={() => setShowUserList(true)}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 px-4 rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
                >
                  Ver Lista
                </button>
              </div>

              <div className="group bg-gradient-to-br from-emerald-800/30 to-teal-800/30 rounded-xl p-6 border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-400/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">➕</span>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-400 font-mono">Crear Usuario</h3>
                </div>
                <p className="text-gray-300 font-mono mb-6 leading-relaxed">
                  Agregar nuevos usuarios al sistema con roles y permisos específicos
                </p>
                <button 
                  onClick={() => openModal('create-user')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
                >
                  Crear Nuevo
                </button>
              </div>

              <div className="group bg-gradient-to-br from-purple-800/30 to-violet-800/30 rounded-xl p-6 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-purple-400 font-mono">Estadísticas</h3>
                </div>
                <p className="text-gray-300 font-mono mb-6 leading-relaxed">
                  Ver estadísticas detalladas de usuarios y progreso del sistema
                </p>
                <button 
                  onClick={() => openModal('user-stats')}
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
                >
                  Ver Stats
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={getModalTitle(modalState.type)}
        size="large"
        animation="scale"
      >
        {renderModalContent(modalState.type, modalState.data)}
      </Modal>
    </>
  );
};

// Create User Form Component
const CreateUserForm = ({ onClose, userData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    password: '',
    role: userData?.role || 'estudiante',
    isActive: userData?.isActive !== undefined ? userData.isActive : true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { showSuccess, showError } = useToast();

  // Actualizar el estado del formulario cuando cambien los datos del usuario
  React.useEffect(() => {
    if (userData && isEdit) {
      console.log('🔄 CreateUserForm - Actualizando datos del formulario:', userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: '', // No cargar la contraseña por seguridad
        role: userData.role || 'estudiante',
        isActive: userData.isActive !== undefined ? userData.isActive : true
      });
    }
  }, [userData, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.email.includes('@')) newErrors.email = 'El email debe ser válido';
    if (!isEdit && !formData.password.trim()) newErrors.password = 'La contraseña es requerida';
    if (formData.password && formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      let result;
      if (isEdit) {
        console.log('🔄 Editando usuario:', formData);
        result = await userController.updateUser(userData.id, formData);
      } else {
        console.log('🔄 Creando usuario:', formData);
        result = await userController.createUser(formData);
      }
      
      if (result.success) {
        showSuccess(
          isEdit ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente', 
          'Éxito'
        );
        onClose();
      } else {
        showError(result.message || 'Error al procesar el usuario', 'Error');
      }
    } catch (error) {
      console.error('💥 Error en CreateUserForm:', error);
      showError('Error inesperado al procesar el usuario', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-pink-400 font-mono mb-2">
            Nombre Completo
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800/50 border border-pink-400/30 rounded-lg text-white font-mono focus:border-pink-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-pink-400 font-mono mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800/50 border border-pink-400/30 rounded-lg text-white font-mono focus:border-pink-400 focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-pink-400 font-mono mb-2">
            Contraseña {isEdit && <span className="text-gray-400 text-xs">(dejar vacío para mantener la actual)</span>}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800/50 border border-pink-400/30 rounded-lg text-white font-mono focus:border-pink-400 focus:outline-none"
            placeholder={isEdit ? "Nueva contraseña (opcional)" : "Mínimo 6 caracteres"}
            required={!isEdit}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-pink-400 font-mono mb-2">
            Rol
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800/50 border border-pink-400/30 rounded-lg text-white font-mono focus:border-pink-400 focus:outline-none"
          >
            <option value="estudiante">Estudiante</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>

      {/* Estado Activo */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          disabled={isSubmitting}
          className="h-5 w-5 text-pink-400 bg-gray-800 border-gray-400 rounded focus:ring-pink-400 focus:ring-2"
        />
        <label className="text-sm font-bold text-pink-400 font-mono">
          ✅ Usuario Activo
        </label>
      </div>

      {/* Mostrar errores */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg font-mono">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            <div>
              {Object.values(errors).map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 font-mono disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-lg font-mono transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
        >
          {isSubmitting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          <span>{isSubmitting ? 'Procesando...' : (isEdit ? 'Actualizar Usuario' : 'Crear Usuario')}</span>
        </button>
      </div>
    </form>
  );
};

// User Stats Panel Component
const UserStatsPanel = ({ data }) => {
  const stats = [
    { label: 'Total Usuarios', value: '1,247', color: 'pink' },
    { label: 'Usuarios Activos', value: '892', color: 'emerald' },
    { label: 'Nuevos Hoy', value: '23', color: 'cyan' },
    { label: 'Progreso Promedio', value: '78%', color: 'purple' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-pink-400/20">
            <div className="text-center">
              <div className={`text-3xl font-bold text-${stat.color}-400 font-mono mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-300 font-mono text-sm">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-pink-400/20">
        <h3 className="text-xl font-bold text-pink-400 font-mono mb-4">
          📊 Actividad Reciente
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-mono">Usuarios registrados esta semana</span>
            <span className="text-emerald-400 font-mono font-bold">+45</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-mono">Ejercicios completados</span>
            <span className="text-cyan-400 font-mono font-bold">1,234</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-mono">Tiempo promedio de sesión</span>
            <span className="text-purple-400 font-mono font-bold">24 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
