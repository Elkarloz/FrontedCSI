/**
 * LevelList - Vista para mostrar la lista de niveles
 * Responsabilidades:
 * - Mostrar lista de niveles con información visual
 * - Manejar acciones de nivel (crear, editar, eliminar)
 * - Coordinar con el controlador para la lógica de negocio
 */

import React, { useState, useEffect } from 'react';
import { levelController } from '../controllers/levelController.js';
import { useToast } from './Toast.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import Modal from './Modal.jsx';

const LevelList = () => {
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState('all');
  const [planets, setPlanets] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null
  });
  const { showSuccess, showError, showWarning } = useToast();

  // Cargar niveles y planetas al montar el componente
  useEffect(() => {
    loadLevels();
    loadPlanets();
  }, []);

  /**
   * Carga la lista de niveles usando el controlador
   */
  const loadLevels = async () => {
    console.log('📚 LevelList.loadLevels() - Iniciando carga de niveles...');
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await levelController.getAllLevels();
      
      if (result.success) {
        setLevels(result.data);
        setError(null);
      } else {
        console.error('❌ LevelList.loadLevels() - Error del controlador:', result.message);
        setError(result.message);
        showError(result.message, 'Error al cargar niveles');
      }
    } catch (error) {
      console.error('💥 LevelList.loadLevels() - Error inesperado:', error);
      const errorMessage = 'Error inesperado al cargar niveles: ' + error.message;
      setError(errorMessage);
      showError(errorMessage, 'Error inesperado');
    }
    
    setIsLoading(false);
  };

  /**
   * Carga la lista de planetas para el filtro
   */
  const loadPlanets = async () => {
    try {
      const result = await levelController.getAllPlanets();
      if (result.success) {
        setPlanets(result.data);
      }
    } catch (error) {
      console.error('Error al cargar planetas:', error);
    }
  };

  /**
   * Maneja la creación de un nuevo nivel
   * @param {Object} levelData - Datos del nivel
   */
  const handleCreateLevel = async (levelData) => {
    console.log('📚 LevelList.handleCreateLevel() - Creando nivel:', levelData);
    const result = await levelController.createLevel(levelData);
    
    if (result.success) {
      console.log('✅ LevelList.handleCreateLevel() - Nivel creado exitosamente');
      setShowCreateForm(false);
      showSuccess('Nivel creado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadLevels();
    } else {
      console.error('❌ LevelList.handleCreateLevel() - Error al crear:', result.message);
      setError(result.message);
      showError(result.message, 'Error al crear nivel');
    }
  };

  /**
   * Maneja la actualización de un nivel
   * @param {string} levelId - ID del nivel
   * @param {Object} levelData - Datos actualizados
   */
  const handleUpdateLevel = async (levelId, levelData) => {
    console.log('📚 LevelList.handleUpdateLevel() - Actualizando nivel:', levelId, levelData);
    const result = await levelController.updateLevel(levelId, levelData);
    
    if (result.success) {
      console.log('✅ LevelList.handleUpdateLevel() - Nivel actualizado exitosamente');
      setEditingLevel(null);
      showSuccess('Nivel actualizado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadLevels();
    } else {
      console.error('❌ LevelList.handleUpdateLevel() - Error al actualizar:', result.message);
      setError(result.message);
      showError(result.message, 'Error al actualizar nivel');
    }
  };

  /**
   * Maneja la eliminación de un nivel
   * @param {string} levelId - ID del nivel
   */
  const handleDeleteLevel = (levelId) => {
    const level = levels.find(l => l.id === levelId);
    setConfirmDialog({
      isOpen: true,
      type: 'error',
      title: 'Eliminar Nivel',
      message: `¿Estás seguro de que quieres eliminar el nivel "${level?.title || 'este nivel'}"? Esta acción no se puede deshacer.`,
      onConfirm: () => executeDeleteLevel(levelId)
    });
  };

  /**
   * Ejecuta la eliminación del nivel
   * @param {string} levelId - ID del nivel
   */
  const executeDeleteLevel = async (levelId) => {
    console.log('📚 LevelList.executeDeleteLevel() - Eliminando nivel:', levelId);
    const result = await levelController.deleteLevel(levelId);
    
    if (result.success) {
      console.log('✅ LevelList.executeDeleteLevel() - Nivel eliminado exitosamente');
      showSuccess('Nivel eliminado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadLevels();
    } else {
      console.error('❌ LevelList.executeDeleteLevel() - Error al eliminar:', result.message);
      setError(result.message);
      showError(result.message, 'Error al eliminar nivel');
    }
  };

  /**
   * Inicia la edición de un nivel
   * @param {Object} level - Nivel a editar
   */
  const startEditing = (level) => {
    setEditingLevel(level);
  };

  /**
   * Cancela la edición
   */
  const cancelEditing = () => {
    setEditingLevel(null);
  };

  // Filtrar niveles por planeta
  const filteredLevels = levels.filter(level => 
    selectedPlanet === 'all' || level.planetId === selectedPlanet
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-xl font-mono text-cyan-400">Cargando niveles...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modales fuera del contenedor principal */}
      <LevelForm
        isOpen={showCreateForm}
        planets={planets}
        onSubmit={handleCreateLevel}
        onCancel={() => setShowCreateForm(false)}
      />

      <LevelForm
        isOpen={!!editingLevel}
        level={editingLevel}
        planets={planets}
        onSubmit={(levelData) => handleUpdateLevel(editingLevel?.id, levelData)}
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
              📈 Gestión de Niveles
            </h1>
            <p className="text-gray-400 font-mono text-lg">
              Gestiona todos los niveles del sistema educativo
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg font-mono transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
          >
            ➕ Crear Nivel
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

        {/* Filtro por planeta */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 p-6">
            <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
              🪐 Filtrar por Planeta
            </label>
            <select
              value={selectedPlanet}
              onChange={(e) => setSelectedPlanet(e.target.value)}
              className="w-full max-w-xs bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="all">Todos los planetas</option>
              {planets.map(planet => (
                <option key={planet.id} value={planet.id}>
                  {planet.title}
                </option>
              ))}
            </select>
          </div>
        </div>
       
        <div className="mx-8" style={{margin: '0px 20px', marginTop: '20px'}}>
          <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-800/50 to-pink-800/50">
                  <tr>
                    <th className="px-8 py-6 text-left text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      📈 Nivel
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      🪐 Planeta
                    </th>
                    <th className="px-8 py-6 text-center text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      🔢 Orden
                    </th>
                    <th className="px-8 py-6 text-center text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      📊 Ejercicios
                    </th>
                    <th className="px-8 py-6 text-center text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      ⚙️ Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600/30">
                  {filteredLevels.map((level, index) => (
                    <tr key={level.id} className={`hover:bg-gradient-to-r hover:from-purple-800/20 hover:to-pink-800/20 transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-900/30'}`}>
                      <td className="px-8 py-6">
                        <div>
                          <div className="text-lg font-bold text-white font-mono">
                            {level.title}
                          </div>
                          <div className="text-sm text-gray-400 font-mono">
                            ID: {level.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-base text-gray-300 font-mono">
                          {level.planetTitle || 'Sin planeta'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex px-4 py-2 text-sm font-bold rounded-full font-mono bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/50">
                          {level.orderIndex || 0}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex px-4 py-2 text-sm font-bold rounded-full font-mono bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/50">
                          {level.exercisesCount || 0}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Botones de edición y eliminación */}
                          <button
                            onClick={() => startEditing(level)}
                            className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg font-mono font-bold transition-all duration-300 border border-blue-500/50 hover:border-blue-400/70 transform hover:scale-105"
                            title="Editar nivel"
                          >
                            ✏️
                          </button>
                          
                          <button
                            onClick={() => handleDeleteLevel(level.id)}
                            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg font-mono font-bold transition-all duration-300 border border-red-500/50 hover:border-red-400/70 transform hover:scale-105"
                            title="Eliminar nivel"
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

        {filteredLevels.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 p-12">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-white font-mono mb-2">
                No hay niveles registrados
              </h3>
              <p className="text-gray-400 font-mono text-lg">
                Comienza creando el primer nivel del sistema
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Componente de formulario para niveles usando Modal existente
const LevelForm = ({ level, planets, onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    planetId: level?.planetId || '',
    title: level?.title || '',
    orderIndex: level?.orderIndex || 1
  });

  // Actualizar el estado del formulario cuando cambien los datos del nivel
  useEffect(() => {
    if (level) {
      setFormData({
        planetId: level.planetId || '',
        title: level.title || '',
        orderIndex: level.orderIndex || 1
      });
    }
  }, [level]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📚 LevelForm.handleSubmit() - Enviando datos:', formData);
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={level ? 'Editar Nivel' : 'Crear Nivel'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
            🪐 Planeta
          </label>
          <select
            value={formData.planetId}
            onChange={(e) => setFormData({...formData, planetId: e.target.value})}
            className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            required
          >
            <option value="">Seleccionar planeta</option>
            {planets.map(planet => (
              <option key={planet.id} value={planet.id}>
                {planet.title}
              </option>
            ))}
          </select>
        </div>
        
        
        <div>
          <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
            Título del Nivel
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            placeholder="Ej: Introducción a la Programación"
            required
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
              console.log('📚 LevelForm - Cambiando orderIndex a:', value);
              setFormData({...formData, orderIndex: value});
            }}
            className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            placeholder="1"
          />
          <p className="text-xs text-gray-500 mt-1 font-mono">
            Los niveles se mostrarán en este orden dentro del planeta
          </p>
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
            {level ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LevelList;
