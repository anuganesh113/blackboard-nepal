import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  showLabel?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, showLabel = false, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))
    
    return (
      <div className={cn("relative", className)} ref={ref} {...props}>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {showLabel && (
            <span className="text-sm font-medium text-gray-700 min-w-[3ch]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }