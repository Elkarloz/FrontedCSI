/**
 * AdminExercises - Página específica para gestión de ejercicios
 * Ruta: /admin/game/exercises
 */

import React from 'react';
import ExerciseList from '../../components/ExerciseList.jsx';

const AdminExercises = () => {
  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <ExerciseList />
      </div>
    </div>
  );
};

export default AdminExercises;
