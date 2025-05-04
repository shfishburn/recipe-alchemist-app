
import React from 'react';

interface LoadingMessageProps {
  showFinalAnimation: boolean;
  personalizedMessage: string;
  stepDescription: string;
}

export function LoadingMessage({ 
  showFinalAnimation, 
  personalizedMessage, 
  stepDescription 
}: LoadingMessageProps) {
  return (
    <>
      {/* Personalized message */}
      <h2 className="text-lg sm:text-xl font-semibold">
        {showFinalAnimation ? "Recipe ready!" : personalizedMessage}
      </h2>
      
      {/* Step description */}
      <p className="text-sm text-muted-foreground">
        {showFinalAnimation ? "Your perfect recipe has been created." : stepDescription}
      </p>
    </>
  );
}
