/**
 * QuizViewSimple - Versión simplificada para debug
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const QuizViewSimple = () => {
  const { levelId, exerciseId } = useParams();
  const navigate = useNavigate();
  
  console.log('🎯 QuizViewSimple - Componente cargado con params:', { levelId, exerciseId });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-pink-400 font-mono mb-4">
            QuizView Cargado
          </h1>
          <p className="text-gray-300 font-mono mb-6">
            LevelId: {levelId} | ExerciseId: {exerciseId}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg font-mono transition-all duration-300"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizViewSimple;
