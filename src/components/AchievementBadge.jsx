/**
 * AchievementBadge - Componente para mostrar un logro individual
 * Responsabilidades:
 * - Mostrar información visual de un logro
 * - Mostrar estado de desbloqueado/bloqueado
 * - Aplicar estilos cyberpunk
 */

import React from 'react';

const AchievementBadge = ({ achievement, isUnlocked = false, awardedAt = null, levelTitle = null, planetTitle = null }) => {
  const getIcon = () => {
    if (achievement?.icon) return achievement.icon;
    
    // Íconos por defecto según el código
    const iconMap = {
      'LEVEL_COMPLETED': '🎯',
      'PERFECT_LEVEL': '⭐',
      'PLANET_COMPLETED': '🌍'
    };
    return iconMap[achievement?.code] || '🏆';
  };

  const getColorClass = () => {
    if (!isUnlocked) {
      return 'opacity-50 border-gray-600 bg-gray-800/30';
    }
    
    // Colores según el tipo de logro
    const colorMap = {
      'LEVEL_COMPLETED': 'border-blue-500/50 bg-blue-900/30',
      'PERFECT_LEVEL': 'border-yellow-500/50 bg-yellow-900/30',
      'PLANET_COMPLETED': 'border-purple-500/50 bg-purple-900/30'
    };
    return colorMap[achievement?.code] || 'border-pink-500/50 bg-pink-900/30';
  };

  return (
    <div
      className={`relative rounded-lg p-4 border-2 transition-all duration-300 ${getColorClass()} ${
        isUnlocked ? 'hover:scale-105 hover:shadow-lg' : ''
      }`}
      title={isUnlocked ? `Obtuviste este logro ${awardedAt ? 'el ' + new Date(awardedAt).toLocaleDateString() : ''}` : 'Logro bloqueado'}
    >
      <div className="flex items-start space-x-3">
        <div className={`text-4xl flex-shrink-0 ${!isUnlocked ? 'grayscale' : ''}`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold font-mono text-sm mb-1 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
            {achievement?.name || 'Logro Desconocido'}
          </h4>
          <p className={`text-xs font-mono ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
            {achievement?.description || 'Sin descripción'}
          </p>
          {(levelTitle || planetTitle) && isUnlocked && (
            <div className="mt-1">
              <p className={`text-xs font-mono ${isUnlocked ? 'text-gray-400' : 'text-gray-700'}`}>
                {levelTitle && `📚 ${levelTitle}`}
                {levelTitle && planetTitle && ' • '}
                {planetTitle && `🌍 ${planetTitle}`}
              </p>
            </div>
          )}
          {isUnlocked && achievement?.points && (
            <div className="mt-2">
              <span className="inline-block bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-mono border border-yellow-500/30">
                +{achievement.points} pts
              </span>
            </div>
          )}
          {!isUnlocked && (
            <div className="mt-2">
              <span className="text-xs text-gray-500 font-mono">🔒 Bloqueado</span>
            </div>
          )}
        </div>
      </div>
      
      {isUnlocked && (
        <div className="absolute top-2 right-2">
          <span className="text-green-400 text-lg">✓</span>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;

