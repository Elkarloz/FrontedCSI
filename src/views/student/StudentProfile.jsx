/**
 * StudentProfile - Gestión de perfil para estudiantes
 * Permite a los estudiantes actualizar su información personal
 */

import React, { useState, useEffect } from 'react';
import { userController } from '../../controllers/userController.js';
import { useToast } from '../../components/Toast.jsx';

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  // Monitorear cambios en formData
  useEffect(() => {
    console.log('📊 FormData cambió:', formData);
  }, [formData]);

  const loadUserData = async () => {
    try {
      console.log('👤 Cargando datos del usuario...');
      setIsLoading(true);
      setError(null);

      const result = await userController.getCurrentUser();
      
      if (result.success) {
        console.log('📊 Datos recibidos del usuario:', JSON.stringify(result.data, null, 2));
        console.log('📊 Estructura de result.data:', Object.keys(result.data || {}));
        console.log('📊 Nombre:', result.data?.name);
        console.log('📊 Email:', result.data?.email);
        console.log('📊 Tipo de result.data:', typeof result.data);
        
        // Los datos están en result.data.user
        console.log('📊 result.data.user:', result.data.user);
        console.log('📊 result.data keys:', Object.keys(result.data));
        console.log('📊 result.data.data:', result.data.data);
        console.log('📊 result.data.data.user:', result.data.data?.user);
        
        // Intentar acceder a los datos del usuario desde diferentes estructuras posibles
        const userData = result.data.user || result.data.data?.user;
        
        if (!userData) {
          console.error('❌ userData es undefined. Estructura completa:', JSON.stringify(result.data, null, 2));
          setError('Datos del usuario no encontrados');
          return;
        }
        
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          newPassword: '',
          confirmPassword: ''
        });
        console.log('✅ Datos del usuario cargados');
        console.log('📊 FormData actualizado:', {
          name: userData.name || '',
          email: userData.email || ''
        });
        console.log('📊 userData completo:', userData);
      } else {
        setError(result.message);
        showError(result.message, 'Error al cargar datos');
      }
    } catch (error) {
      console.error('💥 Error cargando datos del usuario:', error);
      setError('Error al cargar datos del usuario');
      showError('Error al cargar datos del usuario', 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      console.log('💾 Guardando perfil del usuario...');
      setIsSaving(true);
      setError(null);

      // Validar contraseñas si se está cambiando
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Las contraseñas nuevas no coinciden');
          return;
        }
      }

      const updateData = {
        name: formData.name,
        email: formData.email
      };

      // Solo incluir contraseñas si se están cambiando
      if (formData.newPassword) {
        updateData.newPassword = formData.newPassword;
      }

      const result = await userController.updateUser(user.id, updateData);
      
      if (result.success) {
        setUser(result.data);
        showSuccess('Perfil actualizado correctamente', 'Cambios guardados');
        
        // Limpiar campos de contraseña
        setFormData(prev => ({
          ...prev,
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setError(result.message);
        showError(result.message, 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('💥 Error actualizando perfil:', error);
      setError('Error al actualizar perfil');
      showError('Error al actualizar perfil', 'Error de conexión');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
            <p className="text-gray-300 font-mono">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white font-mono mb-2">Error</h2>
            <p className="text-gray-300 font-mono">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white font-mono mb-4">
            👤 Mi Perfil
          </h2>
          <p className="text-gray-400 font-mono">
            Gestiona tu información personal
          </p>
        </div>

        {/* Profile Form */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-gray-600">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 font-mono text-sm mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white font-mono focus:border-pink-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 font-mono text-sm mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white font-mono focus:border-pink-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="border-t border-gray-600 pt-6">
              <h3 className="text-lg font-bold text-white font-mono mb-4">
                🔒 Cambiar contraseña (opcional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-mono text-sm mb-2">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white font-mono focus:border-pink-500 focus:outline-none transition-colors"
                    placeholder="Deja vacío para mantener la contraseña actual"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 font-mono text-sm mb-2">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white font-mono focus:border-pink-500 focus:outline-none transition-colors"
                    placeholder="Repite la nueva contraseña"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400 font-mono text-sm">{error}</p>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-pink-400 px-6 py-3 rounded-lg font-mono transition-all duration-300 border border-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Guardando...' : '💾 Guardar cambios'}
              </button>
            </div>
          </form>
        </div>

        {/* User Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl p-6 border border-blue-500/30">
            <div className="text-center">
              <div className="text-3xl mb-2">👤</div>
              <h3 className="text-lg font-bold text-white font-mono">Rol</h3>
              <p className="text-blue-400 font-mono">Estudiante</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-xl p-6 border border-green-500/30">
            <div className="text-center">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="text-lg font-bold text-white font-mono">Miembro desde</h3>
              <p className="text-green-400 font-mono">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl p-6 border border-purple-500/30">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-lg font-bold text-white font-mono">Progreso</h3>
              <p className="text-purple-400 font-mono">En desarrollo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
