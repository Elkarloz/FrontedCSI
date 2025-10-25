/**
 * StudentDashboard - Dashboard principal para estudiantes
 * Muestra las opciones disponibles para estudiantes
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const studentOptions = [
    { 
      id: 'contents', 
      label: 'Ver Contenidos', 
      description: 'Explorar materiales educativos disponibles', 
      color: 'emerald',
      icon: '📚',
      path: '/student/contents'
    },
    { 
      id: 'profile', 
      label: 'Gestionar Mi Perfil', 
      description: 'Actualizar información personal y configuración', 
      color: 'blue',
      icon: '👤',
      path: '/student/profile'
    },
    { 
      id: 'game', 
      label: 'Entrar al Juego', 
      description: 'Iniciar aventura espacial y resolver ejercicios', 
      color: 'orange',
      icon: '🚀',
      path: '/student/game'
    }
  ];

  const handleOptionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white font-mono mb-4">
            ¡Bienvenido al Sistema Espacial!
          </h2>
          <p className="text-gray-400 font-mono text-lg">
            Selecciona una opción para comenzar tu aventura
          </p>
        </div>

        {/* Student Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {studentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.path)}
              className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 rounded-xl p-8 border border-gray-600 hover:border-gray-500 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-center">
                <div className={`w-20 h-20 bg-${option.color}-500/20 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-4xl">
                    {option.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white font-mono">{option.label}</h3>
                <p className="text-gray-400 font-mono mt-2">
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white font-mono mb-4">
              🌟 Tu Aventura Espacial
            </h3>
            <p className="text-gray-300 font-mono text-lg mb-4">
              Explora planetas, resuelve ejercicios y avanza en tu misión espacial
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📖</div>
                <p className="text-gray-300 font-mono text-sm">Estudia contenidos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <p className="text-gray-300 font-mono text-sm">Resuelve ejercicios</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-gray-300 font-mono text-sm">Gana recompensas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
