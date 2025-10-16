"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Starfield } from "@/components/starfield"
import { NeonButton } from "@/components/neon-button"
import { authAPI } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function AuthPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      
      if (isLogin) {
        const response = await authAPI.login({ email, password })

        if (response.success && response.data) {
          const userData = response.data.user
          const token = response.data.token
          
          if (!userData || !token) {
            setError('Error en los datos de respuesta del servidor')
            return
          }
          
          // Actualizar contexto de auth y guardar token de forma centralizada
          login(userData, token)
          
          // Redirigir según el rol
          const userRole = userData.role
          
          if (userRole === "admin") {
            router.push("/admin")
          } else {
            router.push("/student")
          }
        } else {
          const errorMsg = response.message || "Error al iniciar sesión"
          setError(errorMsg)
        }
      } else {
        // Lógica de registro
        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden")
          return
        }

        const response = await authAPI.register({ name, email, password })

        if (response.success) {
          setError("")
          setIsLogin(true)
          setEmail("")
          setPassword("")
          setConfirmPassword("")
          setName("")
        } else {
          setError(response.message || "Error al registrarse")
        }
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Starfield />
      <div className="absolute inset-0 cyber-grid opacity-30" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="holographic rounded-lg p-8 scanlines">
          <h1 className="font-mono text-2xl md:text-3xl mb-2 neon-text text-[#00f0ff] text-center">
            {isLogin ? "INICIAR SESIÓN" : "REGISTRO"}
          </h1>
          <div className="h-0.5 w-32 mx-auto mb-8 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent glow-border" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block font-sans text-sm text-[#00ff88] mb-2">
                  {">"} NOMBRE
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-[#00f0ff]/30 rounded px-4 py-3 text-white font-sans focus:outline-none focus:border-[#00f0ff] transition-colors"
                  placeholder="Tu nombre"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block font-sans text-sm text-[#00ff88] mb-2">
                {">"} EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/50 border border-[#00f0ff]/30 rounded px-4 py-3 text-white font-sans focus:outline-none focus:border-[#00f0ff] transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-sans text-sm text-[#00ff88] mb-2">
                {">"} CONTRASEÑA
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-[#00f0ff]/30 rounded px-4 py-3 text-white font-sans focus:outline-none focus:border-[#00f0ff] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block font-sans text-sm text-[#00ff88] mb-2">
                  {">"} CONFIRMAR CONTRASEÑA
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-[#00f0ff]/30 rounded px-4 py-3 text-white font-sans focus:outline-none focus:border-[#00f0ff] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded p-3 text-red-400 text-sm font-sans">
                {error}
              </div>
            )}

            <NeonButton type="submit" className="w-full" disabled={loading}>
              {loading 
                ? (isLogin ? "ACCEDIENDO..." : "REGISTRANDO...") 
                : (isLogin ? "ACCEDER" : "REGISTRARSE")
              }
            </NeonButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#00f0ff]/60 font-sans text-sm">
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                  setEmail("")
                  setPassword("")
                  setConfirmPassword("")
                  setName("")
                }}
                className="text-[#ff00ff] hover:text-[#ff00ff]/80 transition-colors cursor-pointer"
              >
                {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-[#00ff88]/60 font-sans text-sm hover:text-[#00ff88] transition-colors">
              {"<"} Volver al inicio
            </Link>
          </div>
        </div>

        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#b000ff] opacity-20 blur-3xl float-animation" />
        <div
          className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#00ff88] opacity-20 blur-3xl float-animation"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </main>
  )
}