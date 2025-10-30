/**
 * AdminLayout - Layout principal para el panel de administración
 * Maneja las rutas anidadas del admin y la navegación
 */

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Starfield from '../components/Starfield.jsx';
import { userController } from '../controllers/userController.js';
import { useToast } from '../components/Toast.jsx';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasShownWelcomeToast = useRef(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    // Cargar datos de administración al montar el componente
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      console.log('👑 AdminLayout - Cargando datos de administración...');
      setIsLoading(true);
      setError(null);
      
      const userResponse = await userController.getCurrentUser();
      console.log('👑 AdminLayout - Respuesta getCurrentUser:', userResponse);
      
      if (userResponse.success) {
        console.log('👑 AdminLayout - Usuario cargado:', userResponse.data);
        
        // El usuario está en userResponse.data.data.user
        const userData = userResponse.data.data?.user || userResponse.data;
        console.log('👑 AdminLayout - Datos del usuario extraídos:', userData);
        
        setUser(userData);
        
        if (userData.role !== 'admin') {
          console.log('❌ AdminLayout - Usuario no es admin:', userData.role);
          setError('Acceso denegado. Se requieren permisos de administrador.');
          showError('Acceso denegado. Se requieren permisos de administrador.', 'Error de permisos');
          return;
        }
        
        console.log('✅ AdminLayout - Usuario admin verificado correctamente');
        console.log('🔍 AdminLayout - hasShownWelcomeToast:', hasShownWelcomeToast.current);
        // Solo mostrar toast de bienvenida una vez cuando el usuario se carga por primera vez
        if (!hasShownWelcomeToast.current) {
          console.log('🎉 AdminLayout - Mostrando toast de bienvenida');
          showSuccess('Bienvenido al panel de administración', 'Acceso autorizado');
          hasShownWelcomeToast.current = true;
        } else {
          console.log('⏭️ AdminLayout - Toast ya mostrado, saltando');
        }
      } else {
        console.log('❌ AdminLayout - Error al cargar usuario:', userResponse.message);
        setError(userResponse.message);
      }
    } catch (error) {
      console.error('💥 AdminLayout - Error inesperado:', error);
      setError('Error al cargar datos de administración');
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

  // Función para obtener el título de la página actual
  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/admin': 'Panel de Administración',
      '/admin/users': 'Administrar Usuarios',
      '/admin/contents': 'Gestionar Contenidos',
      '/admin/game': 'Gestión del Juego',
      '/admin/game/planets': 'Gestionar Planetas',
      '/admin/game/levels': 'Gestionar Niveles',
      '/admin/game/exercises': 'Gestionar Ejercicios',
      '/admin/reports': 'Reportes de Progreso'
    };
    return titles[path] || 'Panel de Administración';
  };


  if (isLoading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Starfield />
        <div className="relative z-10 text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-cyan-400 text-lg font-mono">Cargando panel de administración...</p>
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
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded font-mono"
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

      {/* Header Section */}
      <header className="relative z-10 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm border-b border-pink-400/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Title and Navigation */}
            <div className="flex items-center space-x-4" style={{ margin: '10px 10px' }}>
              {location.pathname !== '/admin' && (
                <button
                  onClick={() => {
                    // Lógica para determinar a dónde volver
                    if (location.pathname.startsWith('/admin/game/')) {
                      navigate('/admin/game');
                    } else {
                      navigate('/admin');
                    }
                  }}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
                >
                  ← Volver
                </button>
              )}
              
              <div style={{ marginLeft: '10px', marginTop: '10px' }}>
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

      {/* Content */}
      <div className="relative z-10">
        <Outlet />
      </div>
    </main>
  );
};

export default AdminLayout;
