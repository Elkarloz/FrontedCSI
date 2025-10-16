'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, ExternalLink, Calendar, User, Tag } from 'lucide-react'
import { contentAPI, Content as ApiContent } from '@/lib/api'

export function StudentContents() {
  const [contents, setContents] = useState<ApiContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [selectedContent, setSelectedContent] = useState<ApiContent | null>(null)

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await contentAPI.getAll({ limit: 50 })
        setContents(res.data.contents)
        // Seleccionar el primer contenido por defecto
        if (res.data.contents.length > 0) {
          setSelectedContent(res.data.contents[0])
        }
      } catch (e: any) {
        setError('No se pudieron cargar los contenidos')
      } finally {
        setLoading(false)
      }
    }
    fetchContents()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#00f0ff] mx-auto mb-4" />
        <p className="text-[#00ff88] font-mono">Cargando contenidos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 font-mono">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#00f0ff] font-mono neon-text mb-2">
          [CONTENIDOS DISPONIBLES]
        </h2>
        <p className="text-[#00ff88] font-mono">
          Materiales de estudio y recursos educativos
        </p>
      </div>

      {contents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#00ff88]/80 font-mono">
            Aún no hay contenidos disponibles.
          </p>
        </div>
      ) : (
        <div className="flex gap-6 h-[600px]">
          {/* Lista de contenidos - Lado izquierdo */}
          <div className="w-1/2 flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[#00f0ff] font-mono text-sm">
                {contents.length} contenido{contents.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {contents.map((content) => (
                <Card 
                  key={content.id} 
                  className={`bg-slate-900/30 border-[#00f0ff]/20 hover:bg-slate-900/40 hover:border-[#00f0ff]/40 transition-all duration-300 cursor-pointer ${
                    selectedContent?.id === content.id ? 'ring-2 ring-[#00f0ff]/50 bg-slate-900/50 border-[#00f0ff]/60' : ''
                  }`}
                  onClick={() => {
                    setSelectedContent(content)
                  }}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#00f0ff] font-mono text-sm line-clamp-2">
                      {content.title}
                    </CardTitle>
                    {content.content && (
                      <CardDescription className="text-[#00ff88]/80 font-mono text-xs line-clamp-3">
                        {content.content.substring(0, 100)}...
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Detalles del contenido - Lado derecho */}
          <div className="w-1/2 flex flex-col">
            {selectedContent ? (
              <Card className="bg-slate-900/30 border-[#00f0ff]/20 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-[#00f0ff] font-mono text-xl mb-2">
                    {selectedContent.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-[#00ff88] font-mono text-xs">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(selectedContent.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Admin
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto custom-scrollbar">
                  {selectedContent.description && (
                    <div className="mb-4">
                      <Label className="text-[#00f0ff] font-mono text-sm flex items-center mb-2">
                        <Tag className="h-3 w-3 mr-1" />
                        DESCRIPCIÓN
                      </Label>
                      <p className="text-[#00ff88] font-mono text-sm bg-slate-800/50 rounded p-3">
                        {selectedContent.description}
                      </p>
                    </div>
                  )}
                  
                  {selectedContent.content && (
                    <div className="mb-4">
                      <Label className="text-[#00f0ff] font-mono text-sm mb-2 block">
                        CONTENIDO
                      </Label>
                      <div className="text-[#00ff88]/90 font-mono text-sm bg-slate-800/50 rounded p-3 max-h-48 overflow-y-auto custom-scrollbar">
                        {selectedContent.content}
                      </div>
                    </div>
                  )}

                  {selectedContent.resourceUrl && (
                    <div className="mt-auto pt-4 border-t border-[#00f0ff]/20">
                      <Button
                        asChild
                        className="w-full bg-[#00f0ff] text-black hover:bg-[#00f0ff]/80 font-mono"
                      >
                        <a
                          href={selectedContent.resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>VER RECURSO EXTERNO</span>
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-900/30 border-[#00f0ff]/20 h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[#00ff88]/80 font-mono">
                    Selecciona un contenido para ver los detalles
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
