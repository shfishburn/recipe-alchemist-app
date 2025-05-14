
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
  
  // Debug log on rendering
  React.useEffect(() => {
    console.log('SubmitButton rendered with props:', { parentIsLoading, disabled, storeIsLoading });
  }, [parentIsLoading, disabled, storeIsLoading]);
  
  return (
    <Button 
      type="submit" 
      className={cn(
        "w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevation-2",
        "transition-all font-medium group relative overflow-hidden",
        "rounded-md px-6 py-4 h-auto", // Material button proportions
        isMobile ? "text-base" : "text-lg",
        isLoading ? "animate-pulse cursor-not-allowed" : ""
      )}
      disabled={isLoading || disabled}
      aria-disabled={isLoading || disabled}
      aria-busy={isLoading}
      variant="filled" // Material Design "filled" variant
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <CookingPot className={cn(
            "mr-2 animate-bounce",
            isMobile ? "h-5 w-5" : "h-5 w-5"
          )} />
          <span className="font-medium">
            Creating Your Recipe...
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span className="font-medium">
            Create My Recipe
          </span>
          <ArrowRight className={cn(
            "ml-1.5 group-hover:translate-x-1 transition-transform",
            isMobile ? "h-5 w-5" : "h-5 w-5"
          )} />
          <PartyPopper className={cn(
            "ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity group-hover:animate-bounce",
            isMobile ? "h-4 w-4" : "h-4 w-4"
          )} />
        </div>
      )}
      
      {/* Material Design state layer for button */}
      <span aria-hidden="true" className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 group-active:opacity-20 transition-opacity pointer-events-none" />
    </Button>
  );
}
