/**
 * ExerciseList - Vista para mostrar la lista de ejercicios
 * Responsabilidades:
 * - Mostrar lista de ejercicios por nivel
 * - Manejar acciones de ejercicio (crear, editar, eliminar, resolver)
 * - Coordinar con el controlador para la lógica de negocio
 */

import React, { useState, useEffect } from 'react';
import { exerciseController } from '../controllers/exerciseController.js';
import { useToast } from './Toast.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import Modal from './Modal.jsx';
import ExerciseImage from './ExerciseImage.jsx';
import { useFileUpload } from '../hooks/useFileUpload';

const ExerciseList = ({ levelId }) => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevelId, setSelectedLevelId] = useState(levelId || null);
  const [levels, setLevels] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null
  });
  const { showSuccess, showError, showWarning } = useToast();

  // Cargar ejercicios al montar el componente o cambiar levelId
  useEffect(() => {
    if (selectedLevelId) {
      loadExercises();
    } else {
      loadAllExercises();
      loadLevels();
    }
  }, [selectedLevelId]);

  // Cargar niveles cuando no hay levelId específico
  useEffect(() => {
    if (!levelId) {
      loadLevels();
    }
  }, [levelId]);

  /**
   * Carga la lista de ejercicios usando el controlador
   */
  const loadExercises = async () => {
    if (!selectedLevelId) return;
    
    setIsLoading(true);
    setError(null);
    
    const result = await exerciseController.getExercisesByLevel(selectedLevelId);
    
    if (result.success) {
      setExercises(result.data);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  /**
   * Carga todos los ejercicios (cuando no hay levelId específico)
   */
  const loadAllExercises = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/exercises');
      
      // Verificar si la respuesta es exitosa antes de parsear JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setExercises(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('❌ Error al cargar ejercicios:', error);
      setError('Error al cargar ejercicios: ' + error.message);
    }
    
    setIsLoading(false);
  };

  /**
   * Carga la lista de niveles disponibles
   */
  const loadLevels = async () => {
    try {
      console.log('🔍 Cargando niveles...');
      const response = await fetch('/api/levels');
      
      // Verificar si la respuesta es exitosa antes de parsear JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('📊 Respuesta de niveles:', data);
      
      if (data.success) {
        setLevels(data.data);
        console.log('✅ Niveles cargados:', data.data.length);
      } else {
        console.error('❌ Error en respuesta:', data.message);
        // Usar nivel hardcodeado como fallback
        setLevels([{ id: 19, title: 'DEFINICIONES v2' }]);
      }
    } catch (error) {
      console.error('❌ Error al cargar niveles:', error);
      // Usar nivel hardcodeado como fallback
      setLevels([{ id: 19, title: 'DEFINICIONES v2' }]);
    }
  };

  /**
   * Maneja la creación de un nuevo ejercicio
   * @param {Object} exerciseData - Datos del ejercicio
   */
  const handleCreateExercise = async (exerciseData) => {
    // Separar el archivo de imagen del resto de los datos
    const { filePath, ...exerciseWithoutFile } = exerciseData;
    const imageFile = filePath instanceof File ? filePath : null;
    
    const result = await exerciseController.createExercise(exerciseWithoutFile);
    
    if (result.success) {
      // Si hay una imagen para subir, subirla ahora
      if (imageFile && result.data && result.data.id) {
        try {
          console.log('🖼️ Subiendo imagen para el ejercicio:', result.data.id);
          
          // Usar el hook importado
          const fileUploadHook = useFileUpload();
          await fileUploadHook.uploadExerciseImage(
            result.data.id,
            imageFile,
            (response) => {
              console.log('✅ Imagen subida exitosamente:', response);
            },
            (error) => {
              console.error('❌ Error al subir imagen:', error);
            }
          );
        } catch (error) {
          console.error('❌ Error al subir imagen:', error);
        }
      }
      
      setShowCreateForm(false);
      showSuccess('Ejercicio creado correctamente', 'Éxito');
      // Recargar la lista para asegurar sincronización
      if (levelId) {
        loadExercises();
      } else {
        loadAllExercises();
      }
    } else {
      setError(result.message);
    }
  };

  /**
   * Maneja la actualización de un ejercicio
   * @param {string} exerciseId - ID del ejercicio
   * @param {Object} exerciseData - Datos actualizados
   */
  const handleUpdateExercise = async (exerciseId, exerciseData) => {
    const result = await exerciseController.updateExercise(exerciseId, exerciseData);
    
    if (result.success) {
      setEditingExercise(null);
      showSuccess('Ejercicio actualizado correctamente', 'Éxito');
      // Recargar la lista para asegurar sincronización
      if (selectedLevelId) {
        loadExercises();
      } else {
        loadAllExercises();
      }
    } else {
      setError(result.message);
    }
  };

  /**
   * Maneja la eliminación de un ejercicio
   * @param {string} exerciseId - ID del ejercicio
   */
  const handleDeleteExercise = (exerciseId) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    setConfirmDialog({
      isOpen: true,
      type: 'error',
      title: 'Eliminar Ejercicio',
      message: `¿Estás seguro de que quieres eliminar el ejercicio "${exercise?.question || 'este ejercicio'}"? Esta acción no se puede deshacer.`,
      onConfirm: () => executeDeleteExercise(exerciseId)
    });
  };

  /**
   * Ejecuta la eliminación del ejercicio
   * @param {string} exerciseId - ID del ejercicio
   */
  const executeDeleteExercise = async (exerciseId) => {
    console.log('📚 ExerciseList.executeDeleteExercise() - Eliminando ejercicio:', exerciseId);
      const result = await exerciseController.deleteExercise(exerciseId);
      
      if (result.success) {
      console.log('✅ ExerciseList.executeDeleteExercise() - Ejercicio eliminado exitosamente');
        showSuccess('Ejercicio eliminado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      if (selectedLevelId) {
        await loadExercises();
      } else {
        await loadAllExercises();
      }
      } else {
      console.error('❌ ExerciseList.executeDeleteExercise() - Error al eliminar:', result.message);
        setError(result.message);
      showError(result.message, 'Error al eliminar ejercicio');
    }
  };

  /**
   * Maneja el envío de una respuesta
   * @param {string} exerciseId - ID del ejercicio
   * @param {*} answer - Respuesta del usuario
   */
  const handleSubmitAnswer = async (exerciseId, answer) => {
    const result = await exerciseController.submitAnswer(exerciseId, answer);
    
    if (result.success) {
      // Actualizar el ejercicio como completado
      setExercises(exercises.map(exercise => 
        exercise.id === exerciseId 
          ? { ...exercise, isCompleted: true, userAnswer: answer }
          : exercise
      ));
      showSuccess('Respuesta enviada correctamente', 'Éxito');
    } else {
      setError(result.message);
    }
  };

  /**
   * Filtra ejercicios por dificultad y tipo
   */
  const filteredExercises = exercises.filter(exercise => {
    const difficultyMatch = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    const typeMatch = selectedType === 'all' || exercise.type === selectedType;
    return difficultyMatch && typeMatch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-xl font-mono text-cyan-400">Cargando ejercicios...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modales fuera del contenedor principal */}
      <ExerciseForm
        isOpen={showCreateForm}
        onSubmit={handleCreateExercise}
        onCancel={() => setShowCreateForm(false)}
      />

      <ExerciseForm
        isOpen={!!editingExercise}
        exercise={editingExercise}
        onSubmit={(exerciseData) => handleUpdateExercise(editingExercise?.id, exerciseData)}
        onCancel={() => setEditingExercise(null)}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-pink-400 font-mono mb-2">
              📚 Gestión de Ejercicios
            </h1>
            <p className="text-gray-400 font-mono text-lg">
              {levelId ? 'Gestiona todos los ejercicios del nivel' : 'Gestiona todos los ejercicios del sistema'}
            </p>
          </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg font-mono transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
        >
            ➕ Crear Ejercicio
        </button>
      </div>

      {error && (
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg mb-6 font-mono">
            <div className="flex items-center">
              <span className="text-xl mr-3">⚠️</span>
              <span className="font-bold">{error}</span>
            </div>
        </div>
      )}


      {/* Filtros */}
      <div className="mb-6 flex space-x-4">
        <div>
            <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
            Filtrar por dificultad:
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
          >
            <option value="all">Todas las dificultades</option>
            <option value="easy">Fácil</option>
            <option value="medium">Medio</option>
            <option value="hard">Difícil</option>
          </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
            Filtrar por tipo:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
              className="bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
          >
            <option value="all">Todos los tipos</option>
            <option value="multiple_choice">Opción múltiple</option>
            <option value="true_false">Verdadero/Falso</option>
              <option value="numeric">Escrito numérico</option>
          </select>
        </div>
      </div>

        {/* Lista de ejercicios */}
        <div className="mx-8" style={{margin: '0px 20px', marginTop: '20px'}}>
          <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-800/50 to-pink-800/50">
                  <tr>
                    <th className="px-8 py-6 text-left text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      📝 Ejercicio
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      📝 Pregunta
                    </th>
                    <th className="px-8 py-6 text-center text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      🎯 Dificultad
                    </th>
                    <th className="px-8 py-6 text-center text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      ⚙️ Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600/30">
                  {filteredExercises.map((exercise, index) => (
                    <tr key={exercise.id} className={`hover:bg-gradient-to-r hover:from-purple-800/20 hover:to-pink-800/20 transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-900/30'}`}>
                      <td className="px-8 py-6">
                        <div>
                          <div className="text-lg font-bold text-white font-mono">
                            {exercise.type === 'multiple_choice' ? 'Opción Múltiple' : 
                             exercise.type === 'true_false' ? 'Verdadero/Falso' :
                             exercise.type === 'numeric' ? 'Escrito Numérico' : exercise.type}
                          </div>
                          <div className="text-sm text-gray-400 font-mono">
                            ID: {exercise.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-base text-gray-300 font-mono max-w-xs truncate">
                          {exercise.question || 'Sin pregunta'}
                        </div>
                        <div className="text-sm text-gray-500 font-mono mt-1">
                          {exercise.type === 'multiple_choice' && exercise.optionA && (
                            <span>A: {exercise.optionA} | B: {exercise.optionB}</span>
                          )}
                          {exercise.type === 'true_false' && (
                            <span>Verdadero/Falso</span>
                          )}
                          {exercise.type === 'numeric' && (
                            <span>Respuesta numérica</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full font-mono border ${
                          exercise.difficulty === 'easy' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/50' :
                          exercise.difficulty === 'medium' ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/50' :
                          'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/50'
                        }`}>
                          {exercise.difficulty === 'easy' ? 'Fácil' : 
                           exercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Botones de edición y eliminación */}
                          <button
                            onClick={() => setEditingExercise(exercise)}
                            className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg font-mono font-bold transition-all duration-300 border border-blue-500/50 hover:border-blue-400/70 transform hover:scale-105"
                            title="Editar ejercicio"
                          >
                            ✏️
                          </button>
                          
                          <button
                            onClick={() => handleDeleteExercise(exercise.id)}
                            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg font-mono font-bold transition-all duration-300 border border-red-500/50 hover:border-red-400/70 transform hover:scale-105"
                            title="Eliminar ejercicio"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </div>

      {filteredExercises.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 p-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-white font-mono mb-2">
                No hay ejercicios registrados
              </h3>
              <p className="text-gray-400 font-mono text-lg">
                Comienza creando el primer ejercicio del nivel
              </p>
            </div>
        </div>
      )}
    </div>
    </>
  );
};

/**
 * ExerciseCard - Tarjeta individual de ejercicio
 */
const ExerciseCard = ({ exercise, onEdit, onDelete, onSubmitAnswer }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyText = (difficulty) => {
    const texts = {
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil'
    };
    return texts[difficulty] || difficulty;
  };

  const getTypeText = (type) => {
    const texts = {
      multiple_choice: 'Opción múltiple',
      true_false: 'Verdadero/Falso',
      fill_blank: 'Completar espacios',
      calculation: 'Cálculo'
    };
    return texts[type] || type;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitAnswer(userAnswer);
    setShowAnswer(true);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      exercise.isCompleted 
        ? 'border-green-400 bg-green-50' 
        : 'border-blue-400'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {exercise.question}
          </h3>
          
          <div className="flex space-x-4 mb-3">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
              {getDifficultyText(exercise.difficulty)}
            </span>
            
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {getTypeText(exercise.type)}
            </span>
            
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
              {exercise.points} puntos
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Opciones para opción múltiple */}
      {exercise.type === 'multiple_choice' && exercise.options && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Opciones:</p>
          <div className="space-y-2">
            {exercise.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={`answer-${exercise.id}`}
                  value={option}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Formulario de respuesta */}
      {!exercise.isCompleted && (
        <form onSubmit={handleSubmit} className="mb-4">
          {exercise.type !== 'multiple_choice' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu respuesta:
              </label>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ingresa tu respuesta aquí..."
                required
              />
            </div>
          )}
          
          <button
            type="submit"
            className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Enviar Respuesta
          </button>
        </form>
      )}

      {/* Mostrar resultado */}
      {exercise.isCompleted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-semibold">¡Ejercicio completado!</p>
          {exercise.userAnswer && (
            <p className="text-sm mt-1">Tu respuesta: {exercise.userAnswer}</p>
          )}
        </div>
      )}

      {/* Explicación */}
      {exercise.explanation && showAnswer && (
        <div className="mt-4 bg-gray-100 border border-gray-300 rounded-md p-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Explicación:</p>
          <p className="text-sm text-gray-600">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
};

/**
 * ExerciseForm - Formulario para crear/editar ejercicios usando Modal
 */
const ExerciseForm = ({ exercise, onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    levelId: exercise?.levelId || '',
    question: exercise?.question || '',
    type: exercise?.type || 'multiple_choice',
    difficulty: exercise?.difficulty || 'easy',
    points: exercise?.points || 10,
    timeLimit: exercise?.timeLimit || 0,
    optionA: exercise?.optionA || '',
    optionB: exercise?.optionB || '',
    optionC: exercise?.optionC || '',
    optionD: exercise?.optionD || '',
    correctAnswer: exercise?.correctAnswer || '',
    explanation: exercise?.explanation || ''
  });
  const [levels, setLevels] = useState([]);

  // Cargar niveles cuando se abre el formulario
  useEffect(() => {
    if (isOpen) {
      loadLevels();
    }
  }, [isOpen]);

  // Actualizar el estado del formulario cuando cambien los datos del ejercicio
  useEffect(() => {
    if (exercise) {
      setFormData({
        levelId: exercise.levelId || '',
        question: exercise.question || '',
        type: exercise.type || 'multiple_choice',
        difficulty: exercise.difficulty || 'easy',
        points: exercise.points || 10,
        timeLimit: exercise.timeLimit || 0,
        optionA: exercise.optionA || '',
        optionB: exercise.optionB || '',
        optionC: exercise.optionC || '',
        optionD: exercise.optionD || '',
        correctAnswer: exercise.correctAnswer || '',
        explanation: exercise.explanation || ''
      });
    }
  }, [exercise]);

  // Cargar niveles disponibles
  const loadLevels = async () => {
    try {
      const response = await fetch('/api/levels');
      const data = await response.json();
      
      if (data.success) {
        setLevels(data.data);
      } else {
        // Fallback con nivel hardcodeado
        setLevels([{ id: 19, title: 'DEFINICIONES v2' }]);
      }
    } catch (error) {
      console.error('Error al cargar niveles:', error);
      // Fallback con nivel hardcodeado
      setLevels([{ id: 19, title: 'DEFINICIONES v2' }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📚 ExerciseForm.handleSubmit() - Enviando datos:', formData);
    
    let processedData = { ...formData };
    
    // Manejar opciones según el tipo
    if (formData.type === 'multiple_choice') {
      // Para opción múltiple, usar las opciones A, B, C, D
      processedData.optionA = formData.optionA;
      processedData.optionB = formData.optionB;
      processedData.optionC = formData.optionC;
      processedData.optionD = formData.optionD;
    } else if (formData.type === 'true_false') {
      // Configurar opciones automáticamente para verdadero/falso
      processedData.optionA = 'Verdadero';
      processedData.optionB = 'Falso';
      processedData.optionC = '';
      processedData.optionD = '';
    } else if (formData.type === 'numeric') {
      // No necesita opciones para escrito numérico
      processedData.optionA = '';
      processedData.optionB = '';
      processedData.optionC = '';
      processedData.optionD = '';
    }
    
    onSubmit(processedData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={exercise ? 'Editar Ejercicio' : 'Crear Ejercicio'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
            <div>
          <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
                Pregunta
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                required
                rows={3}
            className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            placeholder="Escribe la pregunta del ejercicio..."
              />
            </div>

            {/* Soporte para imágenes en ejercicios */}
            {exercise && (
              <ExerciseImage 
                exercise={exercise}
                onImageUpdate={(imageData) => {
                  // Actualizar el ejercicio con la nueva imagen
                  setFormData(prev => ({ ...prev, imageUrl: imageData.imageUrl }));
                }}
                onImageDelete={() => {
                  // Remover la imagen del ejercicio
                  setFormData(prev => ({ ...prev, imageUrl: null }));
                }}
                canEdit={true}
              />
            )}

            <div>
              <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
                Nivel
              </label>
              <select
                name="levelId"
                value={formData.levelId}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
              >
                <option value="">Selecciona un nivel</option>
                {levels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
            <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
                  Tipo
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
              className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                >
                  <option value="multiple_choice">Opción múltiple</option>
                  <option value="true_false">Verdadero/Falso</option>
              <option value="numeric">Escrito numérico</option>
                </select>
              </div>

              <div>
            <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
                  Dificultad
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
              className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                >
                  <option value="easy">Fácil</option>
                  <option value="medium">Medio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
            <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
                  Puntos
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  min="1"
                  required
              className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                />
              </div>

              <div>
            <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
              Tiempo límite (segundos) <span className="text-gray-500">(opcional)</span>
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  min="0"
              className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                />
              </div>
            </div>

            {/* Opciones para opción múltiple */}
            {formData.type === 'multiple_choice' && (
              <div>
            <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
              Opciones (A, B, C, D)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-mono">Opción A</label>
                    <input
                      type="text"
                      name="optionA"
                      value={formData.optionA}
                      onChange={handleChange}
                      placeholder="Opción A"
                      className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-mono">Opción B</label>
                    <input
                      type="text"
                      name="optionB"
                      value={formData.optionB}
                      onChange={handleChange}
                      placeholder="Opción B"
                      className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-mono">Opción C</label>
                    <input
                      type="text"
                      name="optionC"
                      value={formData.optionC}
                      onChange={handleChange}
                      placeholder="Opción C (opcional)"
                      className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-mono">Opción D</label>
                    <input
                      type="text"
                      name="optionD"
                      value={formData.optionD}
                      onChange={handleChange}
                      placeholder="Opción D (opcional)"
                      className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                    />
                  </div>
                </div>
              </div>
            )}

        {/* Opciones para verdadero/falso */}
        {formData.type === 'true_false' && (
          <div>
            <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
              Opciones (se configuran automáticamente)
            </label>
            <div className="bg-gray-800/50 border border-pink-400/30 rounded-md px-3 py-2 text-gray-300 font-mono">
              Verdadero / Falso
            </div>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              Las opciones se configuran automáticamente como "Verdadero" y "Falso"
            </p>
          </div>
        )}

        {/* Instrucciones para escrito numérico */}
        {formData.type === 'numeric' && (
          <div>
            <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
              Instrucciones para respuesta numérica
            </label>
            <div className="bg-gray-800/50 border border-pink-400/30 rounded-md px-3 py-2 text-gray-300 font-mono">
              El usuario escribirá números como respuesta (ej: 1,3 o 2.5)
            </div>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              Ejemplo de respuestas: 1, 2.5, 3.14, 1,3 (separados por comas)
            </p>
          </div>
        )}

            <div>
          <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
                Respuesta correcta
              </label>
              {formData.type === 'multiple_choice' ? (
                <select
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                >
                  <option value="">Selecciona la respuesta correcta</option>
                  {formData.optionA && <option value="A">A) {formData.optionA}</option>}
                  {formData.optionB && <option value="B">B) {formData.optionB}</option>}
                  {formData.optionC && <option value="C">C) {formData.optionC}</option>}
                  {formData.optionD && <option value="D">D) {formData.optionD}</option>}
                </select>
              ) : formData.type === 'true_false' ? (
                <select
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                >
                  <option value="">Selecciona la respuesta correcta</option>
                  <option value="V">Verdadero</option>
                  <option value="F">Falso</option>
                </select>
              ) : (
                <input
                  type="text"
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                  placeholder="Respuesta numérica (ej: 1, 2.5, 3.14)"
                />
              )}
            </div>

            <div>
          <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
            Explicación <span className="text-gray-500">(opcional)</span>
              </label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                rows={3}
            className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            placeholder="Explicación del ejercicio (opcional)..."
              />
            </div>

        <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg font-mono transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-lg font-mono transition-all duration-300"
              >
                {exercise ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
    </Modal>
  );
};

export default ExerciseList;
