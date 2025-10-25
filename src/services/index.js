/**
 * Index de servicios - Exporta todos los servicios del sistema
 * Proporciona un punto centralizado para acceder a todos los servicios
 */

import { userService } from './userService.js';
import { planetService } from './planetService.js';
import { exerciseService } from './exerciseService.js';
import { levelService } from './levelService.js';
import { contentService } from './contentService.js';
import { apiClient } from './apiClient.js';

// Re-exportar todos los servicios
export {
  userService,
  planetService,
  exerciseService,
  levelService,
  contentService,
  apiClient
};

// Exportar como objeto para facilitar el acceso
export const services = {
  user: userService,
  planet: planetService,
  exercise: exerciseService,
  level: levelService,
  content: contentService,
  api: apiClient
};

// Exportar por defecto
export default services;
