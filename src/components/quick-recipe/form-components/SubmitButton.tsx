
import React from 'react';
import { Button } from '@/components/ui/button';
import { CookingPot, ArrowRight, PartyPopper } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  const isMobile = useIsMobile();
  
  return (
    <Button 
      type="submit" 
      className="w-full bg-recipe-blue hover:bg-recipe-blue/90 transition-all text-white shadow-md font-medium group"
      size={isMobile ? "lg" : "lg"}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <CookingPot className="mr-2 h-5 w-5 animate-pulse" />
          Creating Your Recipe...
        </>
      ) : (
        <>
          <span className="flex items-center">
            Show My Recipe
            <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            <PartyPopper className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity group-hover:animate-bounce" />
          </span>
        </>
      )}
    </Button>
  );
}
