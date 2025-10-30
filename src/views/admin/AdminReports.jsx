/**
 * AdminReports - Componente para visualizar reportes de progreso
 * Muestra reportes generales y por estudiante de forma breve
 */

import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('general'); // 'general' o 'students'
  const [generalReport, setGeneralReport] = useState(null);
  const [studentsReport, setStudentsReport] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGeneralReport();
  }, []);

  const loadGeneralReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await reportService.getGeneralReport();
      
      if (response.success) {
        setGeneralReport(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error al cargar reporte general');
      console.error('Error loading general report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudentsReport = async () => {
    if (studentsReport) return; // Ya está cargado
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await reportService.getStudentsReport();
      
      if (response.success) {
        setStudentsReport(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error al cargar reporte de estudiantes');
      console.error('Error loading students report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudentDetail = async (userId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await reportService.getStudentReport(userId);
      
      if (response.success) {
        setSelectedStudent(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error al cargar detalles del estudiante');
      console.error('Error loading student detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedStudent(null);
    
    if (tab === 'students' && !studentsReport) {
      loadStudentsReport();
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0 min';
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}min`;
    }
    return `${minutes}min`;
  };

  if (isLoading && !generalReport && !studentsReport) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !generalReport && !studentsReport) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 font-mono text-lg">{error}</p>
        <button
          onClick={() => {
            if (activeTab === 'general') {
              loadGeneralReport();
            } else {
              loadStudentsReport();
            }
          }}
          className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded font-mono"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white font-mono mb-4">
            📊 Reportes de Progreso
          </h1>
          <p className="text-gray-400 font-mono">
            Visualización breve de estadísticas generales y por estudiante
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-600">
          <button
            onClick={() => handleTabChange('general')}
            className={`px-6 py-3 font-mono font-bold transition-all duration-300 ${
              activeTab === 'general'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            📈 General
          </button>
          <button
            onClick={() => handleTabChange('students')}
            className={`px-6 py-3 font-mono font-bold transition-all duration-300 ${
              activeTab === 'students'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            👥 Por Estudiante
          </button>
        </div>

        {/* General Report */}
        {activeTab === 'general' && generalReport && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-pink-800/30 to-rose-800/30 rounded-xl p-4 border border-pink-400/30">
                <div className="text-pink-400 font-mono text-sm mb-1">Total Usuarios</div>
                <div className="text-3xl font-bold text-white font-mono">
                  {generalReport.overview.totalUsers}
                </div>
                <div className="text-gray-400 font-mono text-xs mt-1">
                  {generalReport.overview.totalStudents} estudiantes
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-800/30 to-teal-800/30 rounded-xl p-4 border border-cyan-400/30">
                <div className="text-cyan-400 font-mono text-sm mb-1">Activos</div>
                <div className="text-3xl font-bold text-white font-mono">
                  {generalReport.overview.activeStudents}
                </div>
                <div className="text-gray-400 font-mono text-xs mt-1">
                  estudiantes activos
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-800/30 to-green-800/30 rounded-xl p-4 border border-emerald-400/30">
                <div className="text-emerald-400 font-mono text-sm mb-1">Niveles</div>
                <div className="text-3xl font-bold text-white font-mono">
                  {generalReport.overview.totalLevels}
                </div>
                <div className="text-gray-400 font-mono text-xs mt-1">
                  {generalReport.overview.totalPlanets} planetas
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/30 to-violet-800/30 rounded-xl p-4 border border-purple-400/30">
                <div className="text-purple-400 font-mono text-sm mb-1">Progreso Promedio</div>
                <div className="text-3xl font-bold text-white font-mono">
                  {generalReport.averages.avgCompletion}%
                </div>
                <div className="text-gray-400 font-mono text-xs mt-1">
                  {generalReport.averages.completedLevels} completados
                </div>
              </div>
            </div>

            {/* Top Students */}
            {generalReport.topStudents && generalReport.topStudents.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl p-6 border border-pink-400/30">
                <h2 className="text-2xl font-bold text-white font-mono mb-4">
                  🏆 Top 5 Estudiantes
                </h2>
                <div className="space-y-3">
                  {generalReport.topStudents.map((student, index) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center font-bold text-black font-mono">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-mono font-bold">{student.name}</div>
                          <div className="text-gray-400 font-mono text-sm">{student.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-mono font-bold">
                          {student.totalScore} pts
                        </div>
                        <div className="text-gray-400 font-mono text-xs">
                          {student.completedLevels} niveles
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Planet Distribution */}
            {generalReport.planetDistribution && generalReport.planetDistribution.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/95 to-blue-900/95 rounded-xl p-6 border border-cyan-400/30">
                <h2 className="text-2xl font-bold text-white font-mono mb-4">
                  🪐 Distribución por Planetas
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {generalReport.planetDistribution.map((planet) => (
                    <div
                      key={planet.id}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="text-white font-mono font-bold mb-2">{planet.title}</div>
                      <div className="text-cyan-400 font-mono">
                        {planet.studentsCount} estudiantes
                      </div>
                      <div className="text-gray-400 font-mono text-sm">
                        {planet.completedLevels} niveles completados
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Students Report */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {isLoading && !studentsReport ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : error && !studentsReport ? (
              <div className="text-center py-12">
                <p className="text-red-400 font-mono">{error}</p>
                <button
                  onClick={loadStudentsReport}
                  className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded font-mono"
                >
                  Reintentar
                </button>
              </div>
            ) : studentsReport ? (
              <>
                {selectedStudent ? (
                  // Student Detail View
                  <div className="space-y-6">
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-2"
                    >
                      <span>←</span>
                      <span>Volver a lista</span>
                    </button>

                    <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl p-6 border border-pink-400/30">
                      <h2 className="text-2xl font-bold text-white font-mono mb-4">
                        👤 {selectedStudent.student.name}
                      </h2>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                          <div className="text-gray-400 font-mono text-sm">Niveles Iniciados</div>
                          <div className="text-2xl font-bold text-white font-mono">
                            {selectedStudent.stats.levelsStarted}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                          <div className="text-gray-400 font-mono text-sm">Niveles Completados</div>
                          <div className="text-2xl font-bold text-emerald-400 font-mono">
                            {selectedStudent.stats.levelsCompleted}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                          <div className="text-gray-400 font-mono text-sm">Puntaje Total</div>
                          <div className="text-2xl font-bold text-cyan-400 font-mono">
                            {selectedStudent.stats.totalScore}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                          <div className="text-gray-400 font-mono text-sm">Progreso Promedio</div>
                          <div className="text-2xl font-bold text-purple-400 font-mono">
                            {selectedStudent.stats.avgCompletion}%
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                          <div className="text-gray-400 font-mono text-sm">Tiempo Total</div>
                          <div className="text-2xl font-bold text-yellow-400 font-mono">
                            {formatTime(selectedStudent.stats.totalTimeSpent)}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                          <div className="text-gray-400 font-mono text-sm">Planetas Visitados</div>
                          <div className="text-2xl font-bold text-pink-400 font-mono">
                            {selectedStudent.stats.planetsAccessed}
                          </div>
                        </div>
                      </div>

                      {/* Level Progress */}
                      {selectedStudent.levelProgress && selectedStudent.levelProgress.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-white font-mono mb-4">
                            Progreso por Nivel
                          </h3>
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {selectedStudent.levelProgress.map((progress) => (
                              <div
                                key={progress.id}
                                className="bg-gray-800/50 rounded-lg p-4 border border-gray-600"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-white font-mono font-bold">
                                      {progress.planetTitle} - {progress.levelTitle}
                                    </div>
                                    <div className="text-gray-400 font-mono text-sm">
                                      Nivel {progress.levelNumber}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className={`font-mono font-bold ${
                                      progress.isCompleted ? 'text-emerald-400' : 'text-yellow-400'
                                    }`}>
                                      {progress.completionPercentage}%
                                    </div>
                                    {progress.isCompleted && (
                                      <div className="text-gray-400 font-mono text-xs">
                                        ✓ Completado
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Students List View
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-900/95 to-blue-900/95 rounded-xl p-6 border border-cyan-400/30">
                      <h2 className="text-2xl font-bold text-white font-mono mb-4">
                        📋 Lista de Estudiantes ({studentsReport.totalStudents})
                      </h2>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {studentsReport.students.map((student) => (
                          <div
                            key={student.id}
                            className="bg-gray-800/50 rounded-lg p-4 border border-gray-600 hover:border-cyan-400/50 transition-all cursor-pointer"
                            onClick={() => loadStudentDetail(student.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-mono font-bold">{student.name}</div>
                                <div className="text-gray-400 font-mono text-sm">{student.email}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-cyan-400 font-mono font-bold">
                                  {student.summary.totalScore} pts
                                </div>
                                <div className="text-gray-400 font-mono text-xs">
                                  {student.summary.levelsCompleted}/{student.summary.levelsStarted} niveles
                                </div>
                                <div className="text-gray-400 font-mono text-xs">
                                  {student.summary.avgCompletion}% promedio
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;

