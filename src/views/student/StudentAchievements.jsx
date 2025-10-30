/**
 * StudentAchievements - Vista de logros del estudiante
 * Muestra todos los logros disponibles y los logros obtenidos por el estudiante
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { achievementService } from '../../services/achievementService.js';

const StudentAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadAchievements();
    }
  }, [user?.id]);

  const loadAchievements = async () => {
    try {
      setIsLoading(true);
      
      // Cargar todos los logros disponibles
      const allResult = await achievementService.getAllAchievements();
      if (allResult.success) {
        setAllAchievements(Array.isArray(allResult.data) ? allResult.data : []);
      }
      
      // Cargar logros del usuario si tenemos el ID
      if (user?.id) {
        const userResult = await achievementService.getUserAchievements(user.id);
        if (userResult.success) {
          setAchievements(Array.isArray(userResult.data) ? userResult.data : []);
        }
      }
    } catch (error) {
      console.error('Error cargando logros:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (achievement) => {
    if (achievement?.icon) return achievement.icon;
    const iconMap = {
      'LEVEL_COMPLETED': '🎯',
      'PERFECT_LEVEL': '⭐',
      'PLANET_COMPLETED': '🌍'
    };
    return iconMap[achievement?.code] || '🏆';
  };

  const getBorderColor = (code, isUnlocked) => {
    if (!isUnlocked) return 'border-gray-600/30';
    const colorMap = {
      'LEVEL_COMPLETED': 'border-blue-400/30',
      'PERFECT_LEVEL': 'border-yellow-400/30',
      'PLANET_COMPLETED': 'border-purple-400/30'
    };
    return colorMap[code] || 'border-pink-400/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" style={{ padding: '20px' }}>
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white font-mono mb-6">🏆 Mis Logros</h1>
        
        {/* Summary */}
        <div className="mb-8">
          <div className="bg-gray-800/70 border border-cyan-400/30 rounded-xl p-4 inline-block">
            <div className="text-cyan-300 font-mono text-sm">Progreso de Logros</div>
            <div className="text-white font-mono text-2xl mt-1">{achievements.length} de {allAchievements.length}</div>
          </div>
        </div>

        {/* Achievements Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
              <p className="text-gray-300 font-mono">Cargando logros...</p>
            </div>
          </div>
        ) : allAchievements.length === 0 ? (
          <div className="bg-gray-800/70 border border-gray-600 rounded-xl p-8 text-center mb-8">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-2xl font-mono text-white mb-2">No hay logros disponibles</h2>
          </div>
        ) : (
          <>
            {/* Logros genéricos */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white font-mono mb-4">📋 Logros Generales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
                {allAchievements.map((achievement) => {
                  const userAchievementsOfType = achievements.filter(
                    (ua) => ua.achievement_id === achievement.id || ua.code === achievement.code
                  );
                  const isUnlocked = userAchievementsOfType.length > 0;
                  const count = userAchievementsOfType.length;
                  const awardedAt = userAchievementsOfType[0]?.awarded_at;
                  
                  return (
                    <div 
                      key={`generic-${achievement.id}`} 
                      className={`bg-gray-800/70 border rounded-xl p-5 ${getBorderColor(achievement.code, isUnlocked)} ${!isUnlocked ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start mb-3">
                        <div className={`text-4xl mr-3 ${!isUnlocked ? 'grayscale' : ''}`}>
                          {getIcon(achievement)}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl text-white font-mono mb-1">
                            {count > 1 ? `${achievement.name} (${count}x)` : achievement.name}
                          </h2>
                          {isUnlocked && (
                            <span className="text-green-400 text-sm font-mono">✓ Desbloqueado</span>
                          )}
                          {!isUnlocked && (
                            <span className="text-gray-500 text-sm font-mono">🔒 Bloqueado</span>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-300 font-mono text-sm mb-4">
                        <div>{achievement.description || 'Sin descripción'}</div>
                        {isUnlocked && awardedAt && (
                          <div className="mt-2 text-gray-400 text-xs">
                            Obtenido: {new Date(awardedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      {isUnlocked && achievement?.points && (
                        <div className="mt-2">
                          <span className="inline-block bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 px-3 py-1 rounded text-sm font-mono border border-yellow-500/30">
                            +{achievement.points} pts
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Logros específicos desbloqueados */}
            {achievements.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white font-mono mb-4">🎯 Logros Específicos Obtenidos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
                  {achievements.map((userAchievement) => {
                    const achievement = allAchievements.find(
                      (a) => a.id === userAchievement.achievement_id || a.code === userAchievement.code
                    );
                    if (!achievement) return null;
                    
                    const displayName = userAchievement.level_title 
                      ? `${achievement.name} - ${userAchievement.level_title}`
                      : userAchievement.planet_title
                      ? `${achievement.name} - ${userAchievement.planet_title}`
                      : achievement.name;
                    
                    return (
                      <div 
                        key={`specific-${userAchievement.id}`} 
                        className={`bg-gray-800/70 border rounded-xl p-5 ${getBorderColor(achievement.code, true)}`}
                      >
                        <div className="flex items-start mb-3">
                          <div className="text-4xl mr-3">
                            {getIcon(achievement)}
                          </div>
                          <div className="flex-1">
                            <h2 className="text-xl text-white font-mono mb-1">{displayName}</h2>
                            <span className="text-green-400 text-sm font-mono">✓ Desbloqueado</span>
                          </div>
                        </div>
                        <div className="text-gray-300 font-mono text-sm mb-4">
                          <div>{achievement.description || 'Sin descripción'}</div>
                          {userAchievement.level_title && (
                            <div className="mt-2 text-cyan-300">📚 {userAchievement.level_title}</div>
                          )}
                          {userAchievement.planet_title && (
                            <div className="mt-1 text-purple-300">🌍 {userAchievement.planet_title}</div>
                          )}
                          {userAchievement.awarded_at && (
                            <div className="mt-2 text-gray-400 text-xs">
                              Obtenido: {new Date(userAchievement.awarded_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        {achievement?.points && (
                          <div className="mt-2">
                            <span className="inline-block bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 px-3 py-1 rounded text-sm font-mono border border-yellow-500/30">
                              +{achievement.points} pts
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentAchievements;

