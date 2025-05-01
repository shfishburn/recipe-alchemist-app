
import React, { useRef, useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface IngredientInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function IngredientInput({ value, onChange, error }: IngredientInputProps) {
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPulsing, setIsPulsing] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  
  // Stop the pulsing after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set the height to match content (min 48px for mobile, 56px for desktop)
      const minHeight = isMobile ? '52px' : '60px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(parseInt(minHeight), scrollHeight)}px`;
    }
  }, [value, isMobile]);

  return (
    <div className="space-y-1">
      <div className="text-center text-xs text-muted-foreground mb-1">
        <span className="bg-recipe-green/10 rounded-full px-2 py-0.5">Ready in 30 mins</span>
        {" • "}
        <span className="bg-recipe-blue/10 rounded-full px-2 py-0.5">Easy cleanup</span>
        {" • "}
        <span className="bg-recipe-orange/10 rounded-full px-2 py-0.5">Ingredient-based</span>
      </div>
      <label htmlFor="mainIngredient" className={cn(
        "block pb-1 text-left",
        isMobile ? "text-base font-medium" : "text-sm font-medium"
      )}>
        What ingredients do you have today?
      </label>
      <div className={cn(
        "relative rounded-xl shadow-md transition-all duration-200",
        isPulsing ? 'animate-pulse ring-2 ring-recipe-blue ring-opacity-50' : '',
        isFocused ? 'ring-2 ring-recipe-blue ring-opacity-100' : '',
        error ? 'ring-2 ring-red-500' : '',
        "bg-gradient-to-r from-white to-blue-50 dark:from-gray-900 dark:to-gray-800"
      )}>
        <Textarea 
          id="mainIngredient"
          ref={textareaRef}
          placeholder="e.g., chicken thighs, pasta, bell peppers, onions..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            isMobile ? "min-h-[56px] text-base py-3 px-4" : "min-h-[60px] text-lg",
            "pl-10 text-left resize-none overflow-hidden transition-all bg-transparent border-2 rounded-xl",
            "focus-within:border-recipe-blue placeholder:text-gray-500 touch-feedback",
            error ? "border-red-500" : "focus:border-recipe-blue"
          )}
          rows={1}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-recipe-blue" />
      </div>
      {error ? (
        <p className="text-xs text-left text-red-500 font-medium animate-fade-in">{error}</p>
      ) : (
        <p className="text-xs text-left text-recipe-blue font-medium">Tell us what you want to cook with!</p>
      )}
    </div>
  );
}
