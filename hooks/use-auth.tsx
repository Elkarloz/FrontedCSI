'use client'

import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { User, tokenUtils, authAPI } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  const login = (userData: User, token: string) => {
    console.log('[auth] login() llamado con:', { userData, token: !!token })
    setUser(userData)
    tokenUtils.saveToken(token)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    tokenUtils.removeToken()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
  }

  const refreshUser = async () => {
    try {
      const token = tokenUtils.getToken()
      console.log('[auth] refreshUser token?', token)
      const localUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      console.log('[auth] localStorage user:', localUser)
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await authAPI.verifyToken(token)
      console.log('[auth] verifyToken response', response)
      if (response.success && response.data) {
        const verifiedUser = response.data.user
        console.log('[auth] verified user:', verifiedUser, 'role:', verifiedUser.role)
        setUser(verifiedUser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(verifiedUser))
        }
      } else {
        // Token inválido, limpiar
        console.log('[auth] Token inválido, cerrando sesión')
        logout()
      }
    } catch (error) {
      console.log('[auth] Error en refreshUser:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}