/**
 * StudentGame - Vista de juego espacial para estudiantes
 * Permite a los estudiantes navegar por planetas con animaciones
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameSpaceMap from '../../components/GameSpaceMap';
import PlanetNavigation from '../../components/PlanetNavigation';
import { planetService } from '../../services/planetService';
import { levelService } from '../../services/levelService';
import { useToast } from '../../components/Toast';

const StudentGame = () => {
  const navigate = useNavigate();
  const [planets, setPlanets] = useState([]);
  const [levels, setLevels] = useState([]);
  const [currentPlanetId, setCurrentPlanetId] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    loadGameData();
  }, []);

  // Debug: Monitorear cambios en selectedPlanet
  useEffect(() => {
    console.log('🔄 selectedPlanet cambió:', selectedPlanet);
  }, [selectedPlanet]);

  const loadGameData = async () => {
    try {
      console.log('🚀 Cargando datos del juego...');
      setIsLoading(true);
      setError(null);

      // Cargar planetas y niveles en paralelo
      const [planetsResult, levelsResult] = await Promise.all([
        planetService.getAllPlanets(),
        levelService.getAllLevels()
      ]);

      if (planetsResult.success) {
        setPlanets(planetsResult.data || []);
        console.log('✅ Planetas cargados:', planetsResult.data?.length || 0);
        
        // Establecer el primer planeta como actual si hay planetas
        if (planetsResult.data?.length > 0) {
          setCurrentPlanetId(planetsResult.data[0].id);
        }
      } else {
        setError(planetsResult.message);
        showError(planetsResult.message, 'Error al cargar planetas');
      }

      if (levelsResult.success) {
        setLevels(levelsResult.data || []);
        console.log('✅ Niveles cargados:', levelsResult.data?.length || 0);
      } else {
        console.warn('⚠️ No se pudieron cargar los niveles:', levelsResult.message);
      }

    } catch (error) {
      console.error('💥 Error cargando datos del juego:', error);
      setError('Error al cargar datos del juego');
      showError('Error al cargar datos del juego', 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanetSelect = (planet) => {
    console.log('🪐 Planeta seleccionado:', planet);
    console.log('🪐 Estableciendo selectedPlanet:', planet);
    setSelectedPlanet(planet);
    console.log('🪐 selectedPlanet actualizado');
  };

  const handlePlanetChange = (planetId) => {
    console.log('🔄 Cambiando a planeta:', planetId);
    setCurrentPlanetId(planetId);
    
    // No establecer selectedPlanet aquí para evitar loop infinito
    // El selectedPlanet se maneja solo en handlePlanetSelect
  };

  const handleEnterPlanet = () => {
    if (selectedPlanet) {
      console.log('🚀 Entrando al planeta:', selectedPlanet);
      
      // Navegar a la vista de niveles del planeta
      navigate(`/student/planets/${selectedPlanet.id}/levels`);
    } else {
      console.warn('⚠️ No hay planeta seleccionado');
      showError('Por favor selecciona un planeta primero', 'Planeta no seleccionado');
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white font-mono text-lg">Cargando universo espacial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white font-mono mb-2">Error</h2>
          <p className="text-gray-300 font-mono">{error}</p>
          <button 
            onClick={loadGameData}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-mono transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Mapa espacial principal */}
      <GameSpaceMap
        planets={planets}
        onPlanetSelect={handlePlanetSelect}
        currentPlanetId={currentPlanetId}
      />

      {/* Navegación entre planetas */}
      {planets.length > 1 && (
        <PlanetNavigation
          currentPlanetId={currentPlanetId}
          planets={planets}
          onPlanetChange={handlePlanetChange}
          isVisible={true}
        />
      )}

      {/* Panel de información del planeta seleccionado */}
      {selectedPlanet && (
        <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/50">
          <h3 className="text-white font-mono text-lg font-bold mb-2">
            🪐 {selectedPlanet.name}
          </h3>
          <p className="text-gray-300 font-mono text-sm mb-3">
            {selectedPlanet.description || 'Explora este planeta y descubre sus secretos.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleEnterPlanet}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded text-sm font-mono transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🚀 Entrar al Planeta
            </button>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-mono transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Contador de planetas */}
      <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-purple-500/50">
        <div className="text-white font-mono text-sm">
          <div className="flex items-center gap-2">
            <span>🪐</span>
            <span>{planets.length} Planetas</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span>📚</span>
            <span>{levels.length} Niveles</span>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-purple-500/50">
        <div className="text-white font-mono text-xs">
          <p>🖱️ Haz clic en un planeta para explorarlo</p>
          <p>⌨️ Usa los botones de navegación para moverte</p>
        </div>
      </div>
    </div>
  );
};

export default StudentGame;