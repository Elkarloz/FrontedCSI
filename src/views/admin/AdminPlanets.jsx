/**
 * AdminPlanets - Página específica para gestión de planetas
 * Ruta: /admin/game/planets
 */

import React from 'react';
import PlanetList from '../../components/PlanetList.jsx';

const AdminPlanets = () => {
  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <PlanetList />
      </div>
    </div>
  );
};

export default AdminPlanets;
