"use client"

import { cn } from "@/lib/utils"

interface Question {
  question: string
  options: string[]
  correct: number
}

interface QuestionCardProps {
  question: Question
  questionNumber: number
  onAnswer: (index: number) => void
  selectedAnswer: number | null
  showResult: boolean
  isCorrect: boolean
}

export function QuestionCard({
  question,
  questionNumber,
  onAnswer,
  selectedAnswer,
  showResult,
  isCorrect,
}: QuestionCardProps) {
  return (
    <div className="holographic rounded-lg p-8 scanlines">
      {/* Question number */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-sm text-[#00f0ff]">
          {"[ PREGUNTA #"}
          {questionNumber}
          {" ]"}
        </span>
        {showResult && (
          <span className={cn("font-mono text-sm", isCorrect ? "text-[#00ff88]" : "text-[#ff0055]")}>
            {isCorrect ? "[ CORRECTO ]" : "[ INCORRECTO ]"}
          </span>
        )}
      </div>

      {/* Question text */}
      <h2 className="font-sans text-2xl md:text-3xl mb-8 text-white leading-relaxed text-balance">
        {question.question}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrectAnswer = index === question.correct
          const showCorrect = showResult && isCorrectAnswer
          const showWrong = showResult && isSelected && !isCorrect

          return (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              disabled={selectedAnswer !== null}
              className={cn(
                "p-6 rounded-lg border-2 transition-all duration-300",
                "font-sans text-left text-lg",
                "hover:scale-105 active:scale-95",
                "cursor-pointer disabled:cursor-not-allowed",
                {
                  "border-[#00f0ff] bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20": !isSelected && !showResult,
                  "border-[#00ff88] bg-[#00ff88]/20 shadow-[0_0_20px_#00ff88]": showCorrect,
                  "border-[#ff0055] bg-[#ff0055]/20 shadow-[0_0_20px_#ff0055]": showWrong,
                  "border-[#ff00ff] bg-[#ff00ff]/10": isSelected && !showResult,
                },
              )}
            >
              <span className="font-mono text-xs text-[#00f0ff] block mb-2">
                {"[ "}
                {String.fromCharCode(65 + index)}
                {" ]"}
              </span>
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
