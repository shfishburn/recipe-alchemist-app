
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
        "w-full bg-gradient-to-r from-recipe-blue to-recipe-green hover:from-recipe-blue/90 hover:to-recipe-green/90",
        "transition-all text-white shadow-lg font-medium group",
        "relative overflow-hidden rounded-xl",
        isMobile && "py-4 text-base"
      )}
      size={isMobile ? "mobile" : "lg"}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <CookingPot className={cn(
            "mr-2 animate-pulse",
            isMobile ? "h-6 w-6" : "h-5 w-5"
          )} />
          <span className={isMobile ? "font-medium" : ""}>
            Creating Your Recipe...
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
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
        </div>
      )}
      {/* Touch ripple effect for mobile */}
      <span className="absolute inset-0 pointer-events-none touch-ripple"></span>
      
      {/* Add animated gradient background */}
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-recipe-blue via-recipe-green to-recipe-blue bg-[length:200%_100%] animate-gradient-x"></span>
    </Button>
  );
}
