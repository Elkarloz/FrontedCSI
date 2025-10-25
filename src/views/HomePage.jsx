/**
 * HomePage - Página principal con el diseño original
 * Mantiene el diseño cyberpunk y la funcionalidad original
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Starfield from '../components/Starfield.jsx';
import { Button } from '../components/ui';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Efectos de sonido y animaciones como en el original
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        navigate('/auth');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Starfield />

      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 scanlines">
        {/* Logo/Title */}
        <div className="mb-12">
          <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl mb-4 neon-text text-[#00f0ff] leading-tight">
            MISIÓN
          </h1>
          <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl mb-6 neon-text text-[#ff00ff] leading-tight">
            ESPACIAL
          </h1>
          <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-[#00ff88] to-transparent glow-border" />
        </div>

        {/* Subtitle */}
        <p className="font-sans text-lg md:text-xl text-[#00ff88] mb-12 max-w-2xl mx-auto leading-relaxed">
          {"> "} Aprende y domina el cálculo integral paso a paso {"<"}
        </p>

        {/* Floating decoration */}
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#b000ff] to-[#ff00ff] opacity-20 blur-3xl float-animation" />
        <div
          className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#00ff88] opacity-20 blur-3xl float-animation"
          style={{ animationDelay: "1s" }}
        />

        {/* Start button */}
        <Button
          variant="primary"
          size="xl"
          onClick={() => navigate('/auth')}
          className="neon-button"
        >
          COMENZAR APRENDIZAJE
        </Button>

      
      </div>
    </main>
  );
};

export default HomePage;
