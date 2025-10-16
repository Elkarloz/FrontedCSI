"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface Planet {
  id: number
  name: string
  description: string
  color: string
  questions: number
  difficulty: string
}

interface PlanetCardProps {
  planet: Planet
  index: number
}

export function PlanetCard({ planet, index }: PlanetCardProps) {
  return (
    <Link href={`/quiz/${planet.id}`}>
      <div className="group relative float-animation cursor-pointer" style={{ animationDelay: `${index * 0.2}s` }}>
        {/* Planet sphere */}
        <div
          className={cn(
            "relative w-48 h-48 mx-auto mb-6 rounded-full",
            "bg-gradient-to-br",
            planet.color,
            "shadow-2xl",
            "transition-all duration-500",
            "group-hover:scale-110",
            "rotate-slow",
          )}
        >
          {/* Glow effect */}
          <div className={cn("absolute inset-0 rounded-full blur-xl opacity-50", "bg-gradient-to-br", planet.color)} />

          {/* Ring effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-16 border-2 border-current rounded-full opacity-30 rotate-[60deg]" />
        </div>

        {/* Info card */}
        <div className="holographic rounded-lg p-6 text-center transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]">
          <h3 className="font-mono text-xl mb-2 text-[#00f0ff] neon-text">{planet.name}</h3>
          <p className="font-sans text-sm text-[#00ff88] mb-4">{planet.description}</p>

          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#ff00ff]">{planet.questions} PREGUNTAS</span>
            <span className="text-[#00f0ff]">{planet.difficulty}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
