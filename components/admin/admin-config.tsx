'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, User } from 'lucide-react'
import { toast } from 'sonner'
import { tokenUtils } from '@/lib/api/auth'
import { API_CONFIG } from '@/lib/api/config'

export function AdminConfig() {
  const { user, refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Todos los campos son requeridos')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const token = tokenUtils.getToken()
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        await refreshUser()
        toast.success('Perfil actualizado correctamente! 🎉')
      } else {
        setError(data.message || 'Error al actualizar el perfil')
        toast.error('Error al actualizar perfil')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión con el servidor')
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-slate-900/20 border-[#00f0ff]/30 backdrop-blur-md glow-border">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-[#00f0ff]" />
          </div>
          <CardTitle className="text-2xl text-[#00f0ff] font-mono neon-text">
            [CONFIGURACIÓN DE PERFIL]
          </CardTitle>
          <CardDescription className="text-[#00ff88] font-mono">
            Actualiza tus datos de administrador
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-[#00ff88] font-mono">
                NOMBRE COMPLETO
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-transparent border-[#00f0ff]/30 text-[#00f0ff] placeholder:text-[#00f0ff]/50 focus:border-[#00f0ff] focus:ring-[#00f0ff]/20 font-mono glow-border backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#00ff88] font-mono">
                EMAIL
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-transparent border-[#00f0ff]/30 text-[#00f0ff] placeholder:text-[#00f0ff]/50 focus:border-[#00f0ff] focus:ring-[#00f0ff]/20 font-mono glow-border backdrop-blur-sm"
              />
            </div>

            {error && (
              <Alert className="border-[#ff00ff]/50 bg-[#ff00ff]/10 backdrop-blur-sm">
                <AlertDescription className="text-[#ff00ff] font-mono">
                  [ERROR] {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#00f0ff] to-[#b000ff] hover:from-[#00ff88] hover:to-[#ff00ff] text-black font-mono font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed neon-text uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  [GUARDANDO...]
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  [GUARDAR CAMBIOS]
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-[#00f0ff]/20">
            <h3 className="text-sm font-bold text-[#00ff88] font-mono mb-2">[INFORMACIÓN DE CUENTA]</h3>
            <div className="space-y-1 text-sm font-mono">
              <p><span className="text-[#00f0ff]">ID:</span> <span className="text-white">{user?.id}</span></p>
              <p><span className="text-[#00f0ff]">ROL:</span> <span className="text-[#ff00ff] font-bold uppercase">{user?.role}</span></p>
              <p><span className="text-[#00f0ff]">REGISTRO:</span> <span className="text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}