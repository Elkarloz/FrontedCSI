'use client'

import { Starfield } from "@/components/starfield"
import { StudentPanel } from "@/components/student/student-panel"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function StudentPage() {
  return (
    <ProtectedRoute>
      <main className="relative min-h-screen overflow-hidden">
        <Starfield />
        
        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        <div className="relative z-10">
          <StudentPanel />
        </div>
      </main>
    </ProtectedRoute>
  )
}
