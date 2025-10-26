/**
 * SpaceMapPage - Página del mapa espacial con el diseño original
 * Mantiene el diseño cyberpunk y la funcionalidad original
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Starfield from '../components/Starfield.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { planetController } from '../controllers/planetController.js';
import { exerciseController } from '../controllers/exerciseController.js';
import { userController } from '../controllers/userController.js';

const SpaceMapPage = () => {
  const navigate = useNavigate();
  const [planets, setPlanets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showPlanetDetails, setShowPlanetDetails] = useState(false);
  const [showLevelExercises, setShowLevelExercises] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadPlanets();
    loadCurrentUser();
  }, []);

  const loadPlanets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await planetController.getAllPlanets();
      
      if (result.success) {
        setPlanets(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error al cargar planetas');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      console.log('👤 Cargando usuario actual...');
      const result = await userController.getCurrentUser();
      console.log('👤 Resultado getCurrentUser:', result);
      
      if (result.success) {
        console.log('✅ Usuario cargado exitosamente:', result.data);
        const user = result.data.data.user;
        setCurrentUser(user);
        
        // Redirigir según el rol del usuario
        if (user.role === 'estudiante') {
          console.log('👤 Usuario es estudiante, redirigiendo a /student');
          navigate('/student');
          return;
        } else if (user.role === 'admin') {
          console.log('👑 Usuario es admin, redirigiendo a /admin');
          navigate('/admin');
          return;
        }
      } else {
        console.log('❌ Error al cargar usuario:', result.message);
        // Si no hay usuario autenticado, redirigir al login
        navigate('/auth');
        return;
      }
    } catch (error) {
      console.error('💥 Error inesperado al cargar usuario actual:', error);
      navigate('/auth');
      return;
    }
  };

  const handlePlanetClick = async (planet) => {
    try {
      setSelectedPlanet(planet);
      setShowPlanetDetails(true);
    } catch (error) {
      console.error('Error al manejar clic en planeta:', error);
    }
  };

  const handleLevelClick = async (level) => {
    try {
      setSelectedLevel(level);
      setShowLevelExercises(true);
    } catch (error) {
      console.error('Error al manejar clic en nivel:', error);
    }
  };

  const closePlanetDetails = () => {
    setShowPlanetDetails(false);
    setSelectedPlanet(null);
  };

  const closeLevelExercises = () => {
    setShowLevelExercises(false);
    setSelectedLevel(null);
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Starfield />
        <div className="relative z-10">
          <LoadingSpinner 
            message="Cargando mapa espacial..."
            size="large"
            type="spinner"
          />
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
            onClick={loadPlanets}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded font-mono"
          >
            Reintentar
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
        <h1 className="text-4xl font-bold text-cyan-400 mb-2 font-mono">
          MAPA ESPACIAL
        </h1>
        <p className="text-gray-300 font-mono">
          Sistema educativo de cálculo integral
        </p>
        {currentUser && (
          <p className="text-gray-400 font-mono text-sm mt-1">
            Bienvenido, {currentUser.name}
          </p>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="absolute top-8 right-8 z-10 flex space-x-2">
        {/* Admin button - only show for admin users */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-lg flex items-center space-x-2 font-mono transition-all duration-300 border border-purple-500/50"
          >
            <span>⚙️</span>
            <span>Admin</span>
          </button>
        )}
        
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-mono transition-all duration-300"
        >
          <span>←</span>
          <span>Regresar</span>
        </button>
      </div>

      {/* Mapa de planetas */}
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="space-map-container">
          {planets.map((planet) => (
            <PlanetComponent
              key={planet.id}
              planet={planet}
              onClick={() => handlePlanetClick(planet)}
              isSelected={selectedPlanet?.id === planet.id}
            />
          ))}
        </div>
      </div>

      {/* Modal de detalles del planeta */}
      {showPlanetDetails && selectedPlanet && (
        <PlanetDetailsModal
          planet={selectedPlanet}
          onClose={closePlanetDetails}
          onLevelClick={handleLevelClick}
        />
      )}

      {/* Modal de ejercicios del nivel */}
      {showLevelExercises && selectedLevel && (
        <LevelExercisesModal
          level={selectedLevel}
          onClose={closeLevelExercises}
        />
      )}
    </main>
  );
};

const PlanetComponent = ({ planet, onClick, isSelected }) => {
  const getPlanetStatus = () => {
    if (planet.isCompleted) return 'completed';
    if (planet.isUnlocked) return 'available';
    return 'locked';
  };

  const getPlanetColor = () => {
    const status = getPlanetStatus();
    switch (status) {
      case 'completed':
        return 'from-green-400 to-green-600';
      case 'available':
        return planet.color || 'from-blue-400 to-blue-600';
      case 'locked':
        return 'from-gray-400 to-gray-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getPlanetSize = () => {
    const baseSize = planet.size || 60;
    return isSelected ? baseSize * 1.2 : baseSize;
  };

  return (
    <div
      className={`absolute planet-component cursor-pointer transition-all duration-300 ${
        isSelected ? 'z-20' : 'z-10'
      }`}
      style={{
        left: `${planet.position.x}%`,
        top: `${planet.position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={onClick}
    >
      <div
        className={`w-${getPlanetSize()} h-${getPlanetSize()} rounded-full bg-gradient-to-br ${getPlanetColor()} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative group neon-glow`}
      >
        <div className="text-white font-bold text-sm text-center font-mono">
          {planet.name}
        </div>

        <div className="absolute -top-2 -right-2">
          {getPlanetStatus() === 'completed' && (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
          {getPlanetStatus() === 'locked' && (
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🔒</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-gray-800/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap font-mono">
            {planet.name}
            <br />
            {planet.totalLevels} niveles
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanetDetailsModal = ({ planet, onClose, onLevelClick }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900/95 rounded-lg p-6 max-w-md w-full mx-4 border border-cyan-400/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-400 font-mono">{planet.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-300 mb-4 font-mono">{planet.description}</p>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white font-mono">Niveles:</h3>
          {planet.levels?.map((level) => (
            <div
              key={level.id}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors border border-gray-600/30"
              onClick={() => onLevelClick(level)}
            >
              <div>
                <span className="text-white font-medium font-mono">{level.name}</span>
                <p className="text-gray-400 text-sm font-mono">{level.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {level.isCompleted && (
                  <span className="text-green-400">✓</span>
                )}
                {!level.isUnlocked && (
                  <span className="text-gray-400">🔒</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LevelExercisesModal = ({ level, onClose }) => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, [level.id]);

  const loadExercises = async () => {
    try {
      setIsLoading(true);
      const result = await exerciseController.getExercisesByLevel(level.id);
      
      if (result.success) {
        setExercises(result.data);
      }
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900/95 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto border border-cyan-400/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-400 font-mono">{level.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-300 mb-4 font-mono">{level.description}</p>
        
        {isLoading ? (
          <div className="text-center py-8">
            <LoadingSpinner 
              message="Cargando ejercicios..."
              size="medium"
              type="dots"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white font-mono">Ejercicios:</h3>
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors border border-gray-600/30"
                onClick={() => {
                  window.location.href = `/quiz/${level.id}/${exercise.id}`;
                }}
              >
                <div>
                  <span className="text-white font-medium font-mono">{exercise.question}</span>
                  <p className="text-gray-400 text-sm font-mono">
                    {exercise.type} • {exercise.points} puntos
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {exercise.isCompleted && (
                    <span className="text-green-400">✓</span>
                  )}
                  <span className="text-gray-400">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceMapPage;
