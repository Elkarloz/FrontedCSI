/**
 * AdminPage - Página de administración
 * Panel de control para administradores del sistema
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Starfield from '../components/Starfield.jsx';
import Modal from '../components/Modal.jsx';
import { userController } from '../controllers/userController.js';
import { planetService } from '../services/planetService.js';
import UserList from './UserList.jsx';
import PlanetList from '../components/PlanetList.jsx';
import LevelList from '../components/LevelList.jsx';
import ExerciseList from '../components/ExerciseList.jsx';
import ContentList from '../components/ContentList.jsx';
import { useToast } from '../components/Toast.jsx';

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const hasShownWelcomeToast = useRef(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    data: null
  });
  const { showSuccess, showError } = useToast();
  
  

  useEffect(() => {
    // Cargar datos de administración al montar el componente
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      console.log('👑 AdminPage - Cargando datos de administración...');
      setIsLoading(true);
      setError(null);
      
      const userResponse = await userController.getCurrentUser();
      console.log('👑 AdminPage - Respuesta getCurrentUser:', userResponse);
      
      if (userResponse.success) {
        console.log('👑 AdminPage - Usuario cargado:', userResponse.data);
        
        // El usuario está en userResponse.data.data.user
        const userData = userResponse.data.data?.user || userResponse.data;
        console.log('👑 AdminPage - Datos del usuario extraídos:', userData);
        
        setUser(userData);
        
        if (userData.role !== 'admin') {
          console.log('❌ AdminPage - Usuario no es admin:', userData.role);
          setError('Acceso denegado. Se requieren permisos de administrador.');
          showError('Acceso denegado. Se requieren permisos de administrador.', 'Error de permisos');
          return;
        }
        
        console.log('✅ AdminPage - Usuario admin verificado correctamente');
        console.log('🔍 AdminPage - hasShownWelcomeToast:', hasShownWelcomeToast.current);
        // Solo mostrar toast de bienvenida una vez cuando el usuario se carga por primera vez
        if (!hasShownWelcomeToast.current) {
          console.log('🎉 AdminPage - Mostrando toast de bienvenida');
          showSuccess('Bienvenido al panel de administración', 'Acceso autorizado');
          hasShownWelcomeToast.current = true;
        } else {
          console.log('⏭️ AdminPage - Toast ya mostrado, saltando');
        }
      } else {
        console.log('❌ AdminPage - Error al cargar usuario:', userResponse.message);
        setError(userResponse.message);
      }
    } catch (error) {
      console.error('💥 AdminPage - Error inesperado:', error);
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
      'user-stats': 'Estadísticas de Usuarios',
      'create-content': 'Crear Contenido Educativo',
      'manage-planets': 'Gestionar Planetas',
      'manage-levels': 'Gestionar Niveles',
      'manage-exercises': 'Gestionar Ejercicios',
      'system-info': 'Información del Sistema'
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
      case 'create-content':
        return <CreateContentForm onClose={closeModal} />;
      case 'manage-planets':
        return <PlanetList />;
      case 'manage-levels':
        return <LevelList />;
      case 'manage-exercises':
        return <ExerciseManagementPanel onClose={closeModal} />;
      case 'system-info':
        return <SystemInfoPanel data={data} />;
      default:
        return <div className="text-center text-gray-400 font-mono">Contenido no disponible</div>;
    }
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

  // Si estamos en la gestión de planetas, niveles, ejercicios o contenidos, mostrar directamente las listas
  if (modalState.isOpen && (modalState.type === 'manage-planets' || modalState.type === 'manage-levels' || modalState.type === 'manage-exercises' || modalState.type === 'manage-contents')) {
    return (
      <>
        <main className="relative min-h-screen overflow-hidden">
          <Starfield />
          
          {/* Cyber grid background */}
          <div className="absolute inset-0 cyber-grid opacity-30" />

          {/* Header Section */}
          <header className="relative z-10 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm border-b border-pink-400/30">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Left side - Title and Back button */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={closeModal}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
                  >
                    ← Volver
                  </button>
                 
                </div>

                {/* Right side - Logout button */}
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 text-red-400 px-4 py-2 rounded-lg font-mono transition-all duration-300 border border-red-500/50"
                >
                  CERRAR SESIÓN
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="relative z-10">
            {modalState.type === 'manage-planets' && <PlanetList />}
            {modalState.type === 'manage-levels' && <LevelList />}
            {modalState.type === 'manage-exercises' && <ExerciseList />}
            {modalState.type === 'manage-contents' && <ContentList />}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="relative min-h-screen overflow-hidden">
        <Starfield />
        
        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid opacity-30" />

        {/* Header Section - Reorganized */}
        <header className="relative z-10 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm border-b border-pink-400/30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Title */}
              <div className="flex items-center">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-mono">
                    PANEL DE ADMINISTRACIÓN
                  </h1>
                  <p className="text-gray-300 font-mono text-sm">
                    Bienvenido, {user?.name}
                  </p>
                </div>
              </div>

              {/* Right side - Test Toast & Logout */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 text-red-400 px-4 py-2 rounded-lg font-mono transition-all duration-300 border border-red-500/50"
                >
                  CERRAR SESIÓN
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Better organized */}
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {!activeTab ? (
              /* Main Categories Selection */
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white font-mono mb-4">
                  ¿Qué deseas administrar?
                </h2>
                <p className="text-gray-400 font-mono text-lg">
                  Selecciona una categoría para comenzar
                </p>
              </div>
            ) : (
              /* Back Button */
              <div className="mb-8">
                <button
                  onClick={() => setActiveTab(null)}
                  className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-mono transition-all duration-300"
                >
                  <span>←</span>
                  <span>Volver a categorías</span>
                </button>
              </div>
            )}

            {showUserList ? (
              /* User List View */
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
            ) : !activeTab ? (
              /* Main Categories Grid */
              <div className="grid grid-cols-2 gap-8">
                {[
                  { id: 'users', label: 'Administrar Usuarios', description: 'Gestionar usuarios del sistema', color: 'pink' },
                  { id: 'content', label: 'Gestionar Contenidos', description: 'Administrar materiales educativos', color: 'emerald' },
                  { id: 'game', label: 'Gestionar Juego', description: 'Configurar planetas, niveles y ejercicios', color: 'orange' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 rounded-xl p-8 border border-gray-600 hover:border-gray-500 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="text-center">
                      <div className={`w-20 h-20 bg-${tab.color}-500/20 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <span className="text-4xl">
                          {tab.id === 'users' && '👥'}
                          {tab.id === 'content' && '📚'}
                          {tab.id === 'game' && '🚀'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white font-mono">{tab.label}</h3>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Sub-options Content */
              <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl p-8 border border-pink-400/30 shadow-2xl shadow-pink-400/20">
                {activeTab === 'users' && (
                  <UsersManagementTab setShowUserList={setShowUserList} openModal={openModal} />
                )}
                {activeTab === 'content' && (
                  <ContentManagementTab openModal={openModal} />
                )}
                {activeTab === 'game' && (
                  <GameManagementTab openModal={openModal} showSuccess={showSuccess} showError={showError} />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal - Fuera del contenedor principal para centrado perfecto */}
      <Modal
        isOpen={modalState.isOpen && modalState.type !== 'manage-planets' && modalState.type !== 'manage-levels' && modalState.type !== 'manage-exercises' && modalState.type !== 'manage-contents'}
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

// Users Management Tab Component
const UsersManagementTab = ({ setShowUserList, openModal }) => (
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
);

// Content Management Tab Component
const ContentManagementTab = ({ openModal }) => (
  <div className="space-y-8">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white font-mono mb-3">
        📚 Gestión de Contenidos Educativos
      </h2>
      <p className="text-gray-400 font-mono">
        Administra todos los materiales educativos y recursos del sistema
      </p>
    </div>
    
    <div className="grid grid-cols-2 gap-6">
      <div className="group bg-gradient-to-br from-blue-800/30 to-indigo-800/30 rounded-xl p-6 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/20">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="text-xl font-bold text-blue-400 font-mono">Materiales</h3>
        </div>
        <p className="text-gray-300 font-mono mb-6 leading-relaxed">
          Gestionar documentos, videos, imágenes y recursos educativos
        </p>
        <button 
          onClick={() => openModal('manage-contents')}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
        >
          Administrar
        </button>
      </div>

      <div className="group bg-gradient-to-br from-yellow-800/30 to-amber-800/30 rounded-xl p-6 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">🏷️</span>
          </div>
          <h3 className="text-xl font-bold text-yellow-400 font-mono">Categorías</h3>
        </div>
        <p className="text-gray-300 font-mono mb-6 leading-relaxed">
          Organizar y clasificar contenidos por categorías temáticas
        </p>
        <button className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold py-3 px-4 rounded-lg font-mono transition-all duration-300 transform hover:scale-105">
          Categorizar
        </button>
      </div>

      <div className="group bg-gradient-to-br from-red-800/30 to-pink-800/30 rounded-xl p-6 border border-red-400/30 hover:border-red-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-400/20">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-bold text-red-400 font-mono">Biblioteca</h3>
        </div>
        <p className="text-gray-300 font-mono mb-6 leading-relaxed">
          Explorar y gestionar toda la biblioteca de contenidos disponibles
        </p>
        <button 
          onClick={() => openModal('manage-contents')}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
        >
          Explorar
        </button>
      </div>
    </div>
  </div>
);

// Game Management Tab Component
const GameManagementTab = ({ openModal, showSuccess, showError }) => (
  <div className="space-y-8">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white font-mono mb-3">
        🚀 Gestión del Juego Espacial
      </h2>
      <p className="text-gray-400 font-mono">
        Configura todos los elementos del juego educativo espacial
      </p>
    </div>
    
    <div className="grid grid-cols-2 gap-6">
      <div className="group bg-gradient-to-br from-cyan-800/30 to-teal-800/30 rounded-xl p-6 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">🪐</span>
          </div>
          <h3 className="text-xl font-bold text-cyan-400 font-mono">Planetas</h3>
        </div>
        <p className="text-gray-300 font-mono mb-6 leading-relaxed">
          Crear y configurar planetas del sistema solar educativo
        </p>
        <button 
          onClick={() => openModal('manage-planets')}
          className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-black font-bold py-3 px-4 rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
        >
          Gestionar Planetas
        </button>
      </div>

      <div className="group bg-gradient-to-br from-lime-800/30 to-green-800/30 rounded-xl p-6 border border-lime-400/30 hover:border-lime-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-lime-400/20">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-lime-500/20 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="text-xl font-bold text-lime-400 font-mono">Niveles</h3>
        </div>
        <p className="text-gray-300 font-mono mb-6 leading-relaxed">
          Configurar niveles de dificultad y progresión del juego
        </p>
        <button 
          onClick={() => openModal('manage-levels')}
          className="w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-black font-bold py-3 px-4 rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
        >
          Gestionar Niveles
        </button>
      </div>

      <div className="group bg-gradient-to-br from-violet-800/30 to-fuchsia-800/30 rounded-xl p-6 border border-violet-400/30 hover:border-violet-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-violet-400/20">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-bold text-violet-400 font-mono">Ejercicios</h3>
        </div>
        <p className="text-gray-300 font-mono mb-6 leading-relaxed">
          Crear y editar ejercicios académicos y preguntas educativas
        </p>
        <button 
          onClick={() => openModal('manage-exercises')}
          className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold py-3 px-4 rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
        >
          Gestionar Ejercicios
        </button>
      </div>
    </div>
  </div>
);

// Modal Content Components

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

  // Actualizar el estado del formulario cuando cambien los datos del usuario
  useEffect(() => {
    if (userData && isEdit) {
      console.log('🔄 CreateUserForm - Actualizando datos del formulario:', userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: '', // No cargar la contraseña por seguridad
        role: userData.role || 'estudiante',
        age: userData.age || '',
        grade: userData.grade || ''
      });
    }
  }, [userData, isEdit]);

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


// Level Management Panel Component
const LevelManagementPanel = ({ onClose }) => {
  const levels = [
    { name: 'Principiante', difficulty: 'Fácil', users: 234 },
    { name: 'Intermedio', difficulty: 'Medio', users: 156 },
    { name: 'Avanzado', difficulty: 'Difícil', users: 89 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-lime-400 font-mono">
          📈 Niveles de Dificultad
        </h3>
        <button className="px-4 py-2 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-black font-bold rounded-lg font-mono transition-all duration-300">
          + Nuevo Nivel
        </button>
      </div>

      <div className="grid gap-4">
        {levels.map((level, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-lime-400/20">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-lime-400 font-mono">{level.name}</h4>
                <p className="text-gray-300 font-mono text-sm">
                  Dificultad: {level.difficulty} • {level.users} usuarios
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-lime-400 hover:text-lime-300 transition-colors duration-200">
                  ✏️
                </button>
                <button className="text-red-400 hover:text-red-300 transition-colors duration-200">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exercise Management Panel Component
const ExerciseManagementPanel = ({ onClose }) => {
  const exercises = [
    { id: 1, type: 'Suma', difficulty: 'Fácil', planet: 'Tierra' },
    { id: 2, type: 'Resta', difficulty: 'Medio', planet: 'Marte' },
    { id: 3, type: 'Multiplicación', difficulty: 'Difícil', planet: 'Júpiter' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-violet-400 font-mono">
          🧮 Ejercicios Matemáticos
        </h3>
        <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold rounded-lg font-mono transition-all duration-300">
          + Nuevo Ejercicio
        </button>
      </div>

      <div className="grid gap-4">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-violet-400/20">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-violet-400 font-mono">
                  Ejercicio #{exercise.id} - {exercise.type}
                </h4>
                <p className="text-gray-300 font-mono text-sm">
                  Dificultad: {exercise.difficulty} • Planeta: {exercise.planet}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-violet-400 hover:text-violet-300 transition-colors duration-200">
                  ✏️
                </button>
                <button className="text-red-400 hover:text-red-300 transition-colors duration-200">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Create Content Form Component
const CreateContentForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'document',
    category: '',
    description: '',
    file: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creando contenido:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-blue-400 font-mono mb-2">
          Título del Contenido
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full px-3 py-2 bg-gray-800/50 border border-blue-400/30 rounded-lg text-white font-mono focus:border-blue-400 focus:outline-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-blue-400 font-mono mb-2">
            Tipo
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800/50 border border-blue-400/30 rounded-lg text-white font-mono focus:border-blue-400 focus:outline-none"
          >
            <option value="document">Documento</option>
            <option value="video">Video</option>
            <option value="image">Imagen</option>
            <option value="interactive">Interactivo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-400 font-mono mb-2">
            Categoría
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800/50 border border-blue-400/30 rounded-lg text-white font-mono focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-400 font-mono mb-2">
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 bg-gray-800/50 border border-blue-400/30 rounded-lg text-white font-mono focus:border-blue-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-400 font-mono mb-2">
          Archivo
        </label>
        <input
          type="file"
          onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
          className="w-full px-3 py-2 bg-gray-800/50 border border-blue-400/30 rounded-lg text-white font-mono focus:border-blue-400 focus:outline-none"
        />
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
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
        >
          Crear Contenido
        </button>
      </div>
    </form>
  );
};

// System Info Panel Component
const SystemInfoPanel = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-pink-400/20">
          <h4 className="text-lg font-bold text-pink-400 font-mono mb-2">Sistema</h4>
          <p className="text-gray-300 font-mono text-sm">Versión: 1.0.0</p>
          <p className="text-gray-300 font-mono text-sm">Última actualización: Hoy</p>
        </div>
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-pink-400/20">
          <h4 className="text-lg font-bold text-pink-400 font-mono mb-2">Base de Datos</h4>
          <p className="text-gray-300 font-mono text-sm">Estado: Conectado</p>
          <p className="text-gray-300 font-mono text-sm">Tamaño: 2.4 GB</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-pink-400/20">
        <h3 className="text-xl font-bold text-pink-400 font-mono mb-4">
          🚀 Estado del Sistema
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-mono">Servidor Web</span>
            <span className="text-emerald-400 font-mono font-bold">✅ Activo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-mono">API Backend</span>
            <span className="text-emerald-400 font-mono font-bold">✅ Activo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-mono">Base de Datos</span>
            <span className="text-emerald-400 font-mono font-bold">✅ Activo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-mono">Almacenamiento</span>
            <span className="text-yellow-400 font-mono font-bold">⚠️ 75% Usado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
