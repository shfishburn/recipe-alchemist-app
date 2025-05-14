
import React, { useRef, useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Search } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface IngredientInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function IngredientInput({ value, onChange, error }: IngredientInputProps) {
  const isMobile = useIsMobile()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isPulsing, setIsPulsing] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      requestAnimationFrame(() => {
        if (!textareaRef.current) return
        textareaRef.current.style.height = 'auto'
        const minHeight = isMobile ? '56px' : '60px'
        const scrollHeight = textareaRef.current.scrollHeight
        textareaRef.current.style.height = `${Math.max(parseInt(minHeight), scrollHeight)}px`
      })
    }
  }, [value, isMobile])

  // Initial attraction animation
  useEffect(() => {
    const start = setTimeout(() => {
      setIsPulsing(true)
      const stop = setTimeout(() => setIsPulsing(false), 3000)
      return () => clearTimeout(stop)
    }, 1000)
    return () => clearTimeout(start)
  }, [])

  return (
    <div className="space-y-2 w-full max-w-full">
      {/* Label with two-part styling */}
      <div className="flex flex-col mb-2">
        <label htmlFor="mainIngredient" className="text-sm font-medium text-foreground mb-1">
          Enter your ingredients
        </label>
        <span className="text-xs text-muted-foreground">
          What do you want to cook with today?
        </span>
      </div>

      {/* Material input container */}
      <div
        className={cn(
          'relative flex items-center rounded-md overflow-hidden transition-all duration-300 w-full',
          'bg-background',
          'shadow-elevation-1 hover:shadow-elevation-2',
          isPulsing ? 'animate-pulse ring-2 ring-primary ring-opacity-50' : '',
          isFocused ? 'ring-2 ring-primary' : '',
          error ? 'ring-2 ring-destructive' : '',
        )}
      >
        {/* Search icon with Material positioning */}
        <Search 
          className="absolute left-3 h-5 w-5 text-primary" 
          aria-hidden="true" 
        />
        
        {/* Textarea with Material styling */}
        <Textarea
          id="mainIngredient"
          ref={textareaRef}
          placeholder="e.g., chicken curry: chicken, curry paste, coconut milk"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={1}
          className={cn(
            isMobile ? 'min-h-[56px] text-base' : 'min-h-[60px] text-lg',
            'flex-1 text-left resize-none overflow-hidden transition-all bg-transparent border-0 rounded-none w-full',
            'focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
            'placeholder:text-muted-foreground/80',
            'pl-10 pr-4 py-3'
          )}
          style={{ touchAction: 'manipulation' }}
        />

        {/* Input focus indicator for Material ripple effect */}
        {isFocused && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-scale-x" />
        )}
      </div>

      {/* Error message with Material styling */}
      {error && (
        <p className="text-sm text-destructive font-medium mt-1 animate-fade-in">{error}</p>
      )}

      {/* Helper text with Material styling */}
      <p className="text-xs text-muted-foreground mt-1">
        List your main ingredients separated by commas
      </p>
    </div>
  )
}
