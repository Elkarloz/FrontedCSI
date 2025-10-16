'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Video, 
  ExternalLink, 
  Loader2, 
  Save, 
  X,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { tokenUtils } from '@/lib/api/auth'

interface Content {
  id: number
  title: string
  description: string
  resourceType: 'pdf' | 'video'
  resourceUrl: string
  createdBy: number
  creatorName: string
  createdAt: string
  updatedAt: string
}

interface ContentFormData {
  title: string
  description: string
  resourceType: 'pdf' | 'video' | ''
  resourceUrl: string
}

export function AdminContents() {
  const [contents, setContents] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    resourceType: '',
    resourceUrl: ''
  })

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const token = tokenUtils.getToken()
      const response = await fetch('http://localhost:5000/api/contents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setContents(data.data.contents)
      }
    } catch (error) {
      console.error('Error fetching contents:', error)
      toast.error('Error al cargar contenidos')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      resourceType: '',
      resourceUrl: ''
    })
    setEditingContent(null)
    setShowForm(false)
    setError('')
  }

  const handleEdit = (content: Content) => {
    setEditingContent(content)
    setFormData({
      title: content.title,
      description: content.description,
      resourceType: content.resourceType,
      resourceUrl: content.resourceUrl
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.resourceType || !formData.resourceUrl.trim()) {
      setError('Título, tipo de recurso y URL son requeridos')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const token = tokenUtils.getToken()
      const url = editingContent 
        ? `http://localhost:5000/api/contents/${editingContent.id}`
        : 'http://localhost:5000/api/contents'
      
      const method = editingContent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingContent ? 'Contenido actualizado! 🎉' : 'Contenido creado! 🎉')
        resetForm()
        fetchContents()
      } else {
        setError(data.message || 'Error al procesar la solicitud')
        toast.error('Error al guardar contenido')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión con el servidor')
      toast.error('Error de conexión')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
      return
    }

    try {
      const token = tokenUtils.getToken()
      const response = await fetch(`http://localhost:5000/api/contents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Contenido eliminado correctamente')
        fetchContents()
      } else {
        toast.error('Error al eliminar contenido')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión')
    }
  }

  const handleInputChange = (field: keyof ContentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin border-2 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de crear */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#00f0ff] font-mono">GESTIÓN DE CONTENIDOS</h2>
          <p className="text-[#00ff88] font-mono text-sm">Total: {contents.length} contenidos</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#00f0ff] to-[#b000ff] hover:from-[#00ff88] hover:to-[#ff00ff] text-black font-mono font-bold"
        >
          <Plus className="h-4 w-4 mr-2" />
          NUEVO CONTENIDO
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <Card className="bg-slate-900/20 border-[#00f0ff]/30 backdrop-blur-md glow-border">
          <CardHeader>
            <CardTitle className="text-[#00f0ff] font-mono">
              {editingContent ? '[EDITAR CONTENIDO]' : '[NUEVO CONTENIDO]'}
            </CardTitle>
            <CardDescription className="text-[#00ff88] font-mono">
              {editingContent ? 'Modifica los datos del contenido' : 'Agrega un nuevo recurso educativo'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-[#00ff88] font-mono">
                  TÍTULO *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Título del contenido"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-transparent border-[#00f0ff]/30 text-[#00f0ff] placeholder:text-[#00f0ff]/50 focus:border-[#00f0ff] focus:ring-[#00f0ff]/20 font-mono glow-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-[#00ff88] font-mono">
                  DESCRIPCIÓN
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descripción del contenido..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-transparent border-[#00f0ff]/30 text-[#00f0ff] placeholder:text-[#00f0ff]/50 focus:border-[#00f0ff] focus:ring-[#00f0ff]/20 font-mono glow-border"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#00ff88] font-mono">
                  TIPO DE RECURSO *
                </Label>
                <Select value={formData.resourceType} onValueChange={(value) => handleInputChange('resourceType', value)}>
                  <SelectTrigger className="bg-transparent border-[#00f0ff]/30 text-[#00f0ff] focus:border-[#00f0ff] focus:ring-[#00f0ff]/20 font-mono glow-border">
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-[#00f0ff]/30">
                    <SelectItem value="pdf" className="text-[#00f0ff] font-mono">PDF</SelectItem>
                    <SelectItem value="video" className="text-[#00f0ff] font-mono">VIDEO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm font-medium text-[#00ff88] font-mono">
                  URL DEL RECURSO *
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://ejemplo.com/recurso"
                  value={formData.resourceUrl}
                  onChange={(e) => handleInputChange('resourceUrl', e.target.value)}
                  className="bg-transparent border-[#00f0ff]/30 text-[#00f0ff] placeholder:text-[#00f0ff]/50 focus:border-[#00f0ff] focus:ring-[#00f0ff]/20 font-mono glow-border"
                />
              </div>

              {error && (
                <Alert className="border-[#ff00ff]/50 bg-[#ff00ff]/10 backdrop-blur-sm">
                  <AlertDescription className="text-[#ff00ff] font-mono">
                    [ERROR] {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#00f0ff] to-[#b000ff] hover:from-[#00ff88] hover:to-[#ff00ff] text-black font-mono font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      GUARDANDO...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingContent ? 'ACTUALIZAR' : 'CREAR'}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                  className="text-[#00f0ff] hover:bg-[#00f0ff]/10 font-mono"
                >
                  <X className="mr-2 h-4 w-4" />
                  CANCELAR
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de contenidos */}
      <div className="space-y-4">
        {contents.length > 0 ? (
          contents.map((content) => (
            <Card key={content.id} className="bg-slate-900/20 border-[#00f0ff]/30 backdrop-blur-md glow-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-white font-mono">{content.title}</h3>
                      <Badge 
                        variant={content.resourceType === 'pdf' ? 'default' : 'secondary'}
                        className={`font-mono ${
                          content.resourceType === 'pdf' 
                            ? 'bg-[#ff00ff]/20 text-[#ff00ff] border-[#ff00ff]/50' 
                            : 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/50'
                        }`}
                      >
                        {content.resourceType === 'pdf' ? <FileText className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                        {content.resourceType.toUpperCase()}
                      </Badge>
                    </div>
                    {content.description && (
                      <p className="text-[#00ff88] font-mono text-sm mb-2">{content.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono">
                      <span>Creado por: {content.creatorName}</span>
                      <span>•</span>
                      <span>{new Date(content.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(content.resourceUrl, '_blank')}
                      className="text-[#00f0ff] hover:bg-[#00f0ff]/10"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(content.resourceUrl, '_blank')}
                      className="text-[#00f0ff] hover:bg-[#00f0ff]/10"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(content)}
                      className="text-[#00ff88] hover:bg-[#00ff88]/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(content.id)}
                      className="text-[#ff00ff] hover:bg-[#ff00ff]/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-slate-900/20 border-[#00f0ff]/30 backdrop-blur-md glow-border">
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-[#00f0ff]/50 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#00f0ff] font-mono mb-2">NO HAY CONTENIDOS</h3>
              <p className="text-[#00ff88] font-mono mb-4">Crea el primer contenido para comenzar</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-[#00f0ff] to-[#b000ff] hover:from-[#00ff88] hover:to-[#ff00ff] text-black font-mono font-bold"
              >
                <Plus className="h-4 w-4 mr-2" />
                CREAR PRIMER CONTENIDO
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}