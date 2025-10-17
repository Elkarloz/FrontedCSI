'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart, 
  Users, 
  FileText, 
  TrendingUp, 
  Video, 
  UserCheck, 
  RefreshCw,
  Calendar 
} from 'lucide-react'
import { getDashboard } from '@/lib/admin-api'
import { toast } from 'sonner'
import { tokenUtils } from '@/lib/api/auth'
import { API_CONFIG } from '@/lib/api/config'

interface DashboardStats {
  totalUsers: number
  totalContents: number
  adminUsers: number
  studentUsers: number
}

interface RecentContent {
  id: number
  title: string
  description: string
  resourceType: 'pdf' | 'video'
  creatorName: string
  createdAt: string
}



export function AdminStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentContents, setRecentContents] = useState<RecentContent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = tokenUtils.getToken()
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setStats(data.data.stats)
        setRecentContents(data.data.recentContents)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
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
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/20 border-[#00f0ff]/30 backdrop-blur-md glow-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#00ff88] font-mono">USUARIOS TOTALES</CardTitle>
            <Users className="h-4 w-4 text-[#00f0ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00f0ff] font-mono">{stats?.totalUsers || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/20 border-[#00f0ff]/30 backdrop-blur-md glow-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#00ff88] font-mono">CONTENIDOS</CardTitle>
            <FileText className="h-4 w-4 text-[#00f0ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00f0ff] font-mono">{stats?.totalContents || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/20 border-[#00f0ff]/30 backdrop-blur-md glow-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#00ff88] font-mono">ADMINISTRADORES</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#00f0ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00f0ff] font-mono">{stats?.adminUsers || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/20 border-[#00f0ff]/30 backdrop-blur-md glow-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#00ff88] font-mono">ESTUDIANTES</CardTitle>
            <BarChart className="h-4 w-4 text-[#00f0ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00f0ff] font-mono">{stats?.studentUsers || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Contenidos recientes */}
      <Card className="bg-slate-900/20 border-[#00f0ff]/30 backdrop-blur-md glow-border">
        <CardHeader>
          <CardTitle className="text-[#00f0ff] font-mono">[CONTENIDOS RECIENTES]</CardTitle>
          <CardDescription className="text-[#00ff88] font-mono">
            Últimos contenidos creados en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentContents.length > 0 ? (
            <div className="space-y-3">
              {recentContents.map((content) => (
                <div 
                  key={content.id}
                  className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-[#00f0ff]/20"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-white font-mono">{content.title}</h4>
                    <p className="text-sm text-[#00ff88] font-mono">
                      Creado por: {content.creatorName} • {new Date(content.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <Badge 
                    variant={content.resourceType === 'pdf' ? 'default' : 'secondary'}
                    className={`font-mono ${
                      content.resourceType === 'pdf' 
                        ? 'bg-[#ff00ff]/20 text-[#ff00ff] border-[#ff00ff]/50' 
                        : 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/50'
                    }`}
                  >
                    {content.resourceType.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-[#00f0ff]/50 mx-auto mb-4" />
              <p className="text-[#00ff88] font-mono">No hay contenidos recientes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}