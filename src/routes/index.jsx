/**
 * Router Configuration - Configuración centralizada de rutas
 * Define todas las rutas de la aplicación con sus respectivos componentes
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar todas las vistas
import {
  HomePage,
  AuthPage,
  SpaceMapPage,
  ExercisePage,
  ProfilePage,
  ContentList
} from '../views';

// Importar componentes del admin
import AdminLayout from '../views/AdminLayout.jsx';
import AdminDashboard from '../views/AdminDashboard.jsx';
import AdminUsers from '../views/admin/AdminUsers.jsx';
import AdminContents from '../views/admin/AdminContents.jsx';
import AdminGame from '../views/admin/AdminGame.jsx';
import AdminPlanets from '../views/admin/AdminPlanets.jsx';
import AdminLevels from '../views/admin/AdminLevels.jsx';
import AdminExercises from '../views/admin/AdminExercises.jsx';
import AdminReports from '../views/admin/AdminReports.jsx';

// Importar componentes del estudiante
import StudentLayout from '../views/StudentLayout.jsx';
import StudentDashboard from '../views/StudentDashboard.jsx';
import StudentContents from '../views/student/StudentContents.jsx';
import StudentProfile from '../views/student/StudentProfile.jsx';
import StudentGame from '../views/student/StudentGame.jsx';
import PlanetLevelsView from '../views/student/PlanetLevelsView.jsx';
import QuizView from '../views/student/QuizView.jsx';
import StudentProgress from '../views/student/StudentProgress.jsx';
import StudentAchievements from '../views/student/StudentAchievements.jsx';
import LevelExercisesRedirect from '../views/student/LevelExercisesRedirect.jsx';

/**
 * Configuración de rutas de la aplicación
 * @returns {JSX.Element} Componente con todas las rutas configuradas
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas principales */}
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/space-map" element={<SpaceMapPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/contents" element={<ContentList />} />
      
      {/* Rutas del admin con layout anidado */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="contents" element={<AdminContents />} />
        <Route path="game" element={<AdminGame />} />
        <Route path="game/planets" element={<AdminPlanets />} />
        <Route path="game/levels" element={<AdminLevels />} />
        <Route path="game/exercises" element={<AdminExercises />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
      
      {/* Rutas del estudiante con layout anidado */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="contents" element={<StudentContents />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="game" element={<StudentGame />} />
        <Route path="progress" element={<StudentProgress />} />
        <Route path="achievements" element={<StudentAchievements />} />
        <Route path="planets/:planetId/levels" element={<PlanetLevelsView />} />
        {/* Compatibilidad: redirigir /student/levels/:levelId/exercises */}
        <Route path="levels/:levelId/exercises" element={<LevelExercisesRedirect />} />
      </Route>
      
      {/* Rutas de ejercicios */}
      <Route path="/quiz/:levelId/:exerciseId" element={<QuizView />} />
      
      {/* Ruta de fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

/**
 * Configuración de rutas públicas (no requieren autenticación)
 */
export const publicRoutes = [
  { path: '/', component: 'HomePage', name: 'Inicio' },
  { path: '/auth', component: 'AuthPage', name: 'Autenticación' }
];

/**
 * Configuración de rutas protegidas (requieren autenticación)
 */
export const protectedRoutes = [
  { path: '/space-map', component: 'SpaceMapPage', name: 'Mapa Espacial' },
  { path: '/profile', component: 'ProfilePage', name: 'Perfil' },
  { path: '/admin', component: 'AdminPage', name: 'Administración', requiresAdmin: true },
  { path: '/contents', component: 'ContentList', name: 'Contenidos', requiresAdmin: true }
];

/**
 * Configuración de rutas de ejercicios
 */
export const exerciseRoutes = [
  { path: '/quiz/:levelId/:exerciseId', component: 'ExercisePage', name: 'Ejercicio' }
];

/**
 * Obtener todas las rutas de la aplicación
 * @returns {Array} Array con todas las rutas configuradas
 */
export const getAllRoutes = () => {
  return [
    ...publicRoutes,
    ...protectedRoutes,
    ...exerciseRoutes
  ];
};

/**
 * Verificar si una ruta requiere autenticación
 * @param {string} path - Ruta a verificar
 * @returns {boolean} True si requiere autenticación
 */
export const requiresAuth = (path) => {
  return protectedRoutes.some(route => route.path === path);
};

/**
 * Verificar si una ruta requiere permisos de administrador
 * @param {string} path - Ruta a verificar
 * @returns {boolean} True si requiere permisos de admin
 */
export const requiresAdmin = (path) => {
  return protectedRoutes.some(route => route.path === path && route.requiresAdmin);
};

export default AppRoutes;
