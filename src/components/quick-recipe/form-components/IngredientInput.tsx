
import React, { useRef, useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface IngredientInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function IngredientInput({ value, onChange }: IngredientInputProps) {
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPulsing, setIsPulsing] = useState(true);
  
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
      const minHeight = isMobile ? '48px' : '56px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(parseInt(minHeight), scrollHeight)}px`;
    }
  }, [value, isMobile]);

  return (
    <div className="space-y-1">
      <div className="text-center text-xs text-muted-foreground mb-1">
        Ready in 30 mins • Easy cleanup • Ingredient-based
      </div>
      <label htmlFor="mainIngredient" className="text-sm font-medium block pb-1 text-left">
        What ingredients do you have today?
      </label>
      <div className={`relative ${isPulsing ? 'animate-pulse ring-2 ring-recipe-blue ring-opacity-50' : ''} rounded-md shadow-sm bg-gradient-to-r from-white to-blue-50 dark:from-gray-900 dark:to-gray-800`}>
        <Textarea 
          id="mainIngredient"
          ref={textareaRef}
          placeholder="e.g., chicken thighs, pasta, bell peppers, onions..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${isMobile ? "min-h-[54px] text-base" : "min-h-[60px] text-lg"} pl-10 text-left resize-none overflow-hidden transition-all bg-transparent border-2 focus-within:border-recipe-blue placeholder:text-gray-500`}
          rows={1}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-recipe-blue" />
      </div>
      <p className="text-xs text-left text-recipe-blue font-medium">Tell us what you want to cook with!</p>
    </div>
  );
}
