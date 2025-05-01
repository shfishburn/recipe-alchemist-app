
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
        "w-full bg-recipe-blue hover:bg-recipe-blue/90 active:bg-recipe-blue/80",
        "transition-all text-white shadow-md font-medium group",
        "relative overflow-hidden",
        isMobile && "py-4 text-base"
      )}
      size={isMobile ? "mobile" : "lg"}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <CookingPot className={cn(
            "mr-2 animate-pulse",
            isMobile ? "h-6 w-6" : "h-5 w-5"
          )} />
          <span className={isMobile ? "font-medium" : ""}>
            Creating Your Recipe...
          </span>
        </>
      ) : (
        <>
          <span className="flex items-center">
            <span className={isMobile ? "font-medium" : ""}>
              Show My Recipe
            </span>
            <ArrowRight className={cn(
              "ml-1 group-hover:translate-x-1 transition-transform",
              isMobile ? "h-6 w-6" : "h-5 w-5"
            )} />
            <PartyPopper className={cn(
              "ml-1 opacity-0 group-hover:opacity-100 transition-opacity group-hover:animate-bounce",
              isMobile ? "h-5 w-5" : "h-4 w-4"
            )} />
          </span>
        </>
      )}
      {/* Touch ripple effect for mobile */}
      <span className="absolute inset-0 pointer-events-none touch-ripple"></span>
    </Button>
  );
}
