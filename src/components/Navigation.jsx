/**
 * Navigation - Componente de navegación principal
 * Proporciona navegación consistente en toda la aplicación
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userController } from '../controllers/userController.js';
import { Button } from './ui';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await userController.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await userController.logout();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const canAccessRoute = (path) => {
    if (path === '/admin') {
      return user?.role === 'admin';
    }
    return true;
  };

  if (isLoading) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm shadow-lg border-b border-cyan-400/20" style={{zIndex: 9999}}>
      {/* Icono fijo en la parte superior */}
      <div className="absolute top-2 left-4 z-10">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
      
      {/* Texto de debug del menú */}
      <div className="absolute top-2 right-4 z-10">
        <span className="text-xs text-cyan-400 font-mono">MENU ACTIVO</span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-2xl font-bold text-cyan-400 font-mono hover:text-green-400 transition-colors duration-300 border-0 focus:outline-none"
            >
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L19 7L13.09 15.74L12 22L10.91 15.74L5 17L10.91 8.26L12 2Z"/>
              </svg>
              <span className="hidden sm:block">MISIÓN ESPACIAL</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink
                to="/"
                label="Inicio"
                icon="🏠"
                isActive={isActiveRoute('/')}
                onClick={() => setIsMenuOpen(false)}
              />
              
              {user ? (
                <>
                  <NavLink
                    to="/space-map"
                    label="Mapa Espacial"
                    icon="🌌"
                    isActive={isActiveRoute('/space-map')}
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <NavLink
                    to="/student/progress"
                    label="Progreso"
                    icon="📈"
                    isActive={isActiveRoute('/student/progress')}
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <NavLink
                    to="/profile"
                    label="Perfil"
                    icon="👤"
                    isActive={isActiveRoute('/profile')}
                    onClick={() => setIsMenuOpen(false)}
                  />
                  {user.role === 'admin' && (
                    <NavLink
                      to="/admin"
                      label="Admin"
                      icon="⚙️"
                      isActive={isActiveRoute('/admin')}
                      onClick={() => setIsMenuOpen(false)}
                    />
                  )}
                </>
              ) : (
                <NavLink
                  to="/auth"
                  label="Iniciar Sesión"
                  icon="🔐"
                  isActive={isActiveRoute('/auth')}
                  onClick={() => setIsMenuOpen(false)}
                />
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 font-mono text-sm">
                  {user.name}
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleLogout}
                >
                  🚪 Salir
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/auth')}
              >
                🔐 Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-cyan-400 hover:text-green-400 focus:outline-none focus:text-green-400 p-2 rounded-lg transition-all duration-300 border-0"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-black/98 shadow-xl">
            <MobileNavLink
              to="/"
              label="Inicio"
              icon="🏠"
              isActive={isActiveRoute('/')}
              onClick={() => setIsMenuOpen(false)}
            />
            
            {user ? (
              <>
                <MobileNavLink
                  to="/space-map"
                  label="Mapa Espacial"
                  icon="🌌"
                  isActive={isActiveRoute('/space-map')}
                  onClick={() => setIsMenuOpen(false)}
                />
                  <MobileNavLink
                    to="/student/progress"
                    label="Progreso"
                    icon="📈"
                    isActive={isActiveRoute('/student/progress')}
                    onClick={() => setIsMenuOpen(false)}
                  />
                <MobileNavLink
                  to="/profile"
                  label="Perfil"
                  icon="👤"
                  isActive={isActiveRoute('/profile')}
                  onClick={() => setIsMenuOpen(false)}
                />
                {user.role === 'admin' && (
                  <MobileNavLink
                    to="/admin"
                    label="Administración"
                    icon="⚙️"
                    isActive={isActiveRoute('/admin')}
                    onClick={() => setIsMenuOpen(false)}
                  />
                )}
                <div className="border-t border-gray-600 pt-4">
                  <div className="px-3 py-2">
                    <p className="text-gray-300 font-mono text-sm">
                      👤 {user.name}
                    </p>
                    <p className="text-gray-400 font-mono text-xs">
                      📧 {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-400 hover:text-red-300 font-mono transition-colors duration-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg border-0 focus:outline-none"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <MobileNavLink
                to="/auth"
                label="Iniciar Sesión"
                icon="🔐"
                isActive={isActiveRoute('/auth')}
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ to, label, icon, isActive, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
    onClick();
  };

  return (
    <Button
      variant={isActive ? 'primary' : 'ghost'}
      size="sm"
      onClick={handleClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Button>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ to, label, icon, isActive, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
    onClick();
  };

  return (
    <Button
      variant={isActive ? 'primary' : 'ghost'}
      size="md"
      onClick={handleClick}
      className="block w-full text-left"
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Button>
  );
};

export default Navigation;