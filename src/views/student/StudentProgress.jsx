import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { progressService } from '../../services/progressService.js';
import { levelService } from '../../services/levelService.js';
import { planetService } from '../../services/planetService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const StudentProgress = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({ totalPlanets: 0, totalLevels: 0, completedLevels: 0, overallPercent: 0 });

  useEffect(() => {
    if (!authLoading && user) {
      loadProgress();
    }
  }, [authLoading, user]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const [res, levelsRes, planetsRes] = await Promise.all([
        progressService.getUserProgress(user.id),
        levelService.getAllLevels({ includeInactive: false }),
        planetService.getAllPlanets()
      ]);

      if (!res.success) {
        setError(res.message || 'Error loading progress');
      }
      setSummary(res.data || []);

      const allLevels = Array.isArray(levelsRes?.data) ? levelsRes.data : [];
      const allPlanets = Array.isArray(planetsRes?.data) ? planetsRes.data : [];

      const totalLevels = allLevels.length;
      const totalPlanets = allPlanets.length;
      const completedLevels = (res.data || []).filter(l => l.isCompleted || (l.completionPercentage || 0) >= 100).length;
      const overallPercent = totalLevels > 0
        ? Math.round(((res.data || []).reduce((acc, l) => acc + (Number(l.completionPercentage) || 0), 0)) / totalLevels)
        : 0;
      setTotals({ totalPlanets, totalLevels, completedLevels, overallPercent });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner message="Cargando progreso..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg mb-6 font-mono">
          <div className="flex items-center">
            <span className="text-xl mr-3">⚠️</span>
            <span className="font-bold">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" style={{ padding: '20px' }}>
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white font-mono mb-6">Tu Progreso</h1>

        {/* Summary header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" style={{ marginBottom: '24px' }}>
          <div className="bg-gray-800/70 border border-cyan-400/30 rounded-xl p-4 text-center">
            <div className="text-cyan-300 font-mono text-sm">Planetas Totales</div>
            <div className="text-white font-mono text-2xl mt-1">{totals.totalPlanets}</div>
          </div>
          <div className="bg-gray-800/70 border border-green-400/30 rounded-xl p-4 text-center">
            <div className="text-green-300 font-mono text-sm">Niveles Totales</div>
            <div className="text-white font-mono text-2xl mt-1">{totals.totalLevels}</div>
          </div>
          <div className="bg-gray-800/70 border border-pink-400/30 rounded-xl p-4 text-center">
            <div className="text-pink-300 font-mono text-sm">Niveles Completados</div>
            <div className="text-white font-mono text-2xl mt-1">{totals.completedLevels}</div>
          </div>
          <div className="bg-gray-800/70 border border-yellow-400/30 rounded-xl p-4 text-center">
            <div className="text-yellow-300 font-mono text-sm">Progreso Global</div>
            <div className="text-white font-mono text-2xl mt-1">{totals.overallPercent}%</div>
          </div>
        </div>

        {/* Empty state */}
        {(!summary || summary.length === 0) && (
          <div className="bg-gray-800/70 border border-gray-600 rounded-xl p-8 text-center mb-8">
            <div className="text-5xl mb-3">🛰️</div>
            <h2 className="text-2xl font-mono text-white mb-2">Aún no tienes progreso registrado</h2>
            <p className="text-gray-300 font-mono mb-4">Empieza tu misión espacial entrando al juego y resolviendo tu primer ejercicio.</p>
            <a href="/student/game" className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-mono px-6 py-3 rounded-lg border border-pink-400/50 transition-all">Ir a Entrar al Juego →</a>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
          {(summary || []).map((item) => (
            <div key={`${item.levelId}`} className="bg-gray-800/70 border border-pink-400/30 rounded-xl p-5">
              <div className="text-gray-300 font-mono text-sm mb-2">{item.planetTitle}</div>
              <h2 className="text-xl text-white font-mono mb-2">{item.levelTitle || `Nivel ${item.levelNumber}`}</h2>
              <div className="text-gray-300 font-mono text-sm mb-4">
                <div>Completado: {Math.round(item.completionPercentage || 0)}%</div>
                <div>Ejercicios: {item.totalExercises || 0}</div>
                <div>Aciertos: {item.completedExercises || 0} · Errores: {Math.max(0, (item.wrongAnswers ?? ((item.totalExercises||0)-(item.completedExercises||0))))}</div>
                <div>Puntuación: {item.score || 0}</div>
                <div>Tiempo: {Math.round((item.timeSpent || 0) / 60)} min</div>
              </div>
              {/* Circular progress chart de aciertos */}
              <div className="flex flex-col items-center mb-4">
                {(() => {
                  const total = (item.totalExercises || 0);
                  const correct = (item.completedExercises || 0);
                  const wrong = Math.max(0, total - correct);
                  const correctPct = total > 0 ? Math.round((correct / total) * 100) : 0;
                  const radius = 50;
                  const circumference = 2 * Math.PI * radius;
                  const offset = circumference - (correctPct / 100) * circumference;
                  
                  return (
                    <div className="flex items-center space-x-6 w-full">
                      {/* Circular Progress */}
                      <div className="relative flex-shrink-0">
                        <svg className="transform -rotate-90" width="120" height="120">
                          {/* Background circle */}
                          <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="#374151"
                            strokeWidth="10"
                            fill="transparent"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke={correctPct >= 70 ? "#22c55e" : correctPct >= 50 ? "#eab308" : "#ef4444"}
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                        </svg>
                        {/* Percentage text in center */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold font-mono text-white">{correctPct}%</div>
                            <div className="text-xs font-mono text-gray-400">Aciertos</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="flex-1 text-sm font-mono text-gray-300 space-y-2">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                          <span>{correct} Aciertos</span>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 rounded-full mr-2 bg-red-500"></span>
                          <span>{wrong} Errores</span>
                        </div>
                        <div className="flex items-center pt-1 border-t border-gray-600">
                          <span className="inline-block w-3 h-3 rounded-full mr-2 bg-gray-500"></span>
                          <span>{total} Total</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-pink-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, Math.round(item.completionPercentage || 0))}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;


