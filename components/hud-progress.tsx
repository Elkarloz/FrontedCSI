"use client"

import { cn } from "@/lib/utils"

interface HUDProgressProps {
  currentQuestion: number
  totalQuestions: number
  score: number
  level: string
}

const levelNames: Record<string, string> = {
  "1": "MERCURIO",
  "2": "VENUS",
  "3": "MARTE",
  "4": "JÚPITER",
}

export function HUDProgress({ currentQuestion, totalQuestions, score, level }: HUDProgressProps) {
  const progress = (currentQuestion / totalQuestions) * 100

  return (
    <div className="max-w-4xl mx-auto">
      {/* Top HUD bar */}
      <div className="holographic rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4 font-mono text-xs">
          <div className="flex items-center gap-4">
            <span className="text-[#00f0ff]">
              {"[ NIVEL: "}
              {levelNames[level] || "DESCONOCIDO"}
              {" ]"}
            </span>
            <span className="text-[#ff00ff]">
              {"[ PREGUNTA: "}
              {currentQuestion}/{totalQuestions}
              {" ]"}
            </span>
          </div>
          <span className="text-[#00ff88]">
            {"[ PUNTOS: "}
            {score}
            {" ]"}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
          <div
            className={cn(
              "absolute inset-y-0 left-0 transition-all duration-500",
              "bg-gradient-to-r from-[#00f0ff] via-[#ff00ff] to-[#00ff88]",
              "shadow-[0_0_10px_currentColor]",
            )}
            style={{ width: `${progress}%` }}
          />

          {/* Animated scanline */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
        </div>
      </div>

      {/* Corner HUD elements */}
      <div className="flex justify-between font-mono text-xs text-[#00f0ff] opacity-60 mb-8">
        <span>{"[ SISTEMA: ACTIVO ]"}</span>
        <span>{"[ CONEXIÓN: ESTABLE ]"}</span>
      </div>
    </div>
  )
}
