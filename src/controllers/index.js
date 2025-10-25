/**
 * Index de controladores - Exporta todos los controladores del sistema
 * Proporciona un punto centralizado para acceder a todos los controladores
 */

import { userController } from './userController.js';
import { planetController } from './planetController.js';
import { exerciseController } from './exerciseController.js';
import { levelController } from './levelController.js';
import { contentController } from './contentController.js';

// Re-exportar todos los controladores
export {
  userController,
  planetController,
  exerciseController,
  levelController,
  contentController
};

// Exportar como objeto para facilitar el acceso
export const controllers = {
  user: userController,
  planet: planetController,
  exercise: exerciseController,
  level: levelController,
  content: contentController
};

// Exportar por defecto
export default controllers;
