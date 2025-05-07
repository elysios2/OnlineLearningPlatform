"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value: number
  showValue?: boolean
  showAnimation?: boolean
  color?: string
  label?: string
  size?: "sm" | "md" | "lg"
  animationDuration?: number
}

const AnimatedProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  AnimatedProgressProps
>(({ 
  className, 
  value, 
  showValue = false, 
  showAnimation = true,
  color,
  label,
  size = "md",
  animationDuration = 1.5,
  ...props 
}, ref) => {
  const [hasAnimated, setHasAnimated] = React.useState(false)
  
  React.useEffect(() => {
    // Only animate on first render
    if (!hasAnimated) {
      setHasAnimated(true)
    }
  }, [hasAnimated])

  const heightClass = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">{label}</span>
          {showValue && <span className="text-sm font-medium">{value}%</span>}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-secondary",
          heightClass[size],
          className
        )}
        {...props}
      >
        <motion.div
          className={cn(
            "h-full w-full flex-1 transition-all",
            color ? "" : "bg-primary"
          )}
          style={{ 
            originX: 0,
            backgroundColor: color,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value / 100 }}
          transition={{ 
            duration: showAnimation ? animationDuration : 0,
            ease: "easeOut"
          }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
})

AnimatedProgress.displayName = "AnimatedProgress"

export { AnimatedProgress }