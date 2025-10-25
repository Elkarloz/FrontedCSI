/**
 * SpaceMapView - Vista del mapa espacial educativo
 * Migrado desde educational-space-map.tsx a la nueva arquitectura MVC
 * Responsabilidades:
 * - Mostrar el mapa espacial con planetas
 * - Manejar interacciones del usuario
 * - Coordinar con controladores para la lógica de negocio
 */

import React, { useState, useEffect, useRef } from 'react';
import { planetController } from '../controllers/planetController.js';
import { exerciseController } from '../controllers/exerciseController.js';

const SpaceMapView = ({ onPlanetClick, onLevelClick, currentLevel, userProgress }) => {
  const [planets, setPlanets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showPlanetDetails, setShowPlanetDetails] = useState(false);
  const [showLevelExercises, setShowLevelExercises] = useState(false);

  // Cargar planetas al montar el componente
  useEffect(() => {
    loadPlanets();
  }, []);

  /**
   * Carga los planetas usando el controlador
   */
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

  /**
   * Maneja el clic en un planeta
   * @param {Object} planet - Planeta seleccionado
   */
  const handlePlanetClick = async (planet) => {
    try {
      setSelectedPlanet(planet);
      setShowPlanetDetails(true);
      
      if (onPlanetClick) {
        onPlanetClick(planet);
      }
    } catch (error) {
      console.error('Error al manejar clic en planeta:', error);
    }
  };

  /**
   * Maneja el clic en un nivel
   * @param {Object} level - Nivel seleccionado
   */
  const handleLevelClick = async (level) => {
    try {
      setSelectedLevel(level);
      setShowLevelExercises(true);
      
      if (onLevelClick) {
        onLevelClick(level);
      }
    } catch (error) {
      console.error('Error al manejar clic en nivel:', error);
    }
  };

  /**
   * Cierra el modal de detalles del planeta
   */
  const closePlanetDetails = () => {
    setShowPlanetDetails(false);
    setSelectedPlanet(null);
  };

  /**
   * Cierra el modal de ejercicios del nivel
   */
  const closeLevelExercises = () => {
    setShowLevelExercises(false);
    setSelectedLevel(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-cyan-400 text-lg">Cargando mapa espacial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">Error: {error}</p>
          <button
            onClick={loadPlanets}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Fondo de estrellas */}
      <div className="absolute inset-0">
        <div className="starfield"></div>
      </div>

      {/* Título */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">
          Misión Espacial
        </h1>
        <p className="text-gray-300">
          Sistema educativo de cálculo integral
        </p>
      </div>

      {/* Botón de regreso */}
      <div className="absolute top-8 right-8 z-10">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
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
    </div>
  );
};

/**
 * Componente de planeta individual
 */
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
        className={`w-${getPlanetSize()} h-${getPlanetSize()} rounded-full bg-gradient-to-br ${getPlanetColor()} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative group`}
      >
        {/* Contenido del planeta */}
        <div className="text-white font-bold text-sm text-center">
          {planet.name}
        </div>

        {/* Indicador de estado */}
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

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {planet.name}
            <br />
            {planet.totalLevels} niveles
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Modal de detalles del planeta
 */
const PlanetDetailsModal = ({ planet, onClose, onLevelClick }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">{planet.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-300 mb-4">{planet.description}</p>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Niveles:</h3>
          {planet.levels?.map((level) => (
            <div
              key={level.id}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => onLevelClick(level)}
            >
              <div>
                <span className="text-white font-medium">{level.name}</span>
                <p className="text-gray-400 text-sm">{level.description}</p>
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

/**
 * Modal de ejercicios del nivel
 */
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">{level.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-300 mb-4">{level.description}</p>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 mt-2">Cargando ejercicios...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Ejercicios:</h3>
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => {
                  // Navegar al ejercicio
                  window.location.href = `/quiz/${level.id}/${exercise.id}`;
                }}
              >
                <div>
                  <span className="text-white font-medium">{exercise.question}</span>
                  <p className="text-gray-400 text-sm">
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

export default SpaceMapView;
