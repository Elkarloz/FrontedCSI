import { useState } from 'react';
import { apiClient } from '../services';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (url, file, fieldName, onSuccess, onError) => {
    console.log('📄 useFileUpload.uploadFile() - Iniciando subida:', {
      url,
      file,
      fieldName,
      fileName: file?.name,
      fileSize: file?.size
    });
    
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append(fieldName, file); // Usar el nombre de campo correcto
      
      console.log('📄 useFileUpload.uploadFile() - FormData creado, enviando...');

      const response = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        onSuccess && onSuccess(response.data);
        setProgress(100);
      } else {
        throw new Error(response.data.message || 'Error al subir archivo');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al subir archivo';
      setError(errorMessage);
      onError && onError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const uploadExerciseImage = async (exerciseId, file, onSuccess, onError) => {
    const url = `/api/exercises/${exerciseId}/upload-image`;
    return uploadFile(url, file, 'image', onSuccess, onError);
  };

  const uploadContentPDF = async (contentId, file, onSuccess, onError) => {
    console.log('📄 useFileUpload.uploadContentPDF() - Iniciando subida:', {
      contentId,
      file,
      fileName: file?.name,
      fileSize: file?.size
    });
    
    const url = `/api/contents/${contentId}/upload-pdf`;
    console.log('📄 useFileUpload.uploadContentPDF() - URL:', url);
    
    return uploadFile(url, file, 'pdf', onSuccess, onError);
  };

  const deleteFile = async (url, onSuccess, onError) => {
    setUploading(true);
    setError(null);

    try {
      const response = await apiClient.delete(url);

      if (response.data.success) {
        onSuccess && onSuccess(response.data);
      } else {
        throw new Error(response.data.message || 'Error al eliminar archivo');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar archivo';
      setError(errorMessage);
      onError && onError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const deleteExerciseImage = async (exerciseId, onSuccess, onError) => {
    const url = `/api/exercises/${exerciseId}/image`;
    return deleteFile(url, onSuccess, onError);
  };

  const deleteContentPDF = async (contentId, onSuccess, onError) => {
    const url = `/api/contents/${contentId}/pdf`;
    return deleteFile(url, onSuccess, onError);
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await apiClient.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      throw error;
    }
  };

  return {
    uploading,
    error,
    progress,
    uploadFile,
    uploadExerciseImage,
    uploadContentPDF,
    deleteFile,
    deleteExerciseImage,
    deleteContentPDF,
    downloadFile,
  };
};
