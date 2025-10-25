/**
 * StudentContents - Vista de contenidos para estudiantes
 * Permite a los estudiantes ver los materiales educativos disponibles
 */

import React, { useState, useEffect } from 'react';
import { contentService } from '../../services/contentService.js';
import { useToast } from '../../components/Toast.jsx';

const StudentContents = () => {
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useToast();

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    try {
      console.log('📚 Cargando contenidos para estudiante...');
      setIsLoading(true);
      setError(null);

      const result = await contentService.getAllContents();
      
      if (result.success) {
        setContents(result.data.contents || []);
        console.log('✅ Contenidos cargados:', result.data.contents?.length || 0);
      } else {
        setError(result.message);
        showError(result.message, 'Error al cargar contenidos');
      }
    } catch (error) {
      console.error('💥 Error cargando contenidos:', error);
      setError('Error al cargar contenidos');
      showError('Error al cargar contenidos', 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewContent = (content) => {
    console.log('📖 Abriendo contenido:', content);
    
    if (content.resourceUrl) {
      console.log('🔗 URL del recurso:', content.resourceUrl);
      console.log('🔗 Tipo de recurso:', content.resourceType);
      
      // Intentar abrir en nueva pestaña
      try {
        const newWindow = window.open(content.resourceUrl, '_blank');
        if (newWindow) {
          console.log('✅ Nueva pestaña abierta exitosamente');
        } else {
          console.log('❌ No se pudo abrir nueva pestaña (posible bloqueo del navegador)');
          // Mostrar información del contenido como alternativa
          alert(`Contenido: ${content.title}\nDescripción: ${content.description}\nTipo: ${content.resourceType || 'No especificado'}\nURL: ${content.resourceUrl}`);
        }
      } catch (error) {
        console.error('💥 Error abriendo URL:', error);
        alert(`Error al abrir el contenido: ${error.message}\n\nContenido: ${content.title}\nURL: ${content.resourceUrl}`);
      }
    } else {
      console.log('❌ No hay URL del recurso disponible');
      // Mostrar información del contenido
      alert(`Contenido: ${content.title}\nDescripción: ${content.description}\nTipo: ${content.resourceType || 'No especificado'}`);
    }
  };


  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
            <p className="text-gray-300 font-mono">Cargando contenidos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white font-mono mb-2">Error</h2>
            <p className="text-gray-300 font-mono">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white font-mono mb-4">
            📚 Biblioteca de Contenidos
          </h2>
          <p className="text-gray-400 font-mono">
            Explora los materiales educativos disponibles
          </p>
        </div>


        {/* Contents Grid */}
        {contents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-white font-mono mb-2">
              No hay contenidos disponibles
            </h3>
            <p className="text-gray-400 font-mono">
              No hay contenidos en la biblioteca
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ margin: '0px 20px' }}>
            {contents.map((content) => (
              <div
                key={content.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-2xl">
                    {content.category === 'theory' ? '📖' : 
                     content.category === 'practice' ? '🔬' : 
                     content.category === 'reference' ? '📋' : '📚'}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-mono ${
                    content.category === 'theory' ? 'bg-blue-500/20 text-blue-400' :
                    content.category === 'practice' ? 'bg-green-500/20 text-green-400' :
                    content.category === 'reference' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {content.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white font-mono mb-2">
                  {content.title}
                </h3>
                
                <p className="text-gray-300 font-mono text-sm mb-4 line-clamp-3">
                  {content.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-xs">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleViewContent(content)}
                    className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-pink-400 px-3 py-1 rounded text-sm font-mono transition-all duration-300 border border-pink-500/50"
                  >
                    Ver contenido
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentContents;
