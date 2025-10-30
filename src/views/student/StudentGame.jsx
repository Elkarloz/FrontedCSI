/**
 * StudentGame - Vista de juego espacial para estudiantes
 * Permite a los estudiantes navegar por planetas con animaciones
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GameSpaceMap from '../../components/GameSpaceMap';
import PlanetNavigation from '../../components/PlanetNavigation';
import { planetService } from '../../services/planetService';
import { levelService } from '../../services/levelService';
import { useToast } from '../../components/Toast';
import bgmSrc from '../../utils/1.mp3';

const StudentGame = () => {
  const navigate = useNavigate();
  const [planets, setPlanets] = useState([]);
  const [levels, setLevels] = useState([]);
  const [currentPlanetId, setCurrentPlanetId] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError, showSuccess } = useToast();
  const audioRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    loadGameData();
  }, []);

  // Música de fondo desde la vista de juego (planetas)
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
      } catch (e) {}
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

  // Monitorear cambios en selectedPlanet (sin logs de depuración)
  useEffect(() => {
  }, [selectedPlanet]);

  const loadGameData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Cargar planetas y niveles en paralelo
      const [planetsResult, levelsResult] = await Promise.all([
        planetService.getAllPlanets(),
        levelService.getAllLevels()
      ]);

      if (planetsResult.success) {
        setPlanets(planetsResult.data || []);
        
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
      } else {
      }

    } catch (error) {
      setError('Error al cargar datos del juego');
      showError('Error al cargar datos del juego', 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanetSelect = (planet) => {
    setSelectedPlanet(planet);
  };

  const handlePlanetChange = (planetId) => {
    setCurrentPlanetId(planetId);
    
    // No establecer selectedPlanet aquí para evitar loop infinito
    // El selectedPlanet se maneja solo en handlePlanetSelect
  };

  const handleEnterPlanet = () => {
    if (selectedPlanet) {
      
      // Navegar a la vista de niveles del planeta
      navigate(`/student/planets/${selectedPlanet.id}/levels`);
    } else {
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