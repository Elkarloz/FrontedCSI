/**
 * Index de vistas - Exporta todas las vistas del sistema
 * Proporciona un punto centralizado para acceder a todas las vistas
 */

import HomePage from './HomePage.jsx';
import AuthPage from './AuthPage.jsx';
import SpaceMapPage from './SpaceMapPage.jsx';
import ExercisePage from './ExercisePage.jsx';
import ProfilePage from './ProfilePage.jsx';
import AdminPage from './AdminPage.jsx';
import UserList from './UserList.jsx';
import PlanetList from '../components/PlanetList.jsx';
import ExerciseList from '../components/ExerciseList.jsx';
import SpaceMapView from './SpaceMapView.jsx';
import ContentList from '../components/ContentList.jsx';
import LevelList from '../components/LevelList.jsx';
import StudentLayout from './StudentLayout.jsx';
import StudentDashboard from './StudentDashboard.jsx';
import { StudentGame } from './student/index.js';

// Re-exportar todas las vistas
export {
  HomePage,
  AuthPage,
  SpaceMapPage,
  ExercisePage,
  ProfilePage,
  AdminPage,
  UserList,
  PlanetList,
  ExerciseList,
  SpaceMapView,
  ContentList,
  LevelList,
  StudentLayout,
  StudentDashboard,
  StudentGame
};

// Exportar como objeto para facilitar el acceso
export const views = {
  home: HomePage,
  auth: AuthPage,
  spaceMap: SpaceMapPage,
  exercise: ExercisePage,
  profile: ProfilePage,
  admin: AdminPage,
  user: UserList,
  planet: PlanetList,
  exerciseList: ExerciseList,
  spaceMapView: SpaceMapView,
  content: ContentList,
  level: LevelList,
  studentLayout: StudentLayout,
  studentDashboard: StudentDashboard,
  studentGame: StudentGame
};

// Exportar por defecto
export default views;
