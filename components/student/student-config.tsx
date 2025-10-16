'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { authAPI } from '@/lib/api/auth'
import { toast } from 'sonner'
import { User, Mail, Calendar, Save } from 'lucide-react'

export function StudentConfig() {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Todos los campos son requeridos')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await authAPI.updateProfile({ name, email })

      if (response.success) {
        await refreshUser()
        toast.success('Perfil actualizado correctamente! 🎉')
        setIsEditing(false)
      } else {
        setError(response.message || 'Error al actualizar el perfil')
        toast.error('Error al actualizar perfil')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión con el servidor')
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    if (!name.trim() || !email.trim()) {
      setError('Todos los campos son requeridos')
      return false
    }

    if (name.length < 2 || name.length > 50) {
      setError('El nombre debe tener entre 2 y 50 caracteres')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un email válido')
      return false
    }

    return true
  }

  const handleEdit = () => {
    setError("")
    setIsEditing(true)
  }

  const handleCancel = () => {
    setName(user?.name || '')
    setEmail(user?.email || '')
    setError("")
    setIsEditing(false)
  }

  const handleInputChange = (field: 'name' | 'email', value: string) => {
    if (field === 'name') {
      setName(value)
    } else {
      setEmail(value)
    }
    setError("")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#00f0ff] font-mono neon-text mb-2">
          [CONFIGURACIÓN DE PERFIL]
        </h2>
        <p className="text-[#00ff88] font-mono">
          Gestiona tu información personal
        </p>
      </div>

      <Card className="bg-slate-900/30 border-[#00f0ff]/20 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-[#00f0ff] font-mono text-xl">
            INFORMACIÓN PERSONAL
          </CardTitle>
          <CardDescription className="text-[#00ff88] font-mono">
            Datos de tu cuenta estudiantil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 font-mono text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#00f0ff] font-mono text-sm">
                <User className="h-4 w-4 inline mr-2" />
                Nombre
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className="bg-black/50 border-[#00f0ff]/30 text-white font-mono disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#00f0ff] font-mono text-sm">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="bg-black/50 border-[#00f0ff]/30 text-white font-mono disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#00f0ff] font-mono text-sm">
                <Calendar className="h-4 w-4 inline mr-2" />
                Fecha de registro
              </Label>
              <Input
                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                disabled
                className="bg-black/50 border-[#00f0ff]/30 text-white font-mono disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#00f0ff] font-mono text-sm">
                Rol
              </Label>
              <Input
                value="Estudiante"
                disabled
                className="bg-black/50 border-[#00f0ff]/30 text-white font-mono disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                variant="outline"
                className="border-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/10 font-mono"
              >
                Editar Datos
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                  className="text-[#ff0040] hover:bg-[#ff0040]/10 font-mono"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/80 font-mono"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </>
            )}
          </div>

          <div className="mt-6 p-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg">
            <p className="text-[#00ff88] font-mono text-sm">
              <strong>Nota:</strong> Algunos cambios pueden requerir verificación. 
              Recibirás un email de confirmación después de guardar los cambios.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
