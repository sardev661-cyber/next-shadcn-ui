"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg"
}

const sizes: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label="Cargando"
      className={cn(
        "inline-flex animate-spin rounded-full border-2 border-current border-t-transparent text-current",
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
)
Spinner.displayName = "Spinner"

export { Spinner }
