/**
 * UserManagementExample - Ejemplo completo de implementación MVC
 * Demuestra cómo usar la arquitectura MVC con:
 * - userController para lógica de negocio
 * - userService para peticiones HTTP
 * - UserList para la vista
 */

import React, { useState, useEffect } from 'react';
import { userController } from '../controllers/userController.js';
import { userService } from '../services/userService.js';
import UserList from '../views/UserList.jsx';
import { useToast } from '../components/Toast.jsx';

const UserManagementExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [controllerState, setControllerState] = useState(null);
  const { showSuccess, showError } = useToast();

  /**
   * Carga usuarios usando el controlador
   */
  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // El controlador maneja toda la lógica de negocio
      const result = await userController.getAllUsers();
      
      if (result.success) {
        setUsers(result.data);
        setControllerState(userController.getState());
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error inesperado al cargar usuarios');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Crea un usuario usando el controlador
   */
  const createUser = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // El controlador valida los datos antes de enviar
      const result = await userController.createUser(userData);
      
      if (result.success) {
        setUsers(prev => [...prev, result.data]);
        setControllerState(userController.getState());
        showSuccess('Usuario creado correctamente', 'Éxito');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error inesperado al crear usuario');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualiza un usuario usando el controlador
   */
  const updateUser = async (userId, userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await userController.updateUser(userId, userData);
      
      if (result.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, ...result.data } : user
        ));
        setControllerState(userController.getState());
        showSuccess('Usuario actualizado correctamente', 'Éxito');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error inesperado al actualizar usuario');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Elimina un usuario usando el controlador
   */
  const deleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await userController.deleteUser(userId);
      
      if (result.success) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        setControllerState(userController.getState());
        showSuccess('Usuario eliminado correctamente', 'Éxito');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error inesperado al eliminar usuario');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Ejemplo de Gestión de Usuarios - Arquitectura MVC
        </h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            Arquitectura MVC Implementada:
          </h2>
          <ul className="text-blue-700 space-y-1">
            <li><strong>Controller:</strong> userController maneja la lógica de negocio</li>
            <li><strong>Service:</strong> userService maneja las peticiones HTTP</li>
            <li><strong>View:</strong> UserList maneja la presentación</li>
          </ul>
        </div>

        {/* Estado del controlador */}
        {controllerState && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Estado del Controlador:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Cargando:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  controllerState.isLoading 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {controllerState.isLoading ? 'Sí' : 'No'}
                </span>
              </div>
              <div>
                <span className="font-medium">Error:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  controllerState.error 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {controllerState.error ? 'Sí' : 'No'}
                </span>
              </div>
              <div>
                <span className="font-medium">Usuario Actual:</span>
                <span className="ml-2 text-gray-600">
                  {controllerState.currentUser?.name || 'Ninguno'}
                </span>
              </div>
            </div>
            {controllerState.error && (
              <div className="mt-2 text-red-600 text-sm">
                Error: {controllerState.error}
              </div>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={loadUsers}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? 'Cargando...' : 'Recargar Usuarios'}
          </button>
          
          <button
            onClick={() => {
              const newUser = {
                name: 'Usuario de Prueba',
                email: 'prueba@ejemplo.com',
                password: '123456',
                role: 'student',
                isActive: true
              };
              createUser(newUser);
            }}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Crear Usuario de Prueba
          </button>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Lista de usuarios */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Usuarios ({users.length})
            </h3>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Cargando usuarios...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay usuarios disponibles
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Creación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            const updatedUser = {
                              ...user,
                              name: user.name + ' (Editado)',
                              isActive: !user.isActive
                            };
                            updateUser(user.id, updatedUser);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Cómo funciona la arquitectura MVC:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-blue-600 mb-2">Controller</h4>
              <p className="text-sm text-gray-600 mb-2">
                Maneja la lógica de negocio del lado del cliente:
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Validación de datos</li>
                <li>• Coordinación entre vista y servicio</li>
                <li>• Manejo de estados de carga</li>
                <li>• Transformación de datos</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-green-600 mb-2">Service</h4>
              <p className="text-sm text-gray-600 mb-2">
                Maneja las peticiones HTTP a la API:
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Peticiones GET, POST, PUT, DELETE</li>
                <li>• Configuración de headers</li>
                <li>• Manejo de respuestas y errores</li>
                <li>• Interceptores de peticiones</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-purple-600 mb-2">View</h4>
              <p className="text-sm text-gray-600 mb-2">
                Maneja la presentación y UI:
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Componentes React</li>
                <li>• Formularios y validación</li>
                <li>• Estados de la interfaz</li>
                <li>• Interacción con el usuario</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementExample;
