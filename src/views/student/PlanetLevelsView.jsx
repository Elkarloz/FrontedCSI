/**
 * PlanetLevelsView - Vista para mostrar los niveles de un planeta específico
 * Responsabilidades:
 * - Mostrar información del planeta seleccionado
 * - Listar todos los niveles del planeta
 * - Permitir navegación entre niveles
 * - Mostrar progreso del estudiante
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { levelController } from '../../controllers/levelController.js';
import { planetController } from '../../controllers/planetController.js';
import { levelService } from '../../services/levelService.js';
import { useToast } from '../../components/Toast.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import bgmSrc from '../../utils/1.mp3';

const PlanetLevelsView = () => {
  const { planetId } = useParams();
  const navigate = useNavigate();
  const [planet, setPlanet] = useState(null);
  const [levels, setLevels] = useState([]);
  const [currentLevelId, setCurrentLevelId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useToast();
  const audioRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (planetId) {
      loadPlanetAndLevels();
    }
  }, [planetId]);

  // Iniciar música de fondo al entrar a planetas (con fallback por gesto de usuario)
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(bgmSrc);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
    }

    const tryStart = async () => {
      if (startedRef.current) return;
      try {
        await audioRef.current.play();
        startedRef.current = true;
      } catch (e) {
        // Autoplay bloqueado: esperar primer interacción
      }
    };

    tryStart();

    const onFirstInteract = () => {
      if (!startedRef.current && audioRef.current) {
        audioRef.current.play().catch(() => {});
        startedRef.current = true;
      }
      window.removeEventListener('click', onFirstInteract);
      window.removeEventListener('keydown', onFirstInteract);
      window.removeEventListener('touchstart', onFirstInteract);
    };
    window.addEventListener('click', onFirstInteract);
    window.addEventListener('keydown', onFirstInteract);
    window.addEventListener('touchstart', onFirstInteract, { passive: true });

    return () => {
      window.removeEventListener('click', onFirstInteract);
      window.removeEventListener('keydown', onFirstInteract);
      window.removeEventListener('touchstart', onFirstInteract);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      startedRef.current = false;
    };
  }, []);

  /**
   * Carga la información del planeta y sus niveles
   */
  const loadPlanetAndLevels = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Cargar información del planeta
      const planetResult = await planetController.getPlanetById(planetId);
      if (planetResult.success) {
        setPlanet(planetResult.data);
      } else {
        // Si no se puede cargar el planeta, usar datos por defecto
        setPlanet({
          id: planetId,
          title: 'Planeta Espacial',
          description: 'Explora este planeta y descubre sus secretos',
          orderIndex: 1
        });
      }

      // Cargar niveles con información de desbloqueo
      const levelsResult = await levelService.getLevelsWithUnlockStatus({ planetId });
      if (levelsResult.success) {
        setLevels(levelsResult.data.levels || []);
        setCurrentLevelId(levelsResult.data.currentLevelId || null);
      } else {
        throw new Error(levelsResult.message);
      }
    } catch (error) {
      const errorMessage = 'Error al cargar información del planeta: ' + error.message;
      setError(errorMessage);
      showError(errorMessage, 'Error de carga');
    }

    setIsLoading(false);
  };

  /**
   * Navega a un nivel específico - va directamente al primer ejercicio
   * @param {string} levelId - ID del nivel
   * @param {boolean} isUnlocked - Si el nivel está desbloqueado
   */
  const handleLevelClick = async (levelId, isUnlocked) => {
    // No permitir acceso a niveles bloqueados
    if (!isUnlocked) {
      showError('Este nivel está bloqueado. Completa el nivel anterior para desbloquearlo.', 'Nivel bloqueado');
      return;
    }
    
    try {
      // Cargar ejercicios del nivel para obtener el primer ejercicio
      const { exerciseController } = await import('../../controllers/exerciseController.js');
      const result = await exerciseController.getExercisesByLevel(levelId);
      
      if (result.success && result.data.length > 0) {
        const firstExercise = result.data[0];
        // Navegar directamente al primer ejercicio del quiz
        navigate(`/quiz/${levelId}/${firstExercise.id}`);
      } else {
        // Si no hay ejercicios, informar al usuario
        showError('Este nivel aún no tiene ejercicios disponibles', 'Sin ejercicios');
      }
    } catch (error) {
      showError('No se pudieron cargar los ejercicios del nivel', 'Error de carga');
    }
  };

  /**
   * Regresa a la vista de planetas
   */
  const handleBackToPlanets = () => {
    navigate('/student/game');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner message="Cargando niveles del planeta..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg mb-6 font-mono">
          <div className="flex items-center">
            <span className="text-xl mr-3">⚠️</span>
            <span className="font-bold">{error}</span>
          </div>
        </div>
        <button
          onClick={handleBackToPlanets}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg font-mono transition-all duration-300"
        >
          ← Volver a Planetas
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header con información del planeta */}
      <div className="mb-8">
        <button
          onClick={handleBackToPlanets}
          className="mb-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg font-mono transition-all duration-300"
        >
          ← Volver al Mapa Espacial
        </button>

        <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 p-8">
          <div className="flex items-center mb-4">
            <div className="text-6xl mr-4">🪐</div>
            <div>
              <h1 className="text-4xl font-bold text-pink-400 font-mono mb-2">
                {planet?.title || planet?.name || 'Planeta Espacial'}
              </h1>
              <p className="text-gray-400 font-mono text-lg">
                {planet?.description || 'Explora este planeta y descubre sus secretos'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm font-mono">
            <div className="flex items-center">
              <span className="text-cyan-400 mr-2">📈</span>
              <span className="text-gray-300">{levels.length} Niveles</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">🎯</span>
              <span className="text-gray-300">Orden: {planet?.orderIndex || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de niveles */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-pink-400 font-mono mb-6">
          📚 Niveles Disponibles
        </h2>

        {levels.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 p-12">
              <div className="text-6xl mb-4">🚫</div>
              <h3 className="text-2xl font-bold text-white font-mono mb-2">
                Este planeta no tiene niveles
              </h3>
              <p className="text-gray-400 font-mono text-lg mb-6">
                Este planeta aún no tiene niveles configurados. 
                <br />
                Prueba con otro planeta o contacta al administrador.
              </p>
              <button
                onClick={handleBackToPlanets}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg font-mono transition-all duration-300 transform hover:scale-105"
              >
                🚀 Volver al Mapa Espacial
              </button>
            </div>
          </div>
        ) : (
          <div className="relative min-h-screen overflow-hidden">
            {/* Fondo espacial */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
              <div className="absolute inset-0 opacity-20">
                <div className="starfield"></div>
              </div>
            </div>

            {/* Contenedor de niveles como planetas */}
            <div className="relative z-10 flex items-center justify-center p-8">
              {/* Fijar altura explícita para que los porcentajes de top funcionen */}
              <div className="levels-container relative w-full max-w-6xl mx-auto" style={{ height: '700px' }}>
                {levels.map((level, index) => {
                  // Calcular posición como en el mapa espacial
                  const angle = (index / levels.length) * 2 * Math.PI;
                  const radius = Math.min(200, 300 - (levels.length * 20));
                  const x = 50 + (Math.cos(angle) * radius) / 10;
                  const y = 50 + (Math.sin(angle) * radius) / 10;
                  
                  const isUnlocked = level.isUnlocked !== false;
                  const isLocked = level.isLocked === true;
                  const isCurrent = level.isCurrent === true;
                  
                  return (
                    <div
                      key={level.id}
                      className={`level-wrapper absolute transition-all duration-300 ${isUnlocked ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-60'}`}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => handleLevelClick(level.id, isUnlocked)}
                    >
                      {/* Nave espacial sobre el nivel actual */}
                      {isCurrent && (
                        <div 
                          className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce z-20"
                          style={{ animationDuration: '2s' }}
                        >
                          🚀
                        </div>
                      )}

                      {/* Planeta del nivel */}
                      <div 
                        className={`level relative rounded-full flex items-center justify-center text-white font-mono font-bold text-lg shadow-lg transition-all duration-300 ${isUnlocked ? 'hover:shadow-2xl' : ''}`}
                        style={{
                          width: '80px',
                          height: '80px',
                          background: isLocked 
                            ? `radial-gradient(circle at 30% 30%, #4b5563, #374151, #1f2937)`
                            : `radial-gradient(circle at 30% 30%, #8b5cf6, #3b82f6, #1e40af)`,
                          boxShadow: isLocked
                            ? `
                              inset -10px -10px 20px rgba(0, 0, 0, 0.5),
                              inset 10px 10px 20px rgba(255, 255, 255, 0.05),
                              0 0 20px rgba(75, 85, 99, 0.3)
                            `
                            : `
                              inset -10px -10px 20px rgba(0, 0, 0, 0.3),
                              inset 10px 10px 20px rgba(255, 255, 255, 0.1),
                              0 0 20px rgba(139, 92, 246, 0.4)
                            `
                        }}
                      >
                        {isLocked ? '🔒' : '📈'}
                      </div>

                      {/* Anillo del nivel */}
                      <div 
                        className={`level-ring absolute top-[-15px] left-[-15px] right-[-15px] bottom-[-15px] border-2 rounded-full transition-all duration-300 ${isLocked ? 'border-gray-500 opacity-40' : 'border-cyan-400 opacity-60'}`}
                      ></div>

                      {/* Número del nivel */}
                      <div 
                        className={`level-number absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isLocked ? 'bg-gray-800 text-gray-400 border-gray-600' : 'bg-black text-white border-white'}`}
                      >
                        {level.orderIndex || index + 1}
                      </div>

                      {/* Estrellas de progreso (solo para niveles desbloqueados) */}
                      {isUnlocked && (
                        <div className="progress-stars absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {[1, 2, 3].map((star) => (
                            <span key={star} className="star text-yellow-400 text-xs">★</span>
                          ))}
                        </div>
                      )}

                      {/* Indicador de bloqueado */}
                      {isLocked && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono whitespace-nowrap">
                          Bloqueado
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instrucciones */}
            <div className="absolute bottom-4 left-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-purple-500/50">
              <div className="text-white font-mono text-xs">
                <p>🖱️ Haz clic en un nivel para explorarlo</p>
                <p>📈 Cada nivel contiene ejercicios únicos</p>
              </div>
            </div>

            {/* Contador de niveles */}
            <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-purple-500/50">
              <div className="text-white font-mono text-sm">
                <div className="flex items-center gap-2">
                  <span>📈</span>
                  <span>{levels.length} Niveles</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default PlanetLevelsView;