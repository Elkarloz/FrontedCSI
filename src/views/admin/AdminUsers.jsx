/**
 * AdminUsers - Página de administración de usuarios
 * Maneja la gestión completa de usuarios del sistema
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from '../UserList.jsx';
import Modal from '../../components/Modal.jsx';

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
    age: userData?.age || '',
    grade: userData?.grade || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      console.log('Editando usuario:', formData);
      // Aquí iría la lógica para editar el usuario
    } else {
      console.log('Creando usuario:', formData);
      // Aquí iría la lógica para crear el usuario
    }
    onClose();
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-pink-400 font-mono mb-2">
            Edad
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800/50 border border-pink-400/30 rounded-lg text-white font-mono focus:border-pink-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-pink-400 font-mono mb-2">
            Grado
          </label>
          <input
            type="text"
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800/50 border border-pink-400/30 rounded-lg text-white font-mono focus:border-pink-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 font-mono"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
        >
          {isEdit ? 'Actualizar Usuario' : 'Crear Usuario'}
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
