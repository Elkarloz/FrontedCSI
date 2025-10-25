/**
 * UserList - Vista para mostrar la lista de usuarios
 * Responsabilidades:
 * - Mostrar lista de usuarios
 * - Manejar acciones de usuario (crear, editar, eliminar)
 * - Coordinar con el controlador para la lógica de negocio
 */

import React, { useState, useEffect } from 'react';
import { userController } from '../controllers/userController.js';
import UserForm from '../components/forms/UserForm.jsx';
import { useToast } from '../components/Toast.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null
  });
  const { showSuccess, showError, showWarning } = useToast();

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Carga la lista de usuarios usando el controlador
   */
  const loadUsers = async () => {
    console.log('🔄 UserList.loadUsers() - Iniciando carga de usuarios...');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 UserList.loadUsers() - Llamando a userController.getAllUsers()');
      const result = await userController.getAllUsers();
      console.log('🔄 UserList.loadUsers() - Resultado del controlador:', result);
      
      if (result.success) {
        console.log('✅ UserList.loadUsers() - Usuarios cargados exitosamente:', result.data);
        setUsers(result.data);
        setError(null);
      } else {
        console.error('❌ UserList.loadUsers() - Error del controlador:', result.message);
        setError(result.message);
        showError(result.message, 'Error al cargar usuarios');
      }
    } catch (error) {
      console.error('💥 UserList.loadUsers() - Error inesperado:', error);
      const errorMessage = 'Error inesperado al cargar usuarios: ' + error.message;
      setError(errorMessage);
      showError(errorMessage, 'Error inesperado');
    }
    
    setIsLoading(false);
  };

  /**
   * Maneja la creación de un nuevo usuario
   * @param {Object} userData - Datos del usuario
   */
  const handleCreateUser = async (userData) => {
    console.log('🔄 UserList.handleCreateUser() - Creando usuario:', userData);
    const result = await userController.createUser(userData);
    
    if (result.success) {
      console.log('✅ UserList.handleCreateUser() - Usuario creado exitosamente');
      setShowCreateForm(false);
      showSuccess('Usuario creado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadUsers();
    } else {
      console.error('❌ UserList.handleCreateUser() - Error al crear:', result.message);
      setError(result.message);
      showError(result.message, 'Error al crear usuario');
    }
  };

  /**
   * Maneja la actualización de un usuario
   * @param {string} userId - ID del usuario
   * @param {Object} userData - Datos actualizados
   */
  const handleUpdateUser = async (userId, userData) => {
    console.log('🔄 UserList.handleUpdateUser() - Actualizando usuario:', userId, userData);
    const result = await userController.updateUser(userId, userData);
    
    if (result.success) {
      console.log('✅ UserList.handleUpdateUser() - Usuario actualizado exitosamente');
      setEditingUser(null);
      showSuccess('Usuario actualizado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadUsers();
    } else {
      console.error('❌ UserList.handleUpdateUser() - Error al actualizar:', result.message);
      setError(result.message);
      showError(result.message, 'Error al actualizar usuario');
    }
  };

  /**
   * Maneja la eliminación de un usuario
   * @param {string} userId - ID del usuario
   */
  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmDialog({
      isOpen: true,
      type: 'error',
      title: 'Eliminar Usuario',
      message: `¿Estás seguro de que quieres eliminar al usuario "${user?.name || 'este usuario'}"? Esta acción no se puede deshacer.`,
      onConfirm: () => executeDeleteUser(userId)
    });
  };

  /**
   * Ejecuta la eliminación del usuario
   * @param {string} userId - ID del usuario
   */
  const executeDeleteUser = async (userId) => {
    console.log('🔄 UserList.executeDeleteUser() - Eliminando usuario:', userId);
    const result = await userController.deleteUser(userId);
    
    if (result.success) {
      console.log('✅ UserList.executeDeleteUser() - Usuario eliminado exitosamente');
      showSuccess('Usuario eliminado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadUsers();
    } else {
      console.error('❌ UserList.executeDeleteUser() - Error al eliminar:', result.message);
      setError(result.message);
      showError(result.message, 'Error al eliminar usuario');
    }
  };

  /**
   * Inicia la edición de un usuario
   * @param {Object} user - Usuario a editar
   */
  const startEditing = (user) => {
    setEditingUser(user);
  };

  /**
   * Cancela la edición
   */
  const cancelEditing = () => {
    setEditingUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-xl font-mono text-pink-400">Cargando usuarios...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modales fuera del contenedor principal */}
      <UserForm
        isOpen={showCreateForm}
        onSubmit={handleCreateUser}
        onCancel={() => setShowCreateForm(false)}
      />

      <UserForm
        isOpen={!!editingUser}
        user={editingUser}
        onSubmit={(userData) => handleUpdateUser(editingUser?.id, userData)}
        onCancel={cancelEditing}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
    
            <p className="text-gray-400 font-mono text-lg">
              Gestiona todos los usuarios del sistema
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg font-mono transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
          >
            ➕ Crear Usuario
          </button>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg mb-6 font-mono">
            <div className="flex items-center">
              <span className="text-xl mr-3">⚠️</span>
              <span className="font-bold">{error}</span>
            </div>
          </div>
        )}

      <div className="mx-8"  style={{margin: '0px 20px', marginTop: '20px'}}>
        <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-800/50 to-pink-800/50">
              <tr>
                <th className="px-8 py-6 text-left text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                  👤 Usuario
                </th>
                <th className="px-8 py-6 text-left text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                  📧 Email
                </th>
                <th className="px-8 py-6 text-left text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                  🎭 Rol
                </th>
                <th className="px-8 py-6 text-left text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                  ⚡ Estado
                </th>
                <th className="px-8 py-6 text-center text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                  ⚙️ Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600/30">
              {users.map((user, index) => (
                <tr key={user.id} className={`hover:bg-gradient-to-r hover:from-purple-800/20 hover:to-pink-800/20 transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-900/30'}`}>
                  <td className="px-8 py-6">
                    <div>
                      <div className="text-lg font-bold text-white font-mono">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-400 font-mono">
                        ID: {user.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-base text-gray-300 font-mono">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full font-mono ${
                      user.role === 'admin' 
                        ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/50' 
                        : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/50'
                    }`}>
                      {user.role === 'admin' ? '👑 Admin' : '👨‍🎓 Estudiante'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full font-mono ${
                      user.isActive === 1 || user.isActive === true
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/50' 
                        : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/50'
                    }`}>
                      {user.isActive === 1 || user.isActive === true ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => startEditing(user)}
                        className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-blue-400 hover:text-blue-300 px-4 py-2 rounded-lg font-mono font-bold transition-all duration-300 border border-blue-500/50 hover:border-blue-400/70 transform hover:scale-105"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg font-mono font-bold transition-all duration-300 border border-red-500/50 hover:border-red-400/70 transform hover:scale-105"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {users.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 p-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-white font-mono mb-2">
              No hay usuarios registrados
            </h3>
            <p className="text-gray-400 font-mono text-lg">
              Comienza creando el primer usuario del sistema
            </p>
          </div>
        </div>
      )}
      </div>
    </>
  );
};


export default UserList;
