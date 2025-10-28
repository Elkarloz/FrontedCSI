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
    const planetOrder = planet.orderIndex || (index + 1);
    
    // Usar el índice del array en lugar del orderIndex para posicionamiento
    // Esto evita problemas cuando los orderIndex no son consecutivos
    const planetIndex = index; // Usar índice del array (0, 1, 2, ...)
    
    
    // Calcular posiciones de manera robusta para evitar superposiciones
    const calculatePlanetPosition = (totalPlanets, planetIndex) => {
      const planetSize = 70; // Tamaño máximo del planeta en px
      const minDistance = 120; // Distancia mínima entre planetas en px
      const containerWidth = 800; // Ancho del contenedor en px
      const containerHeight = 600; // Alto del contenedor en px
      
      let position;
      
      if (totalPlanets === 1) {
        position = { x: containerWidth / 2, y: containerHeight / 2 };
      } else if (totalPlanets === 2) {
        // Dos planetas en línea horizontal con separación garantizada
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const separation = Math.max(minDistance, containerWidth * 0.35);
        position = planetIndex === 0 
          ? { x: centerX - separation / 2, y: centerY }
          : { x: centerX + separation / 2, y: centerY };
          
      } else if (totalPlanets === 3) {
        // Tres planetas en triángulo con separación garantizada
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const radius = Math.max(minDistance / 2, containerWidth * 0.22);
        const angle = (planetIndex / totalPlanets) * 2 * Math.PI - Math.PI / 2;
        
        position = {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        };
        
      } else {
        // Para más de 3 planetas, usar distribución circular
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const radius = Math.max(minDistance / 2, containerWidth * 0.28);
        const angle = (planetIndex / totalPlanets) * 2 * Math.PI - Math.PI / 2;
        
        position = {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        };
        
      }
      
      // Convertir a porcentajes y asegurar límites
      const x = Math.max(15, Math.min(85, (position.x / containerWidth) * 100));
      const y = Math.max(15, Math.min(85, (position.y / containerHeight) * 100));
      
      
      return { x, y };
    };
    
    const position = calculatePlanetPosition(totalPlanets, planetIndex);
    
    
    return {
      id: planet.id,
      name: planet.title || planet.name || `Planeta ${planetOrder}`,
      x: position.x,
      y: position.y,
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
