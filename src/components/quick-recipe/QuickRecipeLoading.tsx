
import React from 'react';
import { useUserMessage } from '@/hooks/use-user-message';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { SimpleLoadingSpinner } from '@/components/ui/simple-loading-spinner';
import { Button } from '@/components/ui/button';

interface QuickRecipeLoadingProps {
  onCancel?: () => void;
}

export function QuickRecipeLoading({ onCancel }: QuickRecipeLoadingProps) {
  const { loadingState, formData } = useQuickRecipeStore();
  
  // Get personalized message based on the main ingredient
  const userMessage = useUserMessage(formData?.mainIngredient);

  return (
    <div className="flex flex-col items-center justify-center w-full text-center">
      {/* Simple loading spinner */}
      <SimpleLoadingSpinner size="lg" />
      
      {/* Personalized message */}
      <h2 className="text-lg font-semibold mt-6">
        {userMessage || "Creating your recipe..."}
      </h2>
      
      {/* Step description */}
      <p className="text-sm text-muted-foreground mt-2">
        {loadingState.stepDescription || "Analyzing your ingredients..."}
      </p>
      
      {/* Simple progress indicator */}
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-6 overflow-hidden">
        <div 
          className="h-full bg-recipe-green rounded-full transition-all duration-300 ease-out"
          style={{ 
            width: `${loadingState.percentComplete || 5}%`,
            minWidth: '5%'
          }}
        />
      </div>
      
      {/* Chef's tip card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 w-full mt-6">
        <h4 className="text-base font-semibold mb-2">Chef's Tip</h4>
        <p className="text-sm text-muted-foreground">
          Patience is key in cooking. The best flavors take time to develop, just like your recipe is taking shape now.
        </p>
      </div>
      
      {/* Cancel button */}
      {onCancel && (
        <Button 
          variant="ghost" 
          onClick={onCancel} 
          className="text-muted-foreground hover:text-foreground mt-6"
        >
          Cancel
        </Button>
      )}
    </div>
  );
}
