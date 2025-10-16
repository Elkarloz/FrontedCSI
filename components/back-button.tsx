"use client"

import { useRouter } from "next/navigation"
import { NeonButton } from "./neon-button"

export function BackButton() {
  const router = useRouter()

  return (
    <div className="mb-8">
      <NeonButton variant="primary" size="sm" onClick={() => router.back()}>
        {"<"} VOLVER
      </NeonButton>
    </div>
  )
}
