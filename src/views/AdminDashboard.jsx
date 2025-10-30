/**
 * AdminDashboard - Dashboard principal del panel de administración
 * Muestra las opciones principales de administración
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const categories = [
    { 
      id: 'users', 
      label: 'Administrar Usuarios', 
      description: 'Gestionar usuarios del sistema', 
      color: 'pink',
      icon: '👥',
      path: '/admin/users'
    },
    { 
      id: 'content', 
      label: 'Gestionar Contenidos', 
      description: 'Administrar materiales educativos', 
      color: 'emerald',
      icon: '📚',
      path: '/admin/contents'
    },
    { 
      id: 'game', 
      label: 'Gestionar Juego', 
      description: 'Configurar planetas, niveles y ejercicios', 
      color: 'orange',
      icon: '🚀',
      path: '/admin/game'
    },
    { 
      id: 'reports', 
      label: 'Ver Reportes', 
      description: 'Progreso general y por estudiante', 
      color: 'cyan',
      icon: '📊',
      path: '/admin/reports'
    }
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white font-mono mb-4">
            ¡Bienvenido al Panel de Administración!
          </h2>
          <p className="text-gray-400 font-mono text-lg">
            Gestiona el sistema educativo espacial desde aquí
          </p>
        </div>

        {/* Main Categories Grid */}
        <div className="grid grid-cols-2 gap-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.path)}
              className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 rounded-xl p-8 border border-gray-600 hover:border-gray-500 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-center">
                <div className={`w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  category.color === 'pink' ? 'bg-pink-500/20' :
                  category.color === 'emerald' ? 'bg-emerald-500/20' :
                  category.color === 'orange' ? 'bg-orange-500/20' :
                  category.color === 'cyan' ? 'bg-cyan-500/20' : 'bg-gray-500/20'
                }`}>
                  <span className="text-4xl">
                    {category.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white font-mono">{category.label}</h3>
                <p className="text-gray-400 font-mono mt-2">
                  {category.description}
                </p>
              </div>
            </button>
          ))}
        </div>

     
      </div>
    </div>
  );
};

export default AdminDashboard;
