import React, { useState } from 'react';
import { useFileUpload } from '../hooks/useFileUpload';

const FileUploadTest = ({ exerciseId, contentId, type = 'image' }) => {
  const { uploading, error, progress, uploadExerciseImage, uploadContentPDF } = useFileUpload();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    if (type === 'image' && exerciseId) {
      await uploadExerciseImage(
        exerciseId,
        selectedFile,
        (response) => {
          console.log('✅ Imagen subida exitosamente:', response);
          alert('Imagen subida exitosamente!');
        },
        (error) => {
          console.error('❌ Error al subir imagen:', error);
          alert('Error al subir imagen: ' + error);
        }
      );
    } else if (type === 'pdf' && contentId) {
      await uploadContentPDF(
        contentId,
        selectedFile,
        (response) => {
          console.log('✅ PDF subido exitosamente:', response);
          alert('PDF subido exitosamente!');
        },
        (error) => {
          console.error('❌ Error al subir PDF:', error);
          alert('Error al subir PDF: ' + error);
        }
      );
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Prueba de Subida de Archivos</h3>
      <p>Tipo: {type}</p>
      {exerciseId && <p>Exercise ID: {exerciseId}</p>}
      {contentId && <p>Content ID: {contentId}</p>}
      
      <div style={{ margin: '10px 0' }}>
        <input
          type="file"
          accept={type === 'image' ? 'image/*' : '.pdf'}
          onChange={handleFileSelect}
        />
      </div>
      
      {selectedFile && (
        <div style={{ margin: '10px 0' }}>
          <p>Archivo seleccionado: {selectedFile.name}</p>
          <p>Tamaño: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}
      
      <button 
        onClick={handleUpload} 
        disabled={!selectedFile || uploading}
        style={{
          padding: '10px 20px',
          backgroundColor: uploading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: uploading ? 'not-allowed' : 'pointer'
        }}
      >
        {uploading ? 'Subiendo...' : 'Subir Archivo'}
      </button>
      
      {uploading && (
        <div style={{ margin: '10px 0' }}>
          <div style={{ 
            width: '100%', 
            height: '20px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#007bff',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <p>Progreso: {progress}%</p>
        </div>
      )}
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default FileUploadTest;
