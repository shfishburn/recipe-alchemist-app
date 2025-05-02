
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
  // Change default pulsing state to false to prevent flashing
  const [isPulsing, setIsPulsing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Start pulsing after component mounts for a smoother experience
  useEffect(() => {
    // Delay the pulse effect to prevent flash on initial load
    const timer = setTimeout(() => {
      setIsPulsing(true);
      
      // Then stop the pulsing after a few seconds
      const stopTimer = setTimeout(() => {
        setIsPulsing(false);
      }, 3000);
      
      return () => clearTimeout(stopTimer);
    }, 1000); // Delay start by 1 second
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-resize textarea based on content using requestAnimationFrame for performance
  useEffect(() => {
    if (textareaRef.current) {
      requestAnimationFrame(() => {
        if (!textareaRef.current) return;
        
        // Reset height to auto to get the correct scrollHeight
        textareaRef.current.style.height = 'auto';
        // Set the height to match content (min height varies by device)
        const minHeight = isMobile ? '56px' : '60px';
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${Math.max(parseInt(minHeight), scrollHeight)}px`;
      });
    }
  }, [value, isMobile]);

  // Feature badges with better visual design
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
  );

  return (
    <div className="space-y-2">
      <FeatureBadges />
      
      <label htmlFor="mainIngredient" className={cn(
        "block pb-1 text-left text-lg font-semibold text-recipe-blue",
        isMobile ? "text-base" : "text-lg"
      )}>
        What ingredients do you have today?
      </label>
      
      <div className={cn(
        "relative rounded-xl shadow-md transition-all duration-300",
        isPulsing ? 'animate-pulse ring-2 ring-recipe-blue ring-opacity-50' : '',
        isFocused ? 'ring-2 ring-recipe-blue ring-opacity-100' : '',
        error ? 'ring-2 ring-red-500' : '',
        "bg-gradient-to-r from-white to-blue-50/70 dark:from-gray-900 dark:to-gray-800"
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
            "focus-within:border-recipe-blue placeholder:text-gray-500/80", // Lower opacity for placeholder
            error ? "border-red-500" : "border-gray-200 focus:border-recipe-blue"
          )}
          rows={1}
          // Improved touch handling
          style={{ touchAction: "manipulation" }}
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
