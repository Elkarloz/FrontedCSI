/**
 * AdminLevels - Página específica para gestión de niveles
 * Ruta: /admin/game/levels
 */

import React from 'react';
import LevelList from '../../components/LevelList.jsx';

const AdminLevels = () => {
  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <LevelList />
      </div>
    </div>
  );
};

export default AdminLevels;
