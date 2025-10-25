/**
 * App.jsx - Componente principal de la aplicación
 * Mantiene el diseño original con arquitectura MVC
 */

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ToastProvider } from './components/Toast.jsx';
import { AppRoutes } from './routes/index.jsx';

/**
 * Componente principal de la aplicación
 */
const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-black">
            <AppRoutes />
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
