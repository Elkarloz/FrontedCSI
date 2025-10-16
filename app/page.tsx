'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Starfield } from "@/components/starfield"
import { NeonButton } from "@/components/neon-button"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/student')
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto" />
          <p className="text-slate-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Starfield />

      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 scanlines">
        {/* Logo/Title */}
        <div className="mb-12">
          <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl mb-4 neon-text text-[#00f0ff] leading-tight">
            MISIÓN
          </h1>
          <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl mb-6 neon-text text-[#ff00ff] leading-tight">
            ESPACIAL
          </h1>
          <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-[#00ff88] to-transparent glow-border" />
        </div>

        {/* Subtitle */}
        <p className="font-sans text-lg md:text-xl text-[#00ff88] mb-12 max-w-2xl mx-auto leading-relaxed">
          {"> "} Explora el cosmos y demuestra tu conocimiento sobre el universo {"<"}
        </p>

        {/* Floating planet decoration */}
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#b000ff] to-[#ff00ff] opacity-20 blur-3xl float-animation" />
        <div
          className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#00ff88] opacity-20 blur-3xl float-animation"
          style={{ animationDelay: "1s" }}
        />

        {/* Start button */}
        <Link href="/auth">
          <NeonButton size="lg">COMENZAR MISIÓN</NeonButton>
        </Link>

        {/* HUD elements */}
        <div className="absolute top-8 left-8 font-mono text-xs text-[#00f0ff] opacity-60">{"[ SISTEMA: ONLINE ]"}</div>
        <div className="absolute top-8 right-8 font-mono text-xs text-[#00ff88] opacity-60">{"[ READY ]"}</div>
        <div className="absolute bottom-8 left-8 font-mono text-xs text-[#ff00ff] opacity-60">{"[ v2.0.77 ]"}</div>
      </div>
    </main>
  )
}
