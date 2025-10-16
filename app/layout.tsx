import type React from "react"
import { Press_Start_2P, Orbitron } from "next/font/google"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
})

export const metadata = {
  title: "Misión Espacial - Trivia Cósmica",
  description: "Juego de preguntas sobre el espacio con estética cyberpunk",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${pressStart.variable} ${orbitron.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            theme="dark"
            className="toaster group"
            offset={20}
            toastOptions={{
              duration: 4000,
              classNames: {
                toast: "group toast group-[.toaster]:bg-slate-900/95 group-[.toaster]:text-slate-50 group-[.toaster]:border-[#00f0ff]/30 group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-sm",
                description: "group-[.toast]:text-slate-300 group-[.toast]:font-mono group-[.toast]:text-sm",
                actionButton: "group-[.toast]:bg-[#00f0ff] group-[.toast]:text-black group-[.toast]:font-mono group-[.toast]:font-bold",
                cancelButton: "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-400 group-[.toast]:font-mono",
                title: "group-[.toast]:text-[#00f0ff] group-[.toast]:font-mono group-[.toast]:font-bold",
                error: "group-[.toast]:border-[#ff00ff]/50 group-[.toast]:bg-slate-900/95",
                success: "group-[.toast]:border-[#00ff88]/50 group-[.toast]:bg-slate-900/95",
                warning: "group-[.toast]:border-[#ff8800]/50 group-[.toast]:bg-slate-900/95",
                info: "group-[.toast]:border-[#00f0ff]/50 group-[.toast]:bg-slate-900/95"
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
