import React, { useState } from 'react';
import { Button } from './ui';
import FileUpload from './FileUpload';
import { useFileUpload } from '../hooks/useFileUpload';

const ContentPDF = ({ content, onPDFUpdate, onPDFDelete, canEdit = false }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploading, error, progress, uploadContentPDF, deleteContentPDF } = useFileUpload();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    
    if (content.id && content.id !== 'new') {
      // Si el contenido ya existe, subir directamente
      uploadContentPDF(
        content.id,
        file,
        (response) => {
          onPDFUpdate && onPDFUpdate(response.data);
          setShowUpload(false);
          setSelectedFile(null);
        },
        (error) => {
          console.error('Error al subir PDF:', error);
        }
      );
    } else {
      // Si es un contenido nuevo, guardar el archivo temporalmente
      // y subirlo después de crear el contenido
      console.log('Contenido nuevo - archivo guardado temporalmente:', file);
      onPDFUpdate && onPDFUpdate({
        pdfUrl: null,
        filePath: file // Guardar el archivo temporalmente
      });
      setShowUpload(false);
    }
  };

  const handleDeletePDF = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este PDF?')) {
      deleteContentPDF(
        content.id,
        (response) => {
          onPDFDelete && onPDFDelete();
        },
        (error) => {
          console.error('Error al eliminar PDF:', error);
        }
      );
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setShowUpload(false);
    onPDFDelete && onPDFDelete();
  };


  if (!canEdit && !content.resourceUrl) {
    return null;
  }

  // Para contenidos nuevos, siempre mostrar la opción de subir
  const isNewContent = content.id === 'new' || !content.id;

  return (
    <div className="content-pdf">
      <div>
        <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
          Archivo PDF
        </label>
        
        {content.resourceUrl && !isNewContent ? (
          <div className="pdf-container">
            <div className="pdf-preview">
              <div className="pdf-icon">📄</div>
              <div className="pdf-info">
                <h4 className="text-white font-mono">{content.title}</h4>
                <p className="text-gray-300 font-mono text-sm">Archivo PDF disponible</p>
              </div>
            </div>
            
            {canEdit && (
              <div className="pdf-actions">
                <button
                  onClick={handleDeletePDF}
                  disabled={uploading}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-mono transition-colors duration-300 disabled:opacity-50"
                >
                  🗑️ Eliminar PDF
                </button>
              </div>
            )}
          </div>
        ) : (canEdit || isNewContent) && (
          <div className="pdf-upload-section">
            {selectedFile ? (
              <div className="selected-file-preview">
                <div className="file-info">
                  <div className="file-icon">📄</div>
                  <div className="file-details">
                    <h4 className="text-white font-mono">{selectedFile.name}</h4>
                    <p className="text-gray-300 font-mono text-sm">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <p className="text-green-400 font-mono text-sm">
                      ✅ Archivo listo para subir
                    </p>
                  </div>
                </div>
                <div className="file-actions">
                  <button
                    onClick={handleClearFile}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-mono transition-colors duration-300"
                  >
                    🗑️ Quitar
                  </button>
                </div>
              </div>
            ) : !showUpload ? (
            <button
              onClick={() => setShowUpload(true)}
              className="w-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-pink-400 px-4 py-3 rounded-lg font-mono transition-all duration-300 border border-pink-500/50"
            >
              📄 {isNewContent ? 'Subir PDF para este contenido' : 'Subir PDF'}
            </button>
          ) : (
            <div className="upload-form">
              <FileUpload
                accept="application/pdf,.pdf"
                maxSize={10}
                onFileSelect={handleFileSelect}
                disabled={uploading}
              >
                <div className="upload-content">
                  <div className="upload-icon">📄</div>
                  <p>{isNewContent ? 'Selecciona un archivo PDF para este contenido' : 'Selecciona un archivo PDF'}</p>
                  <p className="upload-info">
                    Tipo: PDF | Máximo: 10MB
                  </p>
                </div>
              </FileUpload>
              
              {uploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span>Subiendo... {progress}%</span>
                </div>
              )}
              
              {error && (
                <div className="upload-error">
                  {error}
                </div>
              )}
              
              <div className="upload-actions">
                <Button 
                  variant="ghost"
                  onClick={() => setShowUpload(false)}
                  disabled={uploading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        .content-pdf {
          margin: 20px 0;
        }
        
        .pdf-container {
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 20px;
          background: #1f2937;
        }
        
        .pdf-preview {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .pdf-icon {
          font-size: 3rem;
        }
        
        .pdf-info h4 {
          margin: 0 0 5px 0;
          color: #f9fafb;
        }
        
        .pdf-info p {
          margin: 0;
          color: #d1d5db;
          font-size: 0.9rem;
        }
        
        .pdf-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .pdf-upload-section {
          border: 2px dashed #6b7280;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          background: #1f2937;
          transition: border-color 0.3s ease;
        }
        
        .pdf-upload-section:hover {
          border-color: #ec4899;
        }
        
        .upload-form {
          width: 100%;
        }
        
        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #d1d5db;
        }
        
        .upload-icon {
          font-size: 2rem;
        }
        
        .upload-info {
          font-size: 0.9rem;
          color: #9ca3af;
        }
        
        .upload-progress {
          margin-top: 15px;
          text-align: center;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #374151;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ec4899, #8b5cf6);
          transition: width 0.3s ease;
        }
        
        .upload-error {
          color: #ef4444;
          font-size: 0.9rem;
          margin-top: 10px;
        }
        
        .upload-actions {
          margin-top: 15px;
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        
        .selected-file-preview {
          background: #1f2937;
          border: 1px solid #10b981;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }
        
        .file-info {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
        }
        
        .file-icon {
          font-size: 2rem;
        }
        
        .file-details h4 {
          margin: 0 0 5px 0;
          color: #f9fafb;
        }
        
        .file-details p {
          margin: 0;
          color: #d1d5db;
        }
        
        .file-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
      `}</style>
    </div>
    </div>
  );
};

export default ContentPDF;
