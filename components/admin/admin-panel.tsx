'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, FileText, LogOut, ArrowLeft } from 'lucide-react'
import { AdminConfig } from './admin-config'
import { AdminContents } from './admin-contents'
import { useRouter } from 'next/navigation'

type AdminSection = 'dashboard' | 'config' | 'contents'

export function AdminPanel() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard')
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'admin'
  console.log('[admin-panel] user:', user, 'isAdmin?', isAdmin)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth')
  }

  const handleBackToLevels = () => {
    router.push('/levels')
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'config':
        return <AdminConfig />
      case 'contents':
        return isAdmin ? <AdminContents /> : (
          <div className="text-center py-12">
            <p className="text-[#00ff88] font-mono">No tienes permisos para gestionar contenidos.</p>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#00f0ff] font-mono neon-text mb-2">
                [PANEL DE ADMINISTRACIÓN]
              </h2>
              <p className="text-[#00ff88] font-mono">
                Bienvenido, {user?.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card 
                className="bg-slate-900/20 border-[#00f0ff]/30 backdrop-blur-md glow-border cursor-pointer hover:bg-slate-900/30 transition-all duration-300 h-48"
                onClick={() => setActiveSection('config')}
              >
                <CardHeader className="text-center h-full flex flex-col justify-center">
                  <Settings className="h-16 w-16 text-[#00f0ff] mx-auto mb-4" />
                  <CardTitle className="text-[#00f0ff] font-mono text-xl">CONFIGURACIÓN</CardTitle>
                  <CardDescription className="text-[#00ff88] font-mono">
                    Gestionar datos del perfil
                  </CardDescription>
                </CardHeader>
              </Card>
              {isAdmin && (
                <Card 
                  className="bg-slate-900/20 border-[#00f0ff]/30 backdrop-blur-md glow-border cursor-pointer hover:bg-slate-900/30 transition-all duration-300 h-48"
                  onClick={() => setActiveSection('contents')}
                >
                  <CardHeader className="text-center h-full flex flex-col justify-center">
                    <FileText className="h-16 w-16 text-[#00f0ff] mx-auto mb-4" />
                    <CardTitle className="text-[#00f0ff] font-mono text-xl">CONTENIDOS TEÓRICOS</CardTitle>
                    <CardDescription className="text-[#00ff88] font-mono">
                      CRUD de recursos educativos
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {activeSection !== 'dashboard' && (
              <Button
                variant="ghost"
                onClick={() => setActiveSection('dashboard')}
                className="text-[#00f0ff] hover:bg-[#00f0ff]/10 font-mono"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                VOLVER
              </Button>
            )}
            <h1 className="text-xl font-bold text-[#00ff88] font-mono">
              {activeSection === 'dashboard' && '[ADMIN DASHBOARD]'}
              {activeSection === 'config' && '[CONFIGURACIÓN]'}
              {activeSection === 'contents' && '[GESTIÓN DE CONTENIDOS]'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="font-mono"
            >
              <LogOut className="h-4 w-4 mr-2" />
              CERRAR SESIÓN
            </Button>
            
            <Button
              onClick={handleBackToLevels}
              variant="outline"
              className="border-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/10 font-mono"
            >
              IR A NIVELES
            </Button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="bg-slate-900/10 backdrop-blur-md rounded-lg border border-[#00f0ff]/20 p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  )
}