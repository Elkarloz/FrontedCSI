/**
 * AdminGame - Página de administración del juego espacial
 * Maneja la gestión de planetas, niveles y ejercicios
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminGame = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'planets',
      title: 'Planetas',
      description: 'Crear y configurar planetas del sistema solar educativo',
      icon: '🪐',
      color: 'cyan',
      path: '/admin/game/planets'
    },
    {
      id: 'levels',
      title: 'Niveles',
      description: 'Configurar niveles de dificultad y progresión del juego',
      icon: '📈',
      color: 'lime',
      path: '/admin/game/levels'
    },
    {
      id: 'exercises',
      title: 'Ejercicios',
      description: 'Crear y editar ejercicios académicos y preguntas educativas',
      icon: '📚',
      color: 'violet',
      path: '/admin/game/exercises'
    }
  ];

  const handleSectionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
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
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.path)}
                className={`group bg-gradient-to-br from-${section.color}-800/30 to-${section.color}-900/30 rounded-xl p-6 border border-${section.color}-400/30 hover:border-${section.color}-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-${section.color}-400/20 text-left`}
              >
                <div className="text-center">
                  <div className={`w-20 h-20 bg-${section.color}-500/20 rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <span className="text-4xl">{section.icon}</span>
                  </div>
                  <h3 className={`text-3xl font-bold text-${section.color}-400 font-mono`}>{section.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGame;
