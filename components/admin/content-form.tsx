'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { contentAPI, Content, CreateContentData, UpdateContentData } from '@/lib/api';
import { Save, X, FileText, Video } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ContentFormProps {
  content?: Content | null;
  onSuccess?: (content: Content) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

export function ContentForm({ content, onSuccess, onCancel, isEdit = false }: ContentFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resourceType: 'pdf' as 'pdf' | 'video',
    resourceUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string>('');

  // Cargar datos si es edición
  useEffect(() => {
    if (isEdit && content) {
      setFormData({
        title: content.title,
        description: content.description || '',
        resourceType: content.resourceType,
        resourceUrl: content.resourceUrl
      });
    }
  }, [isEdit, content]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar título
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    } else if (formData.title.trim().length > 255) {
      newErrors.title = 'El título no puede exceder 255 caracteres';
    }

    // Validar descripción (opcional pero con límite)
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres';
    }

    // Validar tipo de recurso
    if (!['pdf', 'video'].includes(formData.resourceType)) {
      newErrors.resourceType = 'Tipo de recurso inválido';
    }

    // Validar URL
    if (!formData.resourceUrl.trim()) {
      newErrors.resourceUrl = 'La URL del recurso es requerida';
    } else if (!contentAPI.isValidUrl(formData.resourceUrl.trim())) {
      newErrors.resourceUrl = 'La URL del recurso no es válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData: CreateContentData | UpdateContentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        resourceType: formData.resourceType,
        resourceUrl: formData.resourceUrl.trim()
      };

      let response;
      if (isEdit && content?.id) {
        response = await contentAPI.update(content.id, submitData);
      } else {
        response = await contentAPI.create(submitData);
      }

      toast({
        title: 'Éxito',
        description: isEdit ? 'Contenido actualizado correctamente' : 'Contenido creado correctamente',
      });

      setAuthError('');
      onSuccess?.(response.data.content);
    } catch (error: any) {
      console.error('Error submitting content:', error);
      
      // Manejar errores específicos del servidor
      const status = error?.response?.status;
      const errorMessage = error?.response?.data?.message || 
                          (isEdit ? 'Error al actualizar el contenido' : 'Error al crear el contenido');

      if (status === 401 || status === 403) {
        setAuthError(errorMessage || 'No autorizado. Inicia sesión como administrador.');
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getResourceTypeIcon = (type: 'pdf' | 'video') => {
    return type === 'pdf' ? <FileText className="h-4 w-4" /> : <Video className="h-4 w-4" />;
  };

  return (
    <div className="relative">
      {authError && (
        <div className="fixed top-4 right-4 z-[1000] max-w-sm w-[360px]">
          <Alert variant="destructive">
            <AlertTitle>Permisos insuficientes</AlertTitle>
            <AlertDescription>
              {authError}
            </AlertDescription>
          </Alert>
        </div>
      )}
      {/* Fondo cyber */}
      <div className="absolute inset-0 cyber-grid opacity-10" />
      
      <div className="relative holographic rounded-lg p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getResourceTypeIcon(formData.resourceType)}
              <h2 className="font-mono text-2xl text-[#00f0ff] neon-text">
                {isEdit ? 'EDITAR CONTENIDO' : 'NUEVO CONTENIDO'}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="text-[#ff0040] hover:text-[#ff0040]/80 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="font-sans text-[#00ff88]/80">
            {isEdit 
              ? 'Modifica la información del contenido educativo'
              : 'Crea un nuevo recurso educativo para los estudiantes'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <label className="block font-mono text-[#00f0ff] text-sm">
              TÍTULO *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ingresa el título del contenido"
              className="w-full bg-black/50 border border-[#00f0ff]/30 rounded-lg px-4 py-3 font-sans text-white placeholder-[#00ff88]/50 focus:border-[#00f0ff] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/20 transition-all"
              maxLength={255}
            />
            {errors.title && (
              <p className="text-[#ff0040] text-sm font-sans">{errors.title}</p>
            )}
            <p className="text-[#00ff88]/60 text-xs font-mono">
              {formData.title.length}/255 caracteres
            </p>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="block font-mono text-[#00f0ff] text-sm">
              DESCRIPCIÓN BREVE
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe brevemente el contenido del recurso"
              className="w-full bg-black/50 border border-[#00f0ff]/30 rounded-lg px-4 py-3 font-sans text-white placeholder-[#00ff88]/50 focus:border-[#00f0ff] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/20 transition-all resize-none"
              rows={3}
              maxLength={1000}
            />
            {errors.description && (
              <p className="text-[#ff0040] text-sm font-sans">{errors.description}</p>
            )}
            <p className="text-[#00ff88]/60 text-xs font-mono">
              {formData.description.length}/1000 caracteres
            </p>
          </div>

          {/* Tipo de recurso */}
          <div className="space-y-2">
            <label className="block font-mono text-[#00f0ff] text-sm">
              TIPO DE RECURSO *
            </label>
            <div className="relative">
              <select
                value={formData.resourceType}
                onChange={(e) => handleInputChange('resourceType', e.target.value)}
                className="w-full bg-black/50 border border-[#00f0ff]/30 rounded-lg px-4 py-3 font-sans text-white focus:border-[#00f0ff] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/20 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-black text-white">Selecciona el tipo de recurso</option>
                <option value="pdf" className="bg-black text-white">📄 PDF</option>
                <option value="video" className="bg-black text-white">🎥 Video</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-[#00f0ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.resourceType && (
              <p className="text-[#ff0040] text-sm font-sans">{errors.resourceType}</p>
            )}
          </div>

          {/* URL del recurso */}
          <div className="space-y-2">
            <label className="block font-mono text-[#00f0ff] text-sm">
              {formData.resourceType === 'pdf' ? 'ENLACE DEL PDF' : 'ENLACE DEL VIDEO'} *
            </label>
            <input
              type="url"
              value={formData.resourceUrl}
              onChange={(e) => handleInputChange('resourceUrl', e.target.value)}
              placeholder={
                formData.resourceType === 'pdf' 
                  ? 'https://ejemplo.com/documento.pdf'
                  : 'https://youtube.com/watch?v=...'
              }
              className="w-full bg-black/50 border border-[#00f0ff]/30 rounded-lg px-4 py-3 font-sans text-white placeholder-[#00ff88]/50 focus:border-[#00f0ff] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/20 transition-all"
            />
            {errors.resourceUrl && (
              <p className="text-[#ff0040] text-sm font-sans">{errors.resourceUrl}</p>
            )}
            <p className="text-[#00ff88]/60 text-xs font-sans">
              Ingresa la URL completa del {formData.resourceType === 'pdf' ? 'archivo PDF' : 'video'}
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6 border-t border-[#00f0ff]/20">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#00f0ff] to-[#0080ff] text-black font-mono font-bold py-3 px-6 rounded-lg hover:from-[#00f0ff]/90 hover:to-[#0080ff]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 neon-glow"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  {isEdit ? 'ACTUALIZANDO...' : 'CREANDO...'}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Save className="h-4 w-4" />
                  {isEdit ? 'ACTUALIZAR' : 'CREAR'}
                </div>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-3 bg-black/50 border border-[#ff0040]/50 text-[#ff0040] font-mono rounded-lg hover:bg-[#ff0040]/10 hover:border-[#ff0040] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <div className="flex items-center justify-center gap-2">
                <X className="h-4 w-4" />
                CANCELAR
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}