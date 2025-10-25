/**
 * ProfilePage - Página de perfil del usuario
 * Muestra información del usuario y estadísticas de progreso
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Starfield from '../components/Starfield.jsx';
import { userController } from '../controllers/userController.js';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userResponse = await userController.getCurrentUser();
      if (userResponse.success) {
        setUser(userResponse.data);
      } else {
        setError(userResponse.message);
      }
    } catch (error) {
      setError('Error al cargar el perfil');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await userController.logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Starfield />
        <div className="relative z-10 text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-cyan-400 text-lg font-mono">Cargando perfil...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Starfield />
        <div className="relative z-10 text-center space-y-4">
          <p className="text-red-400 text-lg font-mono">Error: {error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded font-mono border border-gray-400"
          >
            Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Starfield />
      
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Header */}
      <div className="absolute top-8 left-8 z-10">
        <button
          onClick={() => navigate('/space-map')}
          className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-mono transition-all duration-300 mb-4 border border-gray-400"
        >
          <span>←</span>
          <span>Volver al mapa</span>
        </button>
        <h1 className="text-3xl font-bold text-cyan-400 font-mono">
          PERFIL DE USUARIO
        </h1>
      </div>

      {/* Logout button */}
      <div className="absolute top-8 right-8 z-10">
        <button
          onClick={handleLogout}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg font-mono transition-all duration-300 border border-gray-400"
        >
          CERRAR SESIÓN
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* User info card */}
          <div className="bg-gray-900/95 rounded-lg p-8 border border-cyan-400/30">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-green-400 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-black font-mono">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-mono">
                  {user?.name}
                </h2>
                <p className="text-gray-300 font-mono">
                  {user?.email}
                </p>
                <p className="text-cyan-400 font-mono">
                  {user?.role === 'admin' ? 'Administrador' : 'Estudiante'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/95 rounded-lg p-6 border border-cyan-400/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 font-mono">
                  {stats?.completedExercises || 0}
                </div>
                <p className="text-gray-300 font-mono mt-2">
                  Ejercicios Completados
                </p>
              </div>
            </div>

            <div className="bg-gray-900/95 rounded-lg p-6 border border-green-400/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 font-mono">
                  {stats?.completedLevels || 0}
                </div>
                <p className="text-gray-300 font-mono mt-2">
                  Niveles Completados
                </p>
              </div>
            </div>

            <div className="bg-gray-900/95 rounded-lg p-6 border border-purple-400/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 font-mono">
                  {stats?.totalPoints || 0}
                </div>
                <p className="text-gray-300 font-mono mt-2">
                  Puntos Totales
                </p>
              </div>
            </div>
          </div>

          {/* Progress section */}
          <div className="bg-gray-900/95 rounded-lg p-8 border border-cyan-400/30">
            <h3 className="text-xl font-bold text-white font-mono mb-6">
              Progreso General
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 font-mono">Ejercicios</span>
                  <span className="text-cyan-400 font-mono">
                    {stats?.completedExercises || 0} / {stats?.totalExercises || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-green-400 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats?.totalExercises ? (stats.completedExercises / stats.totalExercises) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 font-mono">Niveles</span>
                  <span className="text-green-400 font-mono">
                    {stats?.completedLevels || 0} / {stats?.totalLevels || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats?.totalLevels ? (stats.completedLevels / stats.totalLevels) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/space-map')}
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-green-500 hover:to-cyan-500 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl font-mono border border-gray-400"
            >
              CONTINUAR APRENDIZAJE
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
