/**
 * QuizView - Vista de quiz estilo Kahoot para ejercicios
 * Responsabilidades:
 * - Mostrar una pregunta a la vez
 * - Manejar respuestas del usuario
 * - Mostrar temporizador y puntuación
 * - Navegación entre preguntas
 */

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { exerciseController } from "../../controllers/exerciseController.js";
import { useToast } from "../../components/Toast.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import ExerciseImage from "../../components/ExerciseImage.jsx";

const QuizView = () => {
  const { levelId, exerciseId } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeUp, setTimeUp] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (exerciseId) {
      loadExercise();
    }
  }, [exerciseId]);

  useEffect(() => {
    if (exercise && exercise.timeLimit > 0 && !isAnswered) {
      setTimeLeft(exercise.timeLimit);
    }
  }, [exercise, isAnswered]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !isAnswered && exercise) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered && exercise) {
      handleTimeUp();
    }
  }, [timeLeft, isAnswered, exercise]);

  /**
   * Carga el ejercicio específico
   */
  const loadExercise = async () => {
    setIsLoading(true);
    setError(null);
    
    // Resetear estados del quiz para la nueva pregunta
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setTimeUp(false);
    setTimeLeft(null);

    try {
      const result = await exerciseController.getExerciseById(exerciseId);
      if (result.success) {
        setExercise(result.data);
        console.log('🔄 QuizView.loadExercise() - Nuevo ejercicio cargado:', result.data.id);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("💥 QuizView.loadExercise() - Error:", error);
      const errorMessage = "Error al cargar el ejercicio: " + error.message;
      setError(errorMessage);
      showError(errorMessage, "Error de carga");
    }

    setIsLoading(false);
  };

  /**
   * Maneja la selección de una respuesta
   */
  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
  };

  /**
   * Maneja el envío de la respuesta
   */
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isAnswered) return;

    setIsAnswered(true);

    try {
      // Evaluar respuesta
      const isAnswerCorrect = selectedAnswer === exercise.correctAnswer;
      setIsCorrect(isAnswerCorrect);

      // Calcular puntuación
      const timeBonus = exercise.timeLimit > 0 ? Math.max(0, timeLeft) : 0;
      const baseScore = exercise.points || 10;
      const finalScore = isAnswerCorrect ? baseScore + timeBonus : 0;
      setScore(finalScore);

      if (isAnswerCorrect) {
        showSuccess(`¡Correcto! +${finalScore} puntos`, "Respuesta correcta");
      } else {
        showError(
          `Incorrecto. La respuesta correcta es: ${exercise.correctAnswer}`,
          "Respuesta incorrecta"
        );
      }

      // Enviar respuesta al backend
      const result = await exerciseController.submitAnswer(
        exerciseId,
        selectedAnswer
      );
      if (result.success) {
      }
    } catch (error) {
      console.error("💥 Error al enviar respuesta:", error);
      showError("Error al enviar respuesta", "Error de conexión");
    }
  };

  /**
   * Maneja cuando se acaba el tiempo
   */
  const handleTimeUp = () => {
    if (isAnswered || !exercise) return;

    setIsAnswered(true);
    setIsCorrect(false);
    setTimeUp(true); // Marcar que se acabó el tiempo
    setSelectedAnswer(null); // No mostrar respuesta seleccionada
    showError("¡Tiempo agotado!", "Tiempo terminado");
  };

  /**
   * Regresa a los niveles del planeta
   */
  const handleBackToLevels = () => {
    console.log('🔄 QuizView.handleBackToLevels() - Navegando a niveles del planeta');
    console.log('🔄 Exercise data:', exercise);
    console.log('🔄 LevelId:', levelId);
    
    // El nivel 19 pertenece al planeta 12 (TEOREMA FUNDAMENTAL)
    const planetId = 12;
    
    console.log('🔄 PlanetId final:', planetId);
    console.log('🔄 Navegando a:', `/student/planets/${planetId}/levels`);
    
    // Navegar a la vista de niveles del planeta
    navigate(`/student/planets/${planetId}/levels`);
  };

  /**
   * Va al siguiente ejercicio (si existe)
   */
  const handleNextExercise = async () => {
    try {
      console.log('🔄 QuizView.handleNextExercise() - Iniciando navegación...');
      console.log('📊 Nivel actual:', levelId, 'Ejercicio actual:', exerciseId);
      
      // Cargar todos los ejercicios del nivel
      const result = await exerciseController.getExercisesByLevel(levelId);
      console.log('📋 Resultado de getExercisesByLevel:', result);

      if (result.success && result.data && result.data.length > 0) {
        const exercises = result.data;
        console.log('📚 Ejercicios encontrados:', exercises.length);
        console.log('📚 IDs de ejercicios:', exercises.map(ex => ex.id));
        
        const currentIndex = exercises.findIndex(
          (ex) => ex.id.toString() === exerciseId.toString()
        );
        console.log('📍 Índice actual:', currentIndex);

        if (currentIndex !== -1 && currentIndex < exercises.length - 1) {
          // Hay siguiente ejercicio
          const nextExercise = exercises[currentIndex + 1];
          console.log('➡️ Siguiente ejercicio:', nextExercise.id);
          navigate(`/quiz/${levelId}/${nextExercise.id}`);
        } else {
          // No hay más ejercicios, volver a la lista
          console.log('🏁 No hay más ejercicios, volviendo a niveles');
          handleBackToLevels();
        }
      } else {
        console.warn("⚠️ QuizView - No se pudieron cargar los ejercicios");
        console.warn("⚠️ Resultado:", result);
        handleBackToLevels();
      }
    } catch (error) {
      console.error("💥 QuizView.handleNextExercise() - Error:", error);
      handleBackToLevels();
    }
  };

  /**
   * Formatea el tiempo en MM:SS
   */
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner message="Cargando ejercicio..." />
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
        <button
          onClick={handleBackToLevels}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg font-mono transition-all duration-300"
        >
          ← Volver a Niveles
        </button>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white font-mono mb-4">
            Ejercicio no encontrado
          </h2>
          <button
            onClick={handleBackToLevels}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg font-mono transition-all duration-300"
          >
            ← Volver a Niveles
          </button>
        </div>
      </div>
    );
  }

  // Validar que el ejercicio tenga datos válidos
  if (
    !exercise.question ||
    !exercise.options ||
    exercise.options.length === 0
  ) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white font-mono mb-4">
            Datos del ejercicio incompletos
          </h2>
          <p className="text-gray-300 font-mono mb-4">
            El ejercicio no tiene datos válidos para mostrar.
          </p>
          <button
            onClick={handleBackToLevels}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg font-mono transition-all duration-300"
          >
            ← Volver a Niveles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header con información del quiz */}
      <div className="bg-gradient-to-r from-gray-800/50 to-purple-800/50 border-b border-pink-400/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToLevels}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg font-mono transition-all duration-300"
            >
              ← Volver
            </button>

            <div className="flex items-center space-x-6 text-sm font-mono">
              <div className="flex items-center">
                <span className="text-cyan-400 mr-2">⭐</span>
                <span className="text-gray-300">Puntuación: {score}</span>
              </div>
              {exercise.timeLimit > 0 && timeLeft !== null && (
                <div
                  className={`flex items-center ${
                    timeLeft <= 10 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  <span className="text-xl mr-2">⏰</span>
                  <span className="font-bold text-lg">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal del quiz */}
      <div
        className="container mx-auto px-6 py-8"
        style={{ marginTop: "50px" }}
      >
        <div className="mt-10">
          {/* Pregunta */}
          <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 p-8 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h1 className="text-3xl font-bold text-white font-mono mb-4 text-center">
                {exercise.question}
              </h1>
              
              {/* Mostrar imagen del ejercicio si existe */}
              <ExerciseImage 
                exercise={exercise}
                canEdit={false}
              />
              <div className="flex items-center justify-center space-x-4 text-sm font-mono">
                <span className="text-cyan-400">📊 {exercise.type}</span>
                <span className="text-green-400">⭐ {exercise.difficulty}</span>
                <span className="text-yellow-400">
                  💎 {exercise.points} pts
                </span>
              </div>
            </div>

            {/* Opciones de respuesta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4 mr-4 ml-4">
              {exercise.options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                const isSelected = selectedAnswer === optionLetter;
                const isCorrectOption = optionLetter === exercise.correctAnswer;
                const showResult =
                  isAnswered && (isCorrectOption || isSelected);

                let buttonClass =
                  "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border-2 border-transparent";
                let iconClass =
                  "w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 text-xl font-bold";

                if (showResult) {
                  if (isCorrectOption) {
                    buttonClass =
                      "bg-gradient-to-r from-green-600 to-green-700 text-white border-2 border-green-400 shadow-lg shadow-green-400/30";
                    iconClass =
                      "w-12 h-12 bg-green-400/30 rounded-full flex items-center justify-center mr-4 text-xl font-bold text-green-100";
                  } else if (isSelected && !isCorrectOption) {
                    buttonClass =
                      "bg-gradient-to-r from-red-600 to-red-700 text-white border-2 border-red-400 shadow-lg shadow-red-400/30";
                    iconClass =
                      "w-12 h-12 bg-red-400/30 rounded-full flex items-center justify-center mr-4 text-xl font-bold text-red-100";
                  }
                } else if (isSelected) {
                  buttonClass =
                    "bg-blue-600 text-white border-4 border-blue-300 shadow-2xl shadow-blue-400/90 ring-4 ring-blue-200/80 animate-pulse";
                  iconClass =
                    "w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center mr-4 text-xl font-bold text-blue-900 border-2 border-blue-100";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(optionLetter)}
                    disabled={isAnswered}
                    className={`${buttonClass} p-10 rounded-xl font-mono text-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative`}
                    style={{
                      margin: "20px",
                      ...(isSelected && !isAnswered
                        ? {
                            backgroundColor: "#2563eb",
                            borderColor: "#3b82f6",
                            boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)",
                            borderWidth: "4px"
                          }
                        : {})
                    }}
                  >
                    <div className="flex items-center px-6 py-4">
                      <div className={iconClass}>
                        {optionLetter}
                        {") "}
                      </div>
                      <span className="text-left pl-4">
                        &nbsp;&nbsp; {option}
                      </span>
                    </div>
                    {isSelected && !isAnswered && (
                      <div className="absolute inset-0 rounded-xl border-4 border-blue-400 animate-ping bg-blue-500/20"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Botón de envío */}
            {!isAnswered && (
              <div className="text-center" style={{ margin: "20px 0px" }}>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className={`${
                    selectedAnswer
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-400/30 border-2 border-pink-400"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 border-2 border-gray-500"
                  } text-white font-bold py-4 px-8 rounded-xl font-mono text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {selectedAnswer ? (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🚀</span>
                      <span>Enviar Respuesta</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">👆</span>
                      <span>Selecciona una respuesta</span>
                    </div>
                  )}
                </button>
                {selectedAnswer && (
                  <p className="text-blue-400 text-sm font-mono mt-2">
                    ✓ Respuesta seleccionada: {selectedAnswer}
                  </p>
                )}
              </div>
            )}

            {/* Resultado */}
            {isAnswered && (
              <div className="text-center">
                <div
                  className={`text-6xl mb-4 ${
                    isCorrect ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isCorrect ? "🎉" : timeUp ? "⏰" : "😞"}
                </div>
                <h2
                  className={`text-2xl font-bold font-mono mb-4 ${
                    isCorrect ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isCorrect
                    ? "¡Correcto!"
                    : timeUp
                    ? "¡Tiempo agotado!"
                    : "Incorrecto"}
                </h2>
                <p className="text-gray-300 font-mono mb-6">
                  {isCorrect
                    ? `¡Excelente trabajo! Ganaste ${score} puntos.`
                    : timeUp
                    ? "Se acabó el tiempo. Inténtalo de nuevo."
                    : `La respuesta correcta era: ${exercise.correctAnswer}`}
                </p>
                {exercise.explanation && !timeUp && (
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                    <p className="text-gray-300 font-mono text-sm">
                      <strong>Explicación:</strong> {exercise.explanation}
                    </p>
                  </div>
                )}
                <button
                  onClick={isCorrect ? handleNextExercise : timeUp ? () => window.location.reload() : handleBackToLevels}
                  style={{ margin: "20px" }}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-lg font-mono transition-all duration-300"
                >
                  {isCorrect
                    ? "Siguiente Pregunta →"
                    : timeUp
                    ? "Intentar de Nuevo"
                    : "Volver a Ejercicios"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizView;
