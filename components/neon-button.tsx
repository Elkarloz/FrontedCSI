import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "accent"
  size?: "sm" | "md" | "lg"
}

export function NeonButton({ children, variant = "primary", size = "md", className, ...props }: NeonButtonProps) {
  const variants = {
    primary: "bg-[#00f0ff] text-black hover:bg-[#00d0dd] shadow-[0_0_20px_#00f0ff]",
    secondary: "bg-[#ff00ff] text-black hover:bg-[#dd00dd] shadow-[0_0_20px_#ff00ff]",
    accent: "bg-[#00ff88] text-black hover:bg-[#00dd77] shadow-[0_0_20px_#00ff88]",
  }

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  }

  return (
    <button
      className={cn(
        "font-mono font-bold uppercase tracking-wider transition-all duration-300",
        "border-2 border-current",
        "hover:scale-105 active:scale-95",
        "relative overflow-hidden cursor-pointer",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300" />
    </button>
  )
}
