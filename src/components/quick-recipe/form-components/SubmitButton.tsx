
import React from 'react';
import { Button } from '@/components/ui/button';
import { CookingPot, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  const isMobile = useIsMobile();
  
  return (
    <Button 
      type="submit" 
      className="w-full bg-recipe-blue hover:bg-recipe-blue/90 transition-all text-white shadow-md font-medium"
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
          Show My Recipe
          <ArrowRight className="ml-1 h-5 w-5" />
        </>
      )}
    </Button>
  );
}
