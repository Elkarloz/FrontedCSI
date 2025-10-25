/**
 * ExerciseController - Maneja la lógica de negocio del lado del cliente para ejercicios
 * Responsabilidades:
 * - Validar datos de ejercicios antes de enviar a la API
 * - Coordinar acciones entre vista y servicio
 * - Manejar estados de carga y errores
 * - Transformar datos para la vista
 */

import { exerciseService } from '../services/exerciseService.js';

class ExerciseController {
  constructor() {
    this.exerciseService = exerciseService;
    this.currentExercise = null;
    this.isLoading = false;
    this.error = null;
  }

  /**
   * Obtiene ejercicios por nivel
   * @param {string} levelId - ID del nivel
   * @returns {Promise<Object>} Resultado con ejercicios o error
   */
  async getExercisesByLevel(levelId) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!levelId) {
        throw new Error('ID del nivel es requerido');
      }
      
      const response = await this.exerciseService.getExercisesByLevel(levelId);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener ejercicios');
      }
      
      // Asegurar que response.data es un array
      const exercisesArray = Array.isArray(response.data) ? response.data : [];
      console.log('🔍 ExerciseController - Datos recibidos del servicio:', response.data);
      console.log('🔍 ExerciseController - Array de ejercicios:', exercisesArray);
      
      // Transformar datos para la vista
      const transformedExercises = exercisesArray.map(exercise => ({
        id: exercise.id,
        title: exercise.question, // Usar question como title para la vista
        question: exercise.question,
        type: exercise.type,
        difficulty: exercise.difficulty,
        points: exercise.points,
        isCompleted: exercise.isCompleted || false,
        timeLimit: exercise.timeLimit,
        options: [
          exercise.optionA,
          exercise.optionB,
          exercise.optionC,
          exercise.optionD
        ].filter(option => option && option.trim() !== ''), // Filtrar opciones vacías
        correctAnswer: exercise.correctAnswer,
        explanation: exercise.explanation,
        levelId: exercise.levelId,
        levelTitle: exercise.levelTitle,
        planetTitle: exercise.planetTitle
      }));
      
      console.log('🔍 ExerciseController - Ejercicios transformados:', transformedExercises);
      
      return {
        success: true,
        data: transformedExercises,
        message: 'Ejercicios obtenidos correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: [],
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Obtiene un ejercicio específico
   * @param {string} exerciseId - ID del ejercicio
   * @returns {Promise<Object>} Resultado con ejercicio o error
   */
  async getExerciseById(exerciseId) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!exerciseId) {
        throw new Error('ID del ejercicio es requerido');
      }
      
      const response = await this.exerciseService.getExerciseById(exerciseId);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener ejercicio');
      }
      
      // Transformar datos para la vista
      const transformedExercise = {
        id: response.data.id,
        title: response.data.question, // Usar question como title para la vista
        question: response.data.question,
        type: response.data.type,
        difficulty: response.data.difficulty,
        points: response.data.points,
        isCompleted: response.data.isCompleted || false,
        timeLimit: response.data.timeLimit,
        options: [
          response.data.optionA,
          response.data.optionB,
          response.data.optionC,
          response.data.optionD
        ].filter(option => option && option.trim() !== ''), // Filtrar opciones vacías
        correctAnswer: response.data.correctAnswer,
        explanation: response.data.explanation,
        levelId: response.data.levelId,
        levelTitle: response.data.levelTitle,
        planetTitle: response.data.planetTitle,
        hints: response.data.hints || []
      };
      
      this.currentExercise = transformedExercise;
      
      return {
        success: true,
        data: transformedExercise,
        message: 'Ejercicio obtenido correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: null,
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Crea un nuevo ejercicio
   * @param {Object} exerciseData - Datos del ejercicio
   * @returns {Promise<Object>} Resultado de la creación
   */
  async createExercise(exerciseData) {
    try {
      this.setLoading(true);
      this.clearError();
      
      const validation = this.validateExerciseData(exerciseData);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }
      
      const preparedData = this.prepareExerciseData(exerciseData);
      const response = await this.exerciseService.createExercise(preparedData);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al crear ejercicio');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Ejercicio creado correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: null,
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Actualiza un ejercicio existente
   * @param {string} exerciseId - ID del ejercicio
   * @param {Object} exerciseData - Datos actualizados
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async updateExercise(exerciseId, exerciseData) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!exerciseId) {
        throw new Error('ID del ejercicio es requerido');
      }
      
      const validation = this.validateExerciseData(exerciseData, true);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }
      
      const preparedData = this.prepareExerciseData(exerciseData);
      const response = await this.exerciseService.updateExercise(exerciseId, preparedData);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar ejercicio');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Ejercicio actualizado correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: null,
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Envía una respuesta de ejercicio
   * @param {string} exerciseId - ID del ejercicio
   * @param {*} answer - Respuesta del usuario
   * @returns {Promise<Object>} Resultado de la respuesta
   */
  async submitAnswer(exerciseId, answer) {
    try {
      this.setLoading(true);
      this.clearError();
      
      if (!exerciseId) {
        throw new Error('ID del ejercicio es requerido');
      }
      
      if (answer === undefined || answer === null) {
        throw new Error('La respuesta es requerida');
      }
      
      const response = await this.exerciseService.submitAnswer(exerciseId, answer);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al enviar respuesta');
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Respuesta enviada correctamente'
      };
    } catch (error) {
      this.setError(error.message);
      return {
        success: false,
        data: null,
        message: error.message
      };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Valida los datos del ejercicio
   * @param {Object} exerciseData - Datos a validar
   * @param {boolean} isUpdate - Si es una actualización
   * @returns {Object} Resultado de la validación
   */
  validateExerciseData(exerciseData, isUpdate = false) {
    const errors = [];
    
    if (!isUpdate) {
      if (!exerciseData.question || exerciseData.question.trim().length < 5) {
        errors.push('La pregunta debe tener al menos 5 caracteres');
      }
      
      if (!exerciseData.type || !['multiple_choice', 'true_false', 'numeric'].includes(exerciseData.type)) {
        errors.push('El tipo debe ser: multiple_choice, true_false o numeric');
      }
      
      if (!exerciseData.difficulty || !['easy', 'medium', 'hard'].includes(exerciseData.difficulty)) {
        errors.push('La dificultad debe ser: easy, medium o hard');
      }
      
      if (!exerciseData.points || exerciseData.points < 1) {
        errors.push('Los puntos deben ser mayor a 0');
      }
      
      if (exerciseData.type === 'multiple_choice' && (!exerciseData.optionA || !exerciseData.optionB)) {
        errors.push('Las opciones múltiples deben tener al menos opción A y B');
      }
      
      if (!exerciseData.correctAnswer) {
        errors.push('La respuesta correcta es requerida');
      }
    } else {
      if (exerciseData.question && exerciseData.question.trim().length < 5) {
        errors.push('La pregunta debe tener al menos 5 caracteres');
      }
      
      if (exerciseData.type && !['multiple_choice', 'true_false', 'numeric'].includes(exerciseData.type)) {
        errors.push('El tipo debe ser: multiple_choice, true_false o numeric');
      }
      
      if (exerciseData.difficulty && !['easy', 'medium', 'hard'].includes(exerciseData.difficulty)) {
        errors.push('La dificultad debe ser: easy, medium o hard');
      }
      
      if (exerciseData.points && exerciseData.points < 1) {
        errors.push('Los puntos deben ser mayor a 0');
      }
      
      if (exerciseData.type === 'multiple_choice' && exerciseData.optionA && exerciseData.optionB && (!exerciseData.optionA || !exerciseData.optionB)) {
        errors.push('Las opciones múltiples deben tener al menos opción A y B');
      }
    }
    
    return {
      isValid: errors.length === 0,
      message: errors.join(', ')
    };
  }

  /**
   * Prepara los datos del ejercicio para enviar al servicio
   * @param {Object} exerciseData - Datos originales
   * @returns {Object} Datos preparados
   */
  prepareExerciseData(exerciseData) {
    return {
      levelId: exerciseData.levelId,
      question: exerciseData.question?.trim(),
      type: exerciseData.type,
      difficulty: exerciseData.difficulty,
      points: exerciseData.points,
      timeLimit: exerciseData.timeLimit,
      optionA: exerciseData.optionA,
      optionB: exerciseData.optionB,
      optionC: exerciseData.optionC,
      optionD: exerciseData.optionD,
      correctAnswer: exerciseData.correctAnswer,
      explanation: exerciseData.explanation?.trim()
    };
  }

  /**
   * Calcula la puntuación basada en la respuesta
   * @param {boolean} isCorrect - Si la respuesta es correcta
   * @param {number} points - Puntos base del ejercicio
   * @param {number} timeSpent - Tiempo empleado en segundos
   * @param {number} timeLimit - Límite de tiempo en segundos
   * @returns {number} Puntuación calculada
   */
  calculateScore(isCorrect, points, timeSpent, timeLimit) {
    if (!isCorrect) return 0;
    
    let score = points;
    
    // Bonificación por velocidad si hay límite de tiempo
    if (timeLimit && timeSpent < timeLimit) {
      const timeBonus = Math.round((timeLimit - timeSpent) / timeLimit * points * 0.5);
      score += timeBonus;
    }
    
    return Math.max(0, score);
  }

  /**
   * Establece el estado de carga
   * @param {boolean} loading - Estado de carga
   */
  setLoading(loading) {
    this.isLoading = loading;
  }

  /**
   * Establece un error
   * @param {string} error - Mensaje de error
   */
  setError(error) {
    this.error = error;
  }

  /**
   * Limpia el error actual
   */
  clearError() {
    this.error = null;
  }

  /**
   * Obtiene el estado actual del controlador
   * @returns {Object} Estado actual
   */
  getState() {
    return {
      currentExercise: this.currentExercise,
      isLoading: this.isLoading,
      error: this.error
    };
  }
}

// Exportar instancia singleton
export const exerciseController = new ExerciseController();
export default exerciseController;
