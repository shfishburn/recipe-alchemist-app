
import React from 'react';
import { Button } from '@/components/ui/button';
import { CookingPot, ArrowRight, PartyPopper } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

interface SubmitButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
}

export function SubmitButton({ isLoading: parentIsLoading, disabled }: SubmitButtonProps) {
  const isMobile = useIsMobile();
  const { isLoading: storeIsLoading } = useQuickRecipeStore();
  
  // Use either the prop value or the store value
  const isLoading = parentIsLoading || storeIsLoading;
  
  return (
    <Button 
      type="submit" 
      className={cn(
        "w-full bg-gradient-to-r from-recipe-blue to-recipe-green hover:from-recipe-blue/90 hover:to-recipe-green/90",
        "transition-all text-white shadow-lg font-medium group",
        "relative overflow-hidden rounded-xl",
        isMobile ? "py-4 text-base" : "py-4 text-lg", // Increased padding and text size for desktop
        isLoading ? "animate-pulse cursor-not-allowed" : ""
      )}
      size={isMobile ? "lg" : "lg"}
      disabled={isLoading || disabled}
      aria-disabled={isLoading || disabled}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <CookingPot className={cn(
            "mr-2 animate-bounce",
            isMobile ? "h-6 w-6" : "h-6 w-6" // Increased icon size for desktop
          )} />
          <span className={isMobile ? "font-medium" : "font-medium"}>
            Creating Your Recipe...
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span className={isMobile ? "font-medium" : "font-medium"}>
            Create My Recipe
          </span>
          <ArrowRight className={cn(
            "ml-1 group-hover:translate-x-1 transition-transform",
            isMobile ? "h-6 w-6" : "h-6 w-6" // Increased icon size for desktop
          )} />
          <PartyPopper className={cn(
            "ml-1 opacity-0 group-hover:opacity-100 transition-opacity group-hover:animate-bounce",
            isMobile ? "h-5 w-5" : "h-5 w-5" // Increased icon size for desktop
          )} />
        </div>
      )}
      
      {/* Animated gradient background */}
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-recipe-blue via-recipe-green to-recipe-blue bg-[length:200%_100%] animate-gradient-x"></span>
      
      {/* Touch ripple effect for mobile */}
      {isMobile && (
        <span className="absolute inset-0 pointer-events-none touch-ripple"></span>
      )}
    </Button>
  );
}
