/**
 * ContentList - Vista para mostrar la lista de contenidos
 * Responsabilidades:
 * - Mostrar lista de contenidos con información visual
 * - Manejar acciones de contenido (crear, editar, eliminar)
 * - Coordinar con el controlador para la lógica de negocio
 */

import React, { useState, useEffect } from 'react';
import { contentController } from '../controllers/contentController.js';
import { useToast } from './Toast.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import Modal from './Modal.jsx';

const ContentList = () => {
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null
  });
  const { showSuccess, showError, showWarning } = useToast();

  // Cargar contenidos al montar el componente
  useEffect(() => {
    loadContents();
  }, []);

  /**
   * Carga la lista de contenidos usando el controlador
   */
  const loadContents = async () => {
    console.log('📄 ContentList.loadContents() - Iniciando carga de contenidos...');
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await contentController.getAllContents();
      
      if (result.success) {
        setContents(result.data.contents || []);
        setError(null);
      } else {
        console.error('❌ ContentList.loadContents() - Error del controlador:', result.message);
        setError(result.message);
        showError(result.message, 'Error al cargar contenidos');
      }
    } catch (error) {
      console.error('💥 ContentList.loadContents() - Error inesperado:', error);
      const errorMessage = 'Error inesperado al cargar contenidos: ' + error.message;
      setError(errorMessage);
      showError(errorMessage, 'Error inesperado');
    }
    
    setIsLoading(false);
  };

  /**
   * Maneja la creación de un nuevo contenido
   * @param {Object} contentData - Datos del contenido
   */
  const handleCreateContent = async (contentData) => {
    console.log('📄 ContentList.handleCreateContent() - Creando contenido:', contentData);
    const result = await contentController.createContent(contentData);
    
    if (result.success) {
      console.log('✅ ContentList.handleCreateContent() - Contenido creado exitosamente');
      setShowCreateForm(false);
      showSuccess('Contenido creado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadContents();
    } else {
      console.error('❌ ContentList.handleCreateContent() - Error al crear:', result.message);
      setError(result.message);
      showError(result.message, 'Error al crear contenido');
    }
  };

  /**
   * Maneja la actualización de un contenido
   * @param {string} contentId - ID del contenido
   * @param {Object} contentData - Datos actualizados
   */
  const handleUpdateContent = async (contentId, contentData) => {
    console.log('📄 ContentList.handleUpdateContent() - Actualizando contenido:', contentId, contentData);
    const result = await contentController.updateContent(contentId, contentData);
    
    if (result.success) {
      console.log('✅ ContentList.handleUpdateContent() - Contenido actualizado exitosamente');
      setEditingContent(null);
      showSuccess('Contenido actualizado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadContents();
    } else {
      console.error('❌ ContentList.handleUpdateContent() - Error al actualizar:', result.message);
      setError(result.message);
      showError(result.message, 'Error al actualizar contenido');
    }
  };

  /**
   * Maneja la eliminación de un contenido
   * @param {string} contentId - ID del contenido
   */
  const handleDeleteContent = (contentId) => {
    const content = contents.find(c => c.id === contentId);
    setConfirmDialog({
      isOpen: true,
      type: 'error',
      title: 'Eliminar Contenido',
      message: `¿Estás seguro de que quieres eliminar el contenido "${content?.title || 'este contenido'}"? Esta acción no se puede deshacer.`,
      onConfirm: () => executeDeleteContent(contentId)
    });
  };

  /**
   * Ejecuta la eliminación del contenido
   * @param {string} contentId - ID del contenido
   */
  const executeDeleteContent = async (contentId) => {
    console.log('📄 ContentList.executeDeleteContent() - Eliminando contenido:', contentId);
    const result = await contentController.deleteContent(contentId);
    
    if (result.success) {
      console.log('✅ ContentList.executeDeleteContent() - Contenido eliminado exitosamente');
      showSuccess('Contenido eliminado correctamente', 'Éxito');
      // Recargar la lista completa desde la API para asegurar sincronización
      await loadContents();
    } else {
      console.error('❌ ContentList.executeDeleteContent() - Error al eliminar:', result.message);
      setError(result.message);
      showError(result.message, 'Error al eliminar contenido');
    }
  };

  /**
   * Inicia la edición de un contenido
   * @param {Object} content - Contenido a editar
   */
  const startEditing = (content) => {
    setEditingContent(content);
  };

  /**
   * Cancela la edición
   */
  const cancelEditing = () => {
    setEditingContent(null);
  };

  // No hay filtros, mostrar todos los contenidos
  const filteredContents = contents;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-xl font-mono text-cyan-400">Cargando contenidos...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modales fuera del contenedor principal */}
      <ContentForm
        isOpen={showCreateForm}
        onSubmit={handleCreateContent}
        onCancel={() => setShowCreateForm(false)}
      />

      <ContentForm
        isOpen={!!editingContent}
        content={editingContent}
        onSubmit={(contentData) => handleUpdateContent(editingContent?.id, contentData)}
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
              📄 Gestión de Contenidos
            </h1>
            <p className="text-gray-400 font-mono text-lg">
              Gestiona todos los contenidos educativos del sistema
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg font-mono transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
          >
            ➕ Crear Contenido
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
                      📄 Contenido
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      📝 Descripción
                    </th>
                    <th className="px-8 py-6 text-center text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      🏷️ Tipo
                    </th>
                    <th className="px-8 py-6 text-center text-sm font-bold text-pink-400 uppercase tracking-wider font-mono">
                      ⚙️ Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600/30">
                  {filteredContents.map((content, index) => (
                    <tr key={content.id} className={`hover:bg-gradient-to-r hover:from-purple-800/20 hover:to-pink-800/20 transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-900/30'}`}>
                      <td className="px-8 py-6">
                        <div>
                          <div className="text-lg font-bold text-white font-mono">
                            {content.title}
                          </div>
                          <div className="text-sm text-gray-400 font-mono">
                            ID: {content.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-base text-gray-300 font-mono max-w-xs truncate">
                          {content.description || 'Sin descripción'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span 
                          className="inline-flex px-4 py-2 text-sm font-bold rounded-full font-mono border"
                          style={{
                            backgroundColor: `${content.typeColor}20`,
                            color: content.typeColor,
                            borderColor: `${content.typeColor}50`
                          }}
                        >
                          {content.typeIcon} {content.resourceType.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Botones de edición y eliminación */}
                          <button
                            onClick={() => startEditing(content)}
                            className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg font-mono font-bold transition-all duration-300 border border-blue-500/50 hover:border-blue-400/70 transform hover:scale-105"
                            title="Editar contenido"
                          >
                            ✏️
                          </button>
                          
                          <button
                            onClick={() => handleDeleteContent(content.id)}
                            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg font-mono font-bold transition-all duration-300 border border-red-500/50 hover:border-red-400/70 transform hover:scale-105"
                            title="Eliminar contenido"
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

        {filteredContents.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-xl border border-pink-400/30 shadow-2xl shadow-pink-400/20 p-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-2xl font-bold text-white font-mono mb-2">
                No hay contenidos registrados
              </h3>
              <p className="text-gray-400 font-mono text-lg">
                Comienza creando el primer contenido educativo
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Componente de formulario para contenidos usando Modal existente
const ContentForm = ({ content, onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    description: content?.description || '',
    resourceType: content?.resourceType || 'pdf',
    resourceUrl: content?.resourceUrl || ''
  });

  // Actualizar el estado del formulario cuando cambien los datos del contenido
  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        description: content.description || '',
        resourceType: content.resourceType || 'pdf',
        resourceUrl: content.resourceUrl || ''
      });
    }
  }, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📄 ContentForm.handleSubmit() - Enviando datos:', formData);
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={content ? 'Editar Contenido' : 'Crear Contenido'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
            Título del Contenido
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
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
            placeholder="Descripción del contenido (opcional)"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
              Tipo de Recurso
            </label>
            <select
              value={formData.resourceType}
              onChange={(e) => setFormData({...formData, resourceType: e.target.value})}
              className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
              required
            >
              <option value="pdf">📄 PDF</option>
              <option value="video">🎥 Video</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
              URL del Recurso
            </label>
            <input
              type="url"
              value={formData.resourceUrl}
              onChange={(e) => setFormData({...formData, resourceUrl: e.target.value})}
              className="w-full bg-gray-800 border border-pink-400/50 rounded-md px-3 py-2 text-white font-mono focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
              placeholder="https://ejemplo.com/recurso.pdf"
              required
            />
          </div>
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
            {content ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ContentList;
