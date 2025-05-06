
import React from 'react';
import { Button } from '@/components/ui/button';
import { CookingPot, ArrowRight, PartyPopper } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface SubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
}

export function SubmitButton({ isLoading, disabled }: SubmitButtonProps) {
  const isMobile = useIsMobile();
  
  return (
    <Button 
      type="submit" 
      className={cn(
        "w-full bg-gradient-to-r from-recipe-primary to-recipe-green hover:from-recipe-primary/90 hover:to-recipe-green/90",
        "transition-all duration-300 text-white shadow-md font-medium group",
        "relative overflow-hidden rounded-xl touch-action-auto",
        isMobile ? "py-5 text-base" : "py-4 text-lg", // Increased padding for better touch target
        isLoading ? "opacity-90" : ""
      )}
      size="lg"
      disabled={isLoading || disabled}
      aria-disabled={isLoading || disabled}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <CookingPot className={cn(
            "mr-2 animate-pulse",
            isMobile ? "h-5 w-5" : "h-6 w-6"
          )} />
          <span className="font-medium">
            Creating Your Recipe...
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span className="font-medium">
            Show My Recipe
          </span>
          <ArrowRight className={cn(
            "ml-1 group-hover:translate-x-1 transition-transform duration-300",
            isMobile ? "h-5 w-5" : "h-6 w-6"
          )} />
          <PartyPopper className={cn(
            "ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            isMobile ? "h-4 w-4" : "h-5 w-5"
          )} />
        </div>
      )}
      
      {/* Improved touch ripple effect using the touch-ripple class */}
      <span aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl touch-ripple"></span>
    </Button>
  );
}
