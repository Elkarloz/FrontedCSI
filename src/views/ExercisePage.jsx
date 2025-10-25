/**
 * ExercisePage - Página de ejercicio individual
 * Muestra un ejercicio específico con su interfaz de resolución
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Starfield from '../components/Starfield.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Button } from '../components/ui';
import { exerciseController } from '../controllers/exerciseController.js';

const ExercisePage = () => {
  const { levelId, exerciseId } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExercise();
  }, [levelId, exerciseId]);

  const loadExercise = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await exerciseController.getExerciseByLevelAndId(levelId, exerciseId);
      
      if (response.success) {
        setExercise(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error al cargar el ejercicio');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    try {
      setIsSubmitting(true);
      
      const response = await exerciseController.evaluateExercise(exerciseId, {
        userAnswer: userAnswer.trim()
      });
      
      setResult(response);
    } catch (error) {
      setError('Error al evaluar el ejercicio');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextExercise = () => {
    // Navegar al siguiente ejercicio o volver al mapa
    navigate('/space-map');
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Starfield />
        <div className="relative z-10">
          <LoadingSpinner 
            message="Cargando ejercicio..."
            size="large"
            type="spinner"
          />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Starfield />
        <div className="relative z-10 text-center space-y-4">
          <p className="text-red-400 text-lg font-mono">Error: {error}</p>
          <button
            onClick={() => navigate('/space-map')}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded font-mono"
          >
            Volver al mapa
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Starfield />
      
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Header */}
      <div className="absolute top-8 left-8 z-10">
        <button
          onClick={() => navigate('/space-map')}
          className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-mono transition-all duration-300 mb-4"
        >
          <span>←</span>
          <span>Volver al mapa</span>
        </button>
        <h1 className="text-3xl font-bold text-cyan-400 font-mono">
          EJERCICIO
        </h1>
        <p className="text-gray-300 font-mono">
          Nivel {exercise?.levelNumber} • Ejercicio {exercise?.exerciseNumber}
        </p>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl w-full">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Exercise content */}
              <div className="bg-gray-900/95 rounded-lg p-8 border border-cyan-400/30">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white font-mono mb-4">
                    {exercise?.question}
                  </h2>
                  {exercise?.description && (
                    <p className="text-gray-300 font-mono mb-4">
                      {exercise.description}
                    </p>
                  )}
                  {exercise?.hint && (
                    <div className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-4 py-3 rounded-lg text-sm font-mono">
                      💡 Pista: {exercise.hint}
                    </div>
                  )}
                </div>

                {/* Answer input */}
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-cyan-400 font-mono">
                    Tu respuesta:
                  </label>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full px-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 font-mono min-h-[120px] resize-none"
                    required
                  />
                </div>

                {/* Submit button */}
                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={!userAnswer.trim()}
                    loading={isSubmitting}
                    className="font-mono"
                  >
                    {isSubmitting ? 'EVALUANDO...' : 'ENVIAR RESPUESTA'}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-gray-900/95 rounded-lg p-8 border border-cyan-400/30">
              <div className="text-center space-y-6">
                <div className={`text-6xl ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success ? '✓' : '✗'}
                </div>
                
                <div>
                  <h2 className={`text-3xl font-bold font-mono ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                    {result.success ? '¡CORRECTO!' : 'INCORRECTO'}
                  </h2>
                  <p className="text-gray-300 font-mono mt-2">
                    {result.message}
                  </p>
                </div>

                {result.explanation && (
                  <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                    <h3 className="text-lg font-semibold text-white font-mono mb-2">
                      Explicación:
                    </h3>
                    <p className="text-gray-300 font-mono">
                      {result.explanation}
                    </p>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleNextExercise}
                    className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-green-500 hover:to-cyan-500 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl font-mono"
                  >
                    CONTINUAR
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ExercisePage;
