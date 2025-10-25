import React, { useState } from 'react';
import { Button } from './ui';

const FileUpload = ({ 
  onFileSelect, 
  accept, 
  maxSize = 5, 
  disabled = false,
  className = '',
  children 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    setError('');
    
    // Validar tipo de archivo
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isValidType = acceptedTypes.some(type => {
        if (type === '.pdf') {
          return file.type === 'application/pdf';
        }
        if (type === 'image/*') {
          return file.type.startsWith('image/');
        }
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.includes(type);
      });
      
      if (!isValidType) {
        setError(`Tipo de archivo no válido. Tipos permitidos: ${accept}`);
        return;
      }
    }
    
    // Validar tamaño
    const maxSizeBytes = maxSize * 1024 * 1024; // Convertir MB a bytes
    if (file.size > maxSizeBytes) {
      setError(`El archivo es demasiado grande. Tamaño máximo: ${maxSize}MB`);
      return;
    }
    
    onFileSelect(file);
  };

  return (
    <div className={`file-upload ${className}`}>
      <div
        className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        
        <div className="file-upload-content">
          {children || (
            <div className="file-upload-default">
              <div className="upload-icon">📁</div>
              <p>Arrastra un archivo aquí o haz clic para seleccionar</p>
              <p className="file-upload-info">
                Tipos permitidos: {accept || 'Todos'} | Máximo: {maxSize}MB
              </p>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="file-upload-error">
          {error}
        </div>
      )}
      
      <style jsx>{`
        .file-upload {
          width: 100%;
        }
        
        .file-upload-area {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f9f9f9;
        }
        
        .file-upload-area:hover:not(.disabled) {
          border-color: #007bff;
          background: #f0f8ff;
        }
        
        .file-upload-area.drag-active {
          border-color: #007bff;
          background: #e6f3ff;
        }
        
        .file-upload-area.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .file-upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .file-upload-default {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .upload-icon {
          font-size: 2rem;
        }
        
        .file-upload-info {
          font-size: 0.9rem;
          color: #666;
        }
        
        .file-upload-error {
          color: #dc3545;
          font-size: 0.9rem;
          margin-top: 10px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default FileUpload;
