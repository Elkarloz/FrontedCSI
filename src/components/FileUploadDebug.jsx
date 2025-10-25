import React, { useState } from 'react';
import { apiClient } from '../services';

const FileUploadDebug = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log('📁 Archivo seleccionado:', file);
    }
  };

  const testUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🚀 Iniciando subida de archivo...');
      
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      console.log('📤 FormData creado:', formData);
      console.log('📤 Archivo en FormData:', formData.get('image'));
      
      const response = await apiClient.post('/exercises/1/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Respuesta recibida:', response);
      setResult(response.data);
      
    } catch (error) {
      console.error('❌ Error en la subida:', error);
      setError(error.response?.data || error.message);
    } finally {
      setUploading(false);
    }
  };

  const testDownload = async () => {
    try {
      console.log('📥 Probando descarga...');
      const response = await apiClient.get('/contents/1/download', {
        responseType: 'blob',
      });
      console.log('✅ Descarga exitosa:', response);
    } catch (error) {
      console.error('❌ Error en descarga:', error);
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #007bff', margin: '10px', borderRadius: '8px' }}>
      <h3>🔧 Debug de Subida de Archivos</h3>
      
      <div style={{ margin: '10px 0' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
        />
      </div>
      
      {selectedFile && (
        <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <p><strong>Archivo seleccionado:</strong> {selectedFile.name}</p>
          <p><strong>Tamaño:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>Tipo:</strong> {selectedFile.type}</p>
        </div>
      )}
      
      <div style={{ margin: '10px 0' }}>
        <button 
          onClick={testUpload} 
          disabled={!selectedFile || uploading}
          style={{
            padding: '10px 20px',
            backgroundColor: uploading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {uploading ? 'Subiendo...' : 'Probar Subida'}
        </button>
        
        <button 
          onClick={testDownload}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Probar Descarga
        </button>
      </div>
      
      {result && (
        <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
          <h4>✅ Resultado:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      
      {error && (
        <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
          <h4>❌ Error:</h4>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      
      <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#e2e3e5', borderRadius: '4px' }}>
        <h4>📋 Información del API Client:</h4>
        <pre>{JSON.stringify(apiClient.getConfig(), null, 2)}</pre>
      </div>
    </div>
  );
};

export default FileUploadDebug;
