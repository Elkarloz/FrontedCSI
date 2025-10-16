"use client"

import { NeonButton } from "./neon-button"

interface ResultsModalProps {
  score: number
  totalQuestions: number
  level: string
  onRestart: () => void
  onBackToLevels: () => void
}

export function ResultsModal({ score, totalQuestions, level, onRestart, onBackToLevels }: ResultsModalProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const passed = percentage >= 60

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="holographic rounded-lg p-8 max-w-md w-full mx-4 scanlines">
        {/* Result header */}
        <div className="text-center mb-8">
          <h2
            className="font-mono text-3xl mb-4 neon-text"
            style={{
              color: passed ? "#00ff88" : "#ff0055",
            }}
          >
            {passed ? "[ MISIÓN COMPLETADA ]" : "[ MISIÓN FALLIDA ]"}
          </h2>

          {/* Score display */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full rotate-[-90deg]">
              <circle cx="96" cy="96" r="80" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke={passed ? "#00ff88" : "#ff0055"}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 80}`}
                strokeDashoffset={`${2 * Math.PI * 80 * (1 - percentage / 100)}`}
                className="transition-all duration-1000"
                style={{
                  filter: `drop-shadow(0 0 10px ${passed ? "#00ff88" : "#ff0055"})`,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-5xl text-white mb-2">{percentage}%</span>
              <span className="font-sans text-sm text-[#00f0ff]">
                {score} / {totalQuestions}
              </span>
            </div>
          </div>

          {/* Message */}
          <p className="font-sans text-lg text-white mb-2 leading-relaxed">
            {passed ? "¡Excelente trabajo, astronauta!" : "Necesitas más entrenamiento"}
          </p>
          <p className="font-mono text-xs text-[#00f0ff]">
            {passed ? "{ NIVEL DESBLOQUEADO }" : "{ INTENTA DE NUEVO }"}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-4">
          <NeonButton variant="accent" size="lg" onClick={onRestart} className="w-full">
            REINTENTAR
          </NeonButton>
          <NeonButton variant="primary" size="lg" onClick={onBackToLevels} className="w-full">
            VOLVER A NIVELES
          </NeonButton>
        </div>
      </div>
    </div>
  )
}
