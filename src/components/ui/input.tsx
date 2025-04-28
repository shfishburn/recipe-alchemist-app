
import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // You can add additional props here if needed
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onFocus, onBlur, onChange, onKeyDown, ...props }, ref) => {
    // Enhanced input handlers with stopPropagation to prevent event bubbling
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (onBlur) onBlur(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (onChange) onChange(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle specific keyboard events, but don't stop propagation for all
      // Only stop for Tab, as we want Enter and Escape to bubble up in forms
      if (e.key === 'Tab') {
        e.stopPropagation();
      }
      
      if (onKeyDown) onKeyDown(e);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-recipe-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200 truncate",
          className
        )}
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
