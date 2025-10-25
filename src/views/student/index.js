/**
 * Index de vistas de estudiante - Exporta todas las vistas del estudiante
 * Proporciona un punto centralizado para acceder a todas las vistas del estudiante
 */

import StudentContents from './StudentContents.jsx';
import StudentProfile from './StudentProfile.jsx';
import StudentGame from './StudentGame.jsx';
import QuizView from './QuizView.jsx';

// Re-exportar todas las vistas del estudiante
export {
  StudentContents,
  StudentProfile,
  StudentGame,
  QuizView
};

// Exportar como objeto para facilitar el acceso
export const studentViews = {
  contents: StudentContents,
  profile: StudentProfile,
  game: StudentGame,
  quiz: QuizView
};

// Exportar por defecto
export default studentViews;
