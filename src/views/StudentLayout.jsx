/**
 * StudentLayout - Layout principal para estudiantes
 * Maneja las rutas anidadas del estudiante y la navegación
 */

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Starfield from '../components/Starfield.jsx';
import { userController } from '../controllers/userController.js';
import { useToast } from '../components/Toast.jsx';

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    // Cargar datos del estudiante al montar el componente
    loadStudentData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStudentData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar autenticación
      const authResult = await userController.getCurrentUser();
      
      if (!authResult.success) {
        console.error('Error en autenticación:', authResult.message);
        navigate('/auth');
        return;
      }

      // Manejar diferentes estructuras de respuesta
      let currentUser = null;
      if (authResult.data) {
        // Intentar diferentes estructuras posibles
        if (authResult.data.data?.user) {
          currentUser = authResult.data.data.user;
        } else if (authResult.data.user) {
          currentUser = authResult.data.user;
        } else if (authResult.data.data) {
          currentUser = authResult.data.data;
        } else if (authResult.data) {
          currentUser = authResult.data;
        }
      }

      if (!currentUser || !currentUser.id) {
        console.error('No se pudo obtener información del usuario');
        navigate('/auth');
        return;
      }

      // Verificar que sea estudiante
      if (currentUser.role !== 'estudiante') {
        if (currentUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/auth');
        }
        return;
      }

      setUser(currentUser);

      // Mostrar mensaje de bienvenida solo una vez por sesión
      const welcomeKey = `welcome_shown_${currentUser.id}`;
      const hasShownWelcome = localStorage.getItem(welcomeKey);
      
      if (!hasShownWelcome) {
        showSuccess(`¡Bienvenido al sistema espacial, ${currentUser.name}!`, 'Acceso exitoso');
        localStorage.setItem(welcomeKey, 'true');
      }

    } catch (error) {
      console.error('Error completo en loadStudentData:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Si ya tenemos usuario, no redirigir (podría ser un error temporal)
      if (!user) {
        setError('Error al cargar datos del estudiante');
        showError('Error al cargar datos del estudiante', 'Error de conexión');
        navigate('/auth');
      } else {
        // Si ya tenemos usuario, solo mostrar error pero no redirigir
        console.warn('Error al recargar datos del estudiante, pero usuario ya existe:', user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      
      // Limpiar el estado de bienvenida para la próxima sesión
      if (user?.id) {
        const welcomeKey = `welcome_shown_${user.id}`;
        localStorage.removeItem(welcomeKey);
      }
      
      await userController.logout();
      showSuccess('Sesión cerrada correctamente', 'Logout exitoso');
      navigate('/auth');
    } catch (error) {
      showError('Error al cerrar sesión', 'Error');
    }
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <Starfield />
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
            <p className="text-gray-300 font-mono">Cargando datos del estudiante...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <Starfield />
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white font-mono mb-2">Error</h2>
            <p className="text-gray-300 font-mono mb-4">{error}</p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-pink-400 px-6 py-2 rounded-lg font-mono transition-all duration-300 border border-pink-500/50"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Starfield />
      
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Header Section */}
      <header className="relative z-10 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm border-b border-pink-400/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Title and Navigation */}
            <div className="flex items-center space-x-4" style={{ margin: '10px 10px' }}>
              {location.pathname !== '/student' && (
                <button
                  onClick={() => {
                    // Lógica para determinar a dónde volver
                    if (location.pathname.startsWith('/student/game/')) {
                      navigate('/student/game');
                    } else {
                      navigate('/student');
                    }
                  }}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
                >
                  ← Volver
                </button>
              )}
              
              <div style={{ marginLeft: '10px', marginTop: '10px' }}>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-mono">
                  PANEL DE ESTUDIANTE
                </h1>
                <p className="text-gray-300 font-mono text-sm">
                  Bienvenido, {user?.name}
                </p>
              </div>
            </div>

            {/* Right side - Logout button */}
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 text-red-400 px-4 py-2 rounded-lg font-mono transition-all duration-300 border border-red-500/50"
              style={{ marginRight: '10px', marginTop: '10px' }}
            >
              CERRAR SESIÓN
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10">
        <Outlet />
      </div>
    </main>
  );
};

export default StudentLayout;
