/**
 * IngredientInput.tsx
 * Version: 1.0.1
 * Date: 2025-05-10
 * Changes:
 * - Vertically centered textarea and icon via flex container
 * - Removed textarea vertical padding for proper centering
 * - Ensured helper text wraps on mobile with whitespace-normal and break-words
 */

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

  useEffect(() => {
    const start = setTimeout(() => {
      setIsPulsing(true)
      const stop = setTimeout(() => setIsPulsing(false), 3000)
      return () => clearTimeout(stop)
    }, 1000)
    return () => clearTimeout(start)
  }, [])

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

  const FeatureBadges = () => (
    <div className="flex flex-wrap justify-center gap-2 mb-3">
      <span className="bg-recipe-green/10 text-recipe-green rounded-full px-3 py-1 text-xs font-medium">
        Ready in 30 mins
      </span>
      <span className="bg-recipe-blue/10 text-recipe-blue rounded-full px-3 py-1 text-xs font-medium">
        Easy cleanup
      </span>
      <span className="bg-recipe-orange/10 text-recipe-orange rounded-full px-3 py-1 text-xs font-medium">
        Ingredient-based
      </span>
    </div>
  )

  return (
    <div className="space-y-2 w-full max-w-full">
      <FeatureBadges />

      <label
        htmlFor="mainIngredient"
        className={cn(
          'block pb-1 text-left font-semibold text-recipe-blue',
          isMobile ? 'text-base' : 'text-lg'
        )}
      >
        What ingredients do you have today?
      </label>

      <div
        className={cn(
          'relative flex items-center rounded-xl shadow-md transition-all duration-300 w-full',
          isPulsing ? 'animate-pulse ring-2 ring-recipe-blue ring-opacity-50' : '',
          isFocused ? 'ring-2 ring-recipe-blue ring-opacity-100' : '',
          error ? 'ring-2 ring-red-500' : '',
          'bg-gradient-to-r from-white to-blue-50/70 dark:from-gray-900 dark:to-gray-800'
        )}
      >
        <Search className="absolute left-3 h-5 w-5 text-recipe-blue" />
        <Textarea
          id="mainIngredient"
          ref={textareaRef}
          placeholder="e.g., chicken thighs, pasta, bell peppers, onions..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={1}
          className={cn(
            isMobile ? 'min-h-[56px] text-base px-4' : 'min-h-[60px] text-lg px-4',
            'flex-1 text-left resize-none overflow-hidden transition-all bg-transparent border-2 rounded-xl w-full',
            'focus-within:border-recipe-blue placeholder:text-gray-500/80',
            error ? 'border-red-500' : 'border-gray-200 focus:border-recipe-blue'
          )}
          style={{ touchAction: 'manipulation' }}
        />
      </div>

      {error ? (
        <p className="text-xs text-left text-red-500 font-medium whitespace-normal break-words animate-fade-in">
          {error}
        </p>
      ) : (
        <p className="text-xs text-left text-recipe-blue font-medium whitespace-normal break-words">
          Tell us what you want to cook with!
        </p>
      )}
    </div>
  )
}
