'use client'

import { Starfield } from "@/components/starfield"
import { PlanetCard } from "@/components/planet-card"
import { BackButton } from "@/components/back-button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { LogOut, User, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

const planets = [
  {
    id: 1,
    name: "MERCURIO",
    description: "Nivel Básico",
    color: "from-[#ff00ff] to-[#b000ff]",
    questions: 5,
    difficulty: "FÁCIL",
  },
  {
    id: 2,
    name: "VENUS",
    description: "Nivel Intermedio",
    color: "from-[#00f0ff] to-[#0080ff]",
    questions: 7,
    difficulty: "MEDIO",
  },
  {
    id: 3,
    name: "MARTE",
    description: "Nivel Avanzado",
    color: "from-[#ff0055] to-[#ff8800]",
    questions: 10,
    difficulty: "DIFÍCIL",
  },
  {
    id: 4,
    name: "JÚPITER",
    description: "Nivel Experto",
    color: "from-[#00ff88] to-[#00ffff]",
    questions: 12,
    difficulty: "EXPERTO",
  },
]

export default function LevelsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  const handleGoToAdmin = () => {
    router.push('/admin')
  }

  return (
    <ProtectedRoute>
      <main className="relative min-h-screen overflow-hidden">
        <Starfield />

        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid opacity-20" />

        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Header with user info */}
          <div className="flex justify-between items-center mb-8">
            <BackButton />
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-slate-900/80 rounded-lg px-4 py-2 border border-cyan-500/20">
                  <User className="h-4 w-4 text-cyan-400" />
                  <span className="text-cyan-400 font-mono text-sm">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="text-[#ff00ff] font-mono text-xs font-bold uppercase">
                      [ADMIN]
                    </span>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/student')}
                  className="border-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] font-mono"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  PANEL DE ESTUDIANTE
                </Button>

                {user.role === 'admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGoToAdmin}
                    className="border-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] font-mono"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    ADMIN
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="text-center mb-16 scanlines">
            <h1 className="font-mono text-3xl md:text-5xl mb-4 neon-text text-[#00f0ff] leading-tight">
              SELECCIONA TU DESTINO
            </h1>
            <p className="font-sans text-base md:text-lg text-[#00ff88] leading-relaxed">
              {"> "} Cada planeta representa un nivel de dificultad {"<"}
            </p>
          </div>

          {/* Planets grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {planets.map((planet, index) => (
              <PlanetCard key={planet.id} planet={planet} index={index} />
            ))}
          </div>

          {/* HUD Progress */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="holographic rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#00f0ff]">PROGRESO TOTAL</span>
                <span className="font-mono text-xs text-[#ff00ff]">0 / 4 PLANETAS</span>
              </div>
              <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                <div className="h-full w-0 bg-gradient-to-r from-[#00f0ff] via-[#ff00ff] to-[#00ff88] transition-all duration-500" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
