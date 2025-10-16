"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Starfield } from "@/components/starfield"
import { QuestionCard } from "@/components/question-card"
import { HUDProgress } from "@/components/hud-progress"
import { ResultsModal } from "@/components/results-modal"

// Sample questions database
const questionsDB: Record<string, any[]> = {
  "1": [
    {
      question: "¿Cuál es el planeta más cercano al Sol?",
      options: ["Venus", "Mercurio", "Marte", "Tierra"],
      correct: 1,
    },
    {
      question: "¿Cuántos planetas hay en el Sistema Solar?",
      options: ["7", "8", "9", "10"],
      correct: 1,
    },
    {
      question: "¿Qué planeta es conocido como el planeta rojo?",
      options: ["Venus", "Júpiter", "Marte", "Saturno"],
      correct: 2,
    },
    {
      question: "¿Cuál es la estrella más cercana a la Tierra?",
      options: ["Sirio", "Alfa Centauri", "El Sol", "Betelgeuse"],
      correct: 2,
    },
    {
      question: "¿Qué planeta tiene anillos visibles?",
      options: ["Júpiter", "Saturno", "Urano", "Neptuno"],
      correct: 1,
    },
  ],
  "2": [
    {
      question: "¿Cuántas lunas tiene Marte?",
      options: ["1", "2", "3", "4"],
      correct: 1,
    },
    {
      question: "¿Qué es una supernova?",
      options: ["Una estrella nueva", "La explosión de una estrella", "Un planeta gigante", "Un cometa"],
      correct: 1,
    },
  ],
  "3": [
    {
      question: "¿Qué es un agujero negro?",
      options: [
        "Un planeta oscuro",
        "Una región del espacio con gravedad extrema",
        "Una estrella apagada",
        "Un cometa",
      ],
      correct: 1,
    },
  ],
  "4": [
    {
      question: "¿Qué es la materia oscura?",
      options: ["Materia que no emite luz", "Polvo espacial", "Planetas sin atmósfera", "Estrellas muertas"],
      correct: 0,
    },
  ],
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const level = params.level as string

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showFinalResults, setShowFinalResults] = useState(false)

  const questions = questionsDB[level] || questionsDB["1"]
  const totalQuestions = questions.length

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    const correct = answerIndex === questions[currentQuestion].correct
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setShowFinalResults(true)
      }
    }, 2000)
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Starfield />

      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* HUD Progress */}
        <HUDProgress
          currentQuestion={currentQuestion + 1}
          totalQuestions={totalQuestions}
          score={score}
          level={level}
        />

        {/* Question Card */}
        <div className="mt-12 max-w-4xl mx-auto">
          <QuestionCard
            question={questions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            isCorrect={isCorrect}
          />
        </div>
      </div>

      {/* Results Modal */}
      {showFinalResults && (
        <ResultsModal
          score={score}
          totalQuestions={totalQuestions}
          level={level}
          onRestart={() => {
            setCurrentQuestion(0)
            setScore(0)
            setSelectedAnswer(null)
            setShowResult(false)
            setShowFinalResults(false)
          }}
          onBackToLevels={() => router.push("/levels")}
        />
      )}
    </main>
  )
}
