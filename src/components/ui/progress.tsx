
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor?: string;
  indicatorClassName?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  showLabel?: boolean;
  label?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ 
  className, 
  value = 0, 
  indicatorColor, 
  indicatorClassName,
  showValue = false,
  valueFormatter,
  showLabel = false,
  label,
  ...props 
}, ref) => {
  // Ensure value is a number and within valid range
  const safeValue = typeof value === 'number' && !isNaN(value) ? 
    Math.max(0, Math.min(100, value)) : 
    0;
  
  // Format value for display
  const formattedValue = valueFormatter 
    ? valueFormatter(safeValue) 
    : `${Math.round(safeValue)}%`;

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          {showValue && <span className="font-medium">{formattedValue}</span>}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
          className
        )}
        value={safeValue}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full transition-all",
            indicatorClassName
          )}
          style={{ 
            width: `${safeValue}%`,
            ...(indicatorColor ? { backgroundColor: indicatorColor } : { backgroundColor: "hsl(var(--primary))" })
          }}
        />
        {!showLabel && showValue && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-medium">
            {formattedValue}
          </div>
        )}
      </ProgressPrimitive.Root>
    </div>
  );
})

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
