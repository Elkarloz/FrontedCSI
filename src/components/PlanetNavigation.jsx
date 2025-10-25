import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import anime from 'animejs/lib/anime.es.js';

const PlanetNavigation = ({ 
  currentPlanetId, 
  planets, 
  onPlanetChange,
  isVisible = true 
}) => {
  const navigationRef = useRef(null);
  const pathRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      animatePath();
      animateCurrentPlanet();
    }
  }, [currentPlanetId, isVisible]);

  const animatePath = () => {
    if (!pathRef.current) return;
    console.log('🛤️ Animando camino de puntos con CSS...');
  };

  const animateCurrentPlanet = () => {
    const currentPlanet = document.querySelector(`[data-planet-id="${currentPlanetId}"]`);
    if (currentPlanet) {
      // Agregar clase CSS para animar el planeta actual
      currentPlanet.classList.add('current-planet');
      
      // Animación del anillo del planeta actual
      const ring = currentPlanet.querySelector('.planet-ring');
      if (ring) {
        ring.classList.add('current-ring');
      }
    }
  };

  const handlePlanetClick = (planetId) => {
    if (planetId === currentPlanetId) return;

    // Animación de transición con CSS
    const currentPlanet = document.querySelector(`[data-planet-id="${currentPlanetId}"]`);
    const targetPlanet = document.querySelector(`[data-planet-id="${planetId}"]`);

    if (currentPlanet && targetPlanet) {
      // Animación de salida del planeta actual
      currentPlanet.classList.add('planet-exit');
      
      setTimeout(() => {
        // Animación de entrada al nuevo planeta
        targetPlanet.classList.add('planet-enter');
        
        setTimeout(() => {
          if (onPlanetChange) {
            onPlanetChange(planetId);
          }
        }, 500);
      }, 300);
    }
  };

  /**
   * Maneja el clic en un planeta para navegar a sus niveles
   * @param {string} planetId - ID del planeta
   */
  const handlePlanetLevelsClick = (planetId) => {
    console.log('🪐 PlanetNavigation.handlePlanetLevelsClick() - Navegando a niveles del planeta:', planetId);
    navigate(`/student/planets/${planetId}/levels`);
  };

  if (!isVisible) return null;

  return (
    <div className="planet-navigation" ref={navigationRef}>
      {/* Camino de puntos */}
      <svg className="planet-path" ref={pathRef}>
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8"/>
          </linearGradient>
        </defs>
        
        {/* Línea de conexión entre planetas */}
        <path
          d="M 10 50 Q 20 30 30 40 Q 40 50 50 45 Q 60 40 70 50 Q 80 60 90 55"
          stroke="url(#pathGradient)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
          className="connection-line"
        />
        
        {/* Puntos del camino */}
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x, index) => (
          <circle
            key={index}
            cx={x}
            cy="50"
            r="4"
            fill="#8b5cf6"
            className="path-dot"
            style={{ opacity: 0 }}
          />
        ))}
      </svg>

      {/* Botones de navegación */}
      <div className="navigation-controls">
        <button 
          className="nav-btn prev-btn"
          onClick={() => {
            const currentIndex = planets.findIndex(p => p.id === currentPlanetId);
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : planets.length - 1;
            handlePlanetClick(planets[prevIndex].id);
          }}
        >
          ← Anterior
        </button>
        
        <button 
          className="nav-btn next-btn"
          onClick={() => {
            const currentIndex = planets.findIndex(p => p.id === currentPlanetId);
            const nextIndex = currentIndex < planets.length - 1 ? currentIndex + 1 : 0;
            handlePlanetClick(planets[nextIndex].id);
          }}
        >
          Siguiente →
        </button>
      </div>

      {/* Indicador de progreso */}
      <div className="progress-indicator">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${((planets.findIndex(p => p.id === currentPlanetId) + 1) / planets.length) * 100}%` 
            }}
          />
        </div>
        <span className="progress-text">
          {planets.findIndex(p => p.id === currentPlanetId) + 1} / {planets.length}
        </span>
      </div>
    </div>
  );
};

export default PlanetNavigation;
