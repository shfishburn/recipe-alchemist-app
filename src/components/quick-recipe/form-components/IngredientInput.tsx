
/**
 * IngredientInput.tsx
 * Version: 1.0.7
 * Date: 2025-05-10
 * Changes:
 * - Updated UI strings
 * - Updated placeholder text
 * - Fixed error display
 * - Improved label layout with double line break
 * - Changed second sentence styling
 * - Removed duplicated FeatureBadges component
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

  return (
    <div className="space-y-2 w-full max-w-full">
      <label
        htmlFor="mainIngredient"
        className="block pb-1 text-left whitespace-normal break-words"
      >
        <span className={cn(
          'font-semibold text-recipe-blue',
          isMobile ? 'text-base' : 'text-lg'
        )}>
          What do you want to cook or what ingredients do you have in your kitchen?
        </span>
        <br />
        <br />
        <span className="text-sm text-gray-500">
          Let our AI Cooking coach know and optionally select servings, cuisine, and dietary restrictions, and we'll create a custom recipe for you!
        </span>
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
        {/* Adjusted positioning of the search icon */}
        <Search className="absolute left-3 h-5 w-5 text-recipe-blue" aria-hidden="true" />
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
            'flex-1 text-left resize-none overflow-hidden transition-all bg-transparent border-2 rounded-xl w-full',
            'focus-within:border-recipe-blue placeholder:text-gray-500/80',
            error ? 'border-red-500' : 'border-gray-200 focus:border-recipe-blue',
            // Increased left padding to ensure text doesn't overlap with the search icon
            'pl-10 pr-4'
          )}
          style={{ touchAction: 'manipulation' }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}
