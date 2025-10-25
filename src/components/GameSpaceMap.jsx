import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import anime from 'animejs/lib/anime.es.js';
import './GameSpaceMap.css';

const GameSpaceMap = ({ planets = [], onPlanetSelect, currentPlanetId = null }) => {
  const containerRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  // Colores disponibles para asignar aleatoriamente
  const planetColors = [
    '#4ade80', '#3b82f6', '#f97316', '#ef4444', '#a855f7', 
    '#6b7280', '#eab308', '#374151', '#ec4899', '#10b981',
    '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f43f5e'
  ];

  // Función para asignar colores y posiciones a planetas reales
  const getPlanetConfig = (planet, index) => {
    const totalPlanets = planets.length;
    // Usar orderIndex del planeta (que viene de difficulty_order en la BD)
    const planetOrder = planet.orderIndex || (index + 1);
    // Ajustar el ángulo para que el planeta 1 esté en la izquierda (270°)
    const angle = ((planetOrder - 1) / totalPlanets) * 2 * Math.PI - Math.PI / 2;
    const radius = 35; // Radio del círculo de planetas
    const centerX = 50;
    const centerY = 50;
    
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    return {
      id: planet.id,
      name: planet.title || planet.name || `Planeta ${planetOrder}`,
      x: Math.max(10, Math.min(90, x)), // Limitar entre 10% y 90%
      y: Math.max(10, Math.min(90, y)), // Limitar entre 10% y 90%
      color: planetColors[(planetOrder - 1) % planetColors.length],
      size: 50 + ((planetOrder - 1) % 3) * 10, // Tamaños variados: 50, 60, 70
      level: planetOrder,
      description: planet.description || planet.title || `Descubre los secretos del ${planet.title || `Planeta ${planetOrder}`}`
    };
  };

  useEffect(() => {
    initializeAnimations();
  }, []);

  useEffect(() => {
    if (currentPlanetId) {
      highlightCurrentPlanet(currentPlanetId);
    }
  }, [currentPlanetId]);

  const initializeAnimations = () => {
    // Las animaciones se manejan con CSS
    console.log('🎬 Inicializando animaciones CSS...');
  };

  const highlightCurrentPlanet = (planetId) => {
    const planetElement = document.querySelector(`[data-planet-id="${planetId}"]`);
    if (planetElement) {
      // Agregar clase CSS para destacar el planeta
      planetElement.classList.add('planet-highlighted');
      
      // Destacar el anillo del planeta actual
      const ringElement = planetElement.querySelector('.planet-ring');
      if (ringElement) {
        ringElement.classList.add('ring-highlighted');
      }
    }
  };

  const handlePlanetClick = (planet) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSelectedPlanet(planet);

    // Animación de click con CSS
    const planetElement = document.querySelector(`[data-planet-id="${planet.id}"]`);
    if (planetElement) {
      planetElement.classList.add('planet-clicked');
      
      // Usar setTimeout para simular la animación
      setTimeout(() => {
        planetElement.classList.remove('planet-clicked');
        setIsAnimating(false);
        if (onPlanetSelect) {
          onPlanetSelect(planet);
        }
      }, 400);
    }
  };

  const handlePlanetHover = (planetId, isHovering) => {
    const planetElement = document.querySelector(`[data-planet-id="${planetId}"]`);
    if (planetElement) {
      if (isHovering) {
        planetElement.classList.add('planet-hover');
      } else {
        planetElement.classList.remove('planet-hover');
      }

      const ringElement = planetElement.querySelector('.planet-ring');
      if (ringElement) {
        if (isHovering) {
          ringElement.classList.add('ring-hover');
        } else {
          ringElement.classList.remove('ring-hover');
        }
      }
    }
  };

  /**
   * Maneja la navegación a los niveles del planeta
   */
  const handleEnterPlanet = () => {
    if (selectedPlanet) {
      console.log('🚀 GameSpaceMap - Entrando al planeta:', selectedPlanet);
      navigate(`/student/planets/${selectedPlanet.id}/levels`);
    } else {
      console.warn('⚠️ GameSpaceMap - No hay planeta seleccionado');
    }
  };

  // Ordenar planetas por orderIndex antes de renderizar
  const sortedPlanets = [...planets].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  return (
    <div className="game-space-map" ref={containerRef}>
      {/* Planetas */}
      <div className="planets-container">
        {sortedPlanets.map((planet, index) => {
          const planetConfig = getPlanetConfig(planet, index);
          return (
            <div
              key={planet.id}
              className="planet-wrapper"
              style={{
                left: `${planetConfig.x}%`,
                top: `${planetConfig.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div
                className="planet"
                data-planet-id={planet.id}
                style={{
                  width: `${planetConfig.size}px`,
                  height: `${planetConfig.size}px`,
                  backgroundColor: planetConfig.color
                }}
                onClick={() => handlePlanetClick(planetConfig)}
                onMouseEnter={() => handlePlanetHover(planet.id, true)}
                onMouseLeave={() => handlePlanetHover(planet.id, false)}
              >
                <div className="planet-ring"></div>
                <div className="planet-number">{planetConfig.level}</div>
                
                {/* Nave espacial sobre el planeta actual */}
                {planetConfig.level === 1 && (
                  <div className="planet-spaceship">
                    <div className="spaceship-icon">🚀</div>
                  </div>
                )}
                
                {/* Estrellas de progreso */}
                <div className="progress-stars">
                  {[1, 2, 3].map((star) => (
                    <div key={star} className="star">★</div>
                  ))}
                </div>
              </div>
              
              {/* Nombre del planeta */}
              <div className="planet-name">{planetConfig.name}</div>
            </div>
          );
        })}
      </div>


      {/* Información del planeta seleccionado */}
      {selectedPlanet && (
        <div className="planet-info">
          <h3>{selectedPlanet.name}</h3>
          <p>Nivel {selectedPlanet.level}</p>
          <button 
            className="enter-planet-btn"
            onClick={handleEnterPlanet}
          >
            Entrar al Planeta
          </button>
        </div>
      )}
    </div>
  );
};

export default GameSpaceMap;
