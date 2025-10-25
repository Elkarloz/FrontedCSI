/**
 * PlanetList - Vista para mostrar la lista de planetas
 * Responsabilidades:
 * - Mostrar lista de planetas con información visual
 * - Manejar acciones de planeta (crear, editar, eliminar, desbloquear)
 * - Coordinar con el controlador para la lógica de negocio
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { planetController } from '../controllers/planetController.js';
import { useToast } from './Toast.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import Modal from './Modal.jsx';

const PlanetList = () => {
  const [planets, setPlanets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlanet, setEditingPlanet] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null
  });
  const { showSuccess, showError, showWarning } = useToast();
  const navigate = useNavigate();

  // Cargar planetas al montar el componente
  useEffect(() => {
    loadPlanets();
  }, []);

  /**
   * Carga la lista de planetas usando el controlador
   */
  const loadPlanets = async () => {
      setIsLoading(true);
    setError(null);
    
    try {
      const result = await planetController.getAllPlanets();
      
      if (result.success) {
        setPlanets(result.data);
        setError(null);
      } else {
        console.error('❌ PlanetList.loadPlanets() - Error del controlador:', result.message);
        setError(result.message);
        showError(result.message, 'Error al cargar planetas');
      }
    } catch (error) {
      console.error('💥 PlanetList.loadPlanets() - Error inesperado:', error);
      const errorMessage = 'Error inesperado al cargar planetas: ' + error.message;
      setError(errorMessage);
      showError(errorMessage, 'Error inesperado');
    }
    
    setIsLoading(false);
  };

  /**
   * Maneja la creación de un nuevo planeta
   * @param {Object} planetData - Datos del planeta
   */
  const handleCreatePlanet = async (planetData) => {

    const result = await planetController.createPlanet(planetData);
    
    if (result.success) {
      setShowCreateForm(false);
      showSuccess('Planeta creado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadPlanets();
    } else {
      console.error('❌ PlanetList.handleCreatePlanet() - Error al crear:', result.message);
      setError(result.message);
      showError(result.message, 'Error al crear planeta');
    }
  };

  /**
   * Maneja la actualización de un planeta
   * @param {string} planetId - ID del planeta
   * @param {Object} planetData - Datos actualizados
   */
  const handleUpdatePlanet = async (planetId, planetData) => {
    
    const result = await planetController.updatePlanet(planetId, planetData);
    
    if (result.success) {
      setEditingPlanet(null);
      showSuccess('Planeta actualizado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadPlanets();
    } else {
      console.error('❌ PlanetList.handleUpdatePlanet() - Error al actualizar:', result.message);
      setError(result.message);
      showError(result.message, 'Error al actualizar planeta');
    }
  };

  /**
   * Maneja la eliminación de un planeta
   * @param {string} planetId - ID del planeta
   */
  const handleDeletePlanet = (planetId) => {
    const planet = planets.find(p => p.id === planetId);
    setConfirmDialog({
      isOpen: true,
      type: 'error',
      title: 'Eliminar Planeta',
      message: `¿Estás seguro de que quieres eliminar el planeta "${planet?.name || 'este planeta'}"? Esta acción no se puede deshacer.`,
      onConfirm: () => executeDeletePlanet(planetId)
    });
  };

  /**
   * Ejecuta la eliminación del planeta
   * @param {string} planetId - ID del planeta
   */
  const executeDeletePlanet = async (planetId) => {
    const result = await planetController.deletePlanet(planetId);
    
    if (result.success) {
      showSuccess('Planeta eliminado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadPlanets();
    } else {
      console.error('❌ PlanetList.executeDeletePlanet() - Error al eliminar:', result.message);
      setError(result.message);
      showError(result.message, 'Error al eliminar planeta');
    }
  };

  /**
   * Maneja el cambio de estado de desbloqueo de un planeta
   * @param {string} planetId - ID del planeta
   */
  const handleToggleUnlock = async (planetId) => {
    const planet = planets.find(p => p.id === planetId);
    const newUnlockState = !planet.isUnlocked;
    
    const result = await planetController.updatePlanet(planetId, { isUnlocked: newUnlockState });
    
    if (result.success) {
      showSuccess(
        `Planeta ${newUnlockState ? 'desbloqueado' : 'bloqueado'} correctamente`, 
        'Estado actualizado'
      );
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadPlanets();
    } else {
      console.error('❌ PlanetList.handleToggleUnlock() - Error al actualizar:', result.message);
      setError(result.message);
      showError(result.message, 'Error al actualizar planeta');
    }
  };

  /**
   * Inicia la edición de un planeta
   * @param {Object} planet - Planeta a editar
   */
  const startEditing = (planet) => {
    setEditingPlanet(planet);
  };

  /**
   * Cancela la edición
   */
  const cancelEditing = () => {
    setEditingPlanet(null);
  };

  /**
   * Navega a los niveles de un planeta específico
   * @param {string} planetId - ID del planeta
   */
  const handleViewLevels = (planetId) => {
    console.log('🪐 PlanetList.handleViewLevels() - Navegando a niveles del planeta:', planetId);
    navigate(`/student/planets/${planetId}/levels`);
  };


  // Filtrar planetas por dificultad (todos los planetas por ahora, ya que la API no devuelve difficulty)
  const filteredPlanets = planets.filter(planet => 
    selectedDifficulty === 'all' || true // Mostrar todos los planetas por ahora
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-xl font-mono text-cyan-400">Cargando planetas...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modales fuera del contenedor principal */}
      <PlanetForm
        isOpen={showCreateForm}
        onSubmit={handleCreatePlanet}
        onCancel={() => setShowCreateForm(false)}
      />

      <PlanetForm
        isOpen={!!editingPlanet}
        planet={editingPlanet}
        onSubmit={(planetData) => handleUpdatePlanet(editingPlanet?.id, planetData)}
        onCancel={cancelEditing}
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
              🪐 Gestión de Planetas
            </h1>
            <p className="text-gray-400 font-mono text-lg">
              Gestiona todos los planetas del sistema espacial
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg font-mono transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
          >
            ➕ Crear Planeta
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

       
       
       
        <div className="mx-8" style={{margin: '0px 20px', marginTop: '20px'}}>
          <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-800/50 to-pink-800/50">
                  <tr>
                    <th className="px-8 py-6 text-left text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      🪐 Planeta
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      📝 Descripción
                    </th>
                    <th className="px-8 py-6 text-center text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      🔢 Orden
                    </th>
                    <th className="px-8 py-6 text-center text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      ⚙️ Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600/30">
                  {filteredPlanets.map((planet, index) => (
                    <tr key={planet.id} className={`hover:bg-gradient-to-r hover:from-purple-800/20 hover:to-pink-800/20 transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-900/30'}`}>
                      <td className="px-8 py-6">
                        <div>
                          <div className="text-lg font-bold text-white font-mono">
                            {planet.title}
                          </div>
                          <div className="text-sm text-gray-400 font-mono">
                            ID: {planet.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-base text-gray-300 font-mono max-w-xs truncate">
                          {planet.description || 'Sin descripción'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex px-4 py-2 text-sm font-bold rounded-full font-mono bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/50">
                          {planet.orderIndex || 0}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Botón para ver niveles */}
                          <button
                            onClick={() => handleViewLevels(planet.id)}
                            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-400 hover:text-green-300 px-3 py-2 rounded-lg font-mono font-bold transition-all duration-300 border border-green-500/50 hover:border-green-400/70 transform hover:scale-105"
                            title="Ver niveles del planeta"
                          >
                            📚
                          </button>
                          
                          {/* Botones de edición y eliminación */}
                          <button
                            onClick={() => startEditing(planet)}
                            className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg font-mono font-bold transition-all duration-300 border border-blue-500/50 hover:border-blue-400/70 transform hover:scale-105"
                            title="Editar planeta"
                          >
                            ✏️
                          </button>
                          
                          <button
                            onClick={() => handleDeletePlanet(planet.id)}
                            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg font-mono font-bold transition-all duration-300 border border-red-500/50 hover:border-red-400/70 transform hover:scale-105"
                            title="Eliminar planeta"
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

        {filteredPlanets.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 p-12">
              <div className="text-6xl mb-4">🪐</div>
              <h3 className="text-2xl font-bold text-white font-mono mb-2">
                No hay planetas registrados
              </h3>
              <p className="text-gray-400 font-mono text-lg">
                Comienza creando el primer planeta del sistema
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Componente de formulario para planetas usando Modal existente
const PlanetForm = ({ planet, onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: planet?.name || '',
    description: planet?.description || '',
    orderIndex: planet?.orderIndex || 1,
    isUnlocked: planet?.isUnlocked || false
  });

  // Actualizar el estado del formulario cuando cambien los datos del planeta
  useEffect(() => {
    if (planet) {
      setFormData({
        name: planet.name || '',
        description: planet.description || '',
        orderIndex: planet.orderIndex || 1,
        isUnlocked: planet.isUnlocked || false
      });
    }
  }, [planet]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🪐 PlanetForm.handleSubmit() - Enviando datos:', formData);
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={planet ? 'Editar Planeta' : 'Crear Planeta'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
            Nombre del Planeta
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
            Descripción <span className="text-gray-500">(opcional)</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            rows="3"
            placeholder="Descripción del planeta (opcional)"
          />
        </div>
        
       
        
        <div>
          <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
            Orden <span className="text-gray-500">(1, 2, 3, 4...)</span>
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={formData.orderIndex || 1}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              console.log('🪐 PlanetForm - Cambiando orderIndex a:', value);
              setFormData({...formData, orderIndex: value});
            }}
            className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            placeholder="1"
          />
          <p className="text-xs text-gray-500 mt-1 font-mono">
            Los planetas se mostrarán en este orden (1 = primero, 2 = segundo, etc.)
          </p>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isUnlocked"
            checked={formData.isUnlocked}
            onChange={(e) => setFormData({...formData, isUnlocked: e.target.checked})}
            className="mr-2"
          />
          <label htmlFor="isUnlocked" className="text-pink-400 font-mono">
            Planeta desbloqueado
          </label>
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
            {planet ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PlanetList;