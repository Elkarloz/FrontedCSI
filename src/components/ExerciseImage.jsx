import React, { useState } from 'react';
import { Button } from './ui';
import FileUpload from './FileUpload';
import { useFileUpload } from '../hooks/useFileUpload';

const ExerciseImage = ({ exercise, onImageUpdate, onImageDelete, canEdit = false }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploading, error, progress, uploadExerciseImage, deleteExerciseImage } = useFileUpload();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    
    if (exercise.id && exercise.id !== 'new') {
      // Si el ejercicio ya existe, subir directamente
      uploadExerciseImage(
        exercise.id,
        file,
        (response) => {
          onImageUpdate && onImageUpdate(response.data);
          setShowUpload(false);
          setSelectedFile(null);
        },
        (error) => {
          console.error('Error al subir imagen:', error);
        }
      );
    } else {
      // Si es un ejercicio nuevo, guardar el archivo temporalmente
      // y subirlo después de crear el ejercicio
      console.log('Ejercicio nuevo - imagen guardada temporalmente:', file);
      onImageUpdate && onImageUpdate({
        imageUrl: null,
        filePath: file // Guardar el archivo temporalmente
      });
      setShowUpload(false);
    }
  };

  const handleDeleteImage = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      deleteExerciseImage(
        exercise.id,
        (response) => {
          onImageDelete && onImageDelete();
        },
        (error) => {
          console.error('Error al eliminar imagen:', error);
        }
      );
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setShowUpload(false);
    onImageDelete && onImageDelete();
  };

  if (!canEdit && !exercise.imageUrl) {
    return null;
  }

  // Para ejercicios nuevos, siempre mostrar la opción de subir
  const isNewExercise = exercise.id === 'new' || !exercise.id;

  return (
    <div className="exercise-image">
      <div>
        <label className="block text-sm font-medium text-pink-400 mb-2 font-mono">
          Imagen del Ejercicio
        </label>
        
        {exercise.imageUrl && !isNewExercise ? (
          <div className="image-container">
            <img 
              src={exercise.imageUrl} 
              alt="Imagen del ejercicio"
              className="exercise-image-preview"
            />
            {canEdit && (
              <div className="image-actions">
                <button
                  onClick={handleDeleteImage}
                  disabled={uploading}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-mono transition-colors duration-300 disabled:opacity-50"
                >
                  Eliminar Imagen
                </button>
              </div>
            )}
          </div>
        ) : (canEdit || isNewExercise) && (
          <div className="image-upload-section">
            {selectedFile ? (
              <div className="selected-file-preview">
                <div className="file-info">
                  <div className="file-icon">🖼️</div>
                  <div className="file-details">
                    <h4 className="text-white font-mono">{selectedFile.name}</h4>
                    <p className="text-gray-300 font-mono text-sm">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <p className="text-green-400 font-mono text-sm">
                      ✅ Imagen lista para subir
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
                🖼️ {isNewExercise ? 'Agregar Imagen para este ejercicio' : 'Agregar Imagen'}
              </button>
            ) : (
              <div className="upload-form">
                <FileUpload
                  accept="image/*"
                  maxSize={5}
                  onFileSelect={handleFileSelect}
                  disabled={uploading}
                >
                <div className="upload-content">
                  <div className="upload-icon">🖼️</div>
                  <p>{isNewExercise ? 'Selecciona una imagen para este ejercicio' : 'Selecciona una imagen para el ejercicio'}</p>
                  <p className="upload-info">
                    Tipos: JPG, PNG, GIF | Máximo: 5MB
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
      </div>
      <style jsx>{`
        .exercise-image {
          margin: 20px 0;
        }
        
        .image-container {
          position: relative;
          display: inline-block;
          background: #1f2937;
          border-radius: 8px;
          padding: 15px;
          border: 1px solid #374151;
        }
        
        .exercise-image-preview {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .image-actions {
          margin-top: 10px;
          text-align: center;
        }
        
        .image-upload-section {
          border: 2px dashed #6b7280;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          background: #1f2937;
          transition: border-color 0.3s ease;
        }
        
        .image-upload-section:hover {
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
  );
};

export default ExerciseImage;
