'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, Clock, Star, Trophy, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const exercises = [
  {
    id: 1,
    title: "MERCURIO - Quiz Básico",
    description: "Preguntas fundamentales sobre astronomía básica",
    difficulty: "FÁCIL",
    questions: 15,
    estimatedTime: "10 min",
    completed: true,
    score: 85,
    color: "from-[#ff00ff] to-[#b000ff]"
  },
  {
    id: 2,
    title: "VENUS - Quiz Intermedio",
    description: "Conceptos intermedios de astronomía planetaria",
    difficulty: "MEDIO",
    questions: 20,
    estimatedTime: "15 min",
    completed: false,
    score: null,
    color: "from-[#00f0ff] to-[#0080ff]"
  },
  {
    id: 3,
    title: "MARTE - Challenge Avanzado",
    description: "Desafíos avanzados sobre el planeta rojo",
    difficulty: "DIFÍCIL",
    questions: 25,
    estimatedTime: "20 min",
    completed: false,
    score: null,
    color: "from-[#ff0055] to-[#ff8800]"
  },
  {
    id: 4,
    title: "JÚPITER - Master Quiz",
    description: "Master quiz sobre el gigante gaseoso",
    difficulty: "EXPERTO",
    questions: 30,
    estimatedTime: "25 min",
    completed: false,
    score: null,
    color: "from-[#00ff88] to-[#00ffff]"
  }
]

const difficultyColors = {
  "FÁCIL": "bg-green-500/20 text-green-400 border-green-500/30",
  "MEDIO": "bg-blue-500/20 text-blue-400 border-blue-500/30", 
  "DIFÍCIL": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "EXPERTO": "bg-red-500/20 text-red-400 border-red-500/30"
}

export function StudentExercises() {
  const router = useRouter()

  const handleStartExercise = (exerciseId: number, difficulty: string) => {
    const difficultyMap = {
      "FÁCIL": "1",
      "MEDIO": "2", 
      "DIFÍCIL": "3",
      "EXPERTO": "4"
    }
    const level = difficultyMap[difficulty as keyof typeof difficultyMap]
    router.push(`/quiz/${level}`)
  }

  const completedCount = exercises.filter(e => e.completed).length
  const totalExercises = exercises.length

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#00f0ff] font-mono neon-text mb-2">
          [EJERCICIOS Y QUIZZES]
        </h2>
        <p className="text-[#00ff88] font-mono">
          Practica y evalúa tus conocimientos
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-slate-900/30 border-[#00f0ff]/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-mono text-[#00f0ff]">PROGRESO GENERAL</h3>
            <Badge 
              variant="outline" 
              className="bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30 font-mono"
            >
              {completedCount}/{totalExercises} COMPLETADOS
            </Badge>
          </div>
          <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00f0ff] via-[#ff00ff] to-[#00ff88] transition-all duration-500"
              style={{ width: `${(completedCount / totalExercises) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise) => (
          <Card 
            key={exercise.id} 
            className={`bg-slate-900/30 border-[#00f0ff]/20 hover:bg-slate-900/40 transition-all duration-300 ${
              exercise.completed ? 'ring-2 ring-[#00ff88]/30' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-[#00f0ff] font-mono text-lg mb-2">
                    {exercise.title}
                  </CardTitle>
                  <CardDescription className="text-[#00ff88] font-mono mb-3">
                    {exercise.description}
                  </CardDescription>
                </div>
                {exercise.completed && (
                  <div className="flex items-center space-x-1 bg-[#00ff88]/20 rounded-full px-2 py-1">
                    <Star className="h-3 w-3 text-[#00ff88]" />
                    <span className="text-[#00ff88] font-mono text-xs">COMPLETADO</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <Badge className={difficultyColors[exercise.difficulty as keyof typeof difficultyColors]}>
                  {exercise.difficulty}
                </Badge>
                <Badge variant="outline" className="text-[#00f0ff] border-[#00f0ff]/30 text-xs">
                  {exercise.questions} preguntas
                </Badge>
                <div className="flex items-center text-[#00ff88] text-xs font-mono">
                  <Clock className="h-3 w-3 mr-1" />
                  {exercise.estimatedTime}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {exercise.completed ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#00ff88] font-mono text-sm">Última puntuación:</span>
                    <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30">
                      <Trophy className="h-3 w-3 mr-1" />
                      {exercise.score}%
                    </Badge>
                  </div>
                  <Button
                    onClick={() => handleStartExercise(exercise.id, exercise.difficulty)}
                    variant="outline"
                    className="w-full border-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/10 font-mono"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    REPETIR EJERCICIO
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleStartExercise(exercise.id, exercise.difficulty)}
                  className="w-full bg-gradient-to-r from-[#00f0ff] to-[#00ff88] text-black hover:opacity-80 font-mono transition-all duration-300"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  COMENZAR EJERCICIO
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
