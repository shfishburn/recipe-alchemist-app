
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { QuickRecipeFormData } from '@/types/quick-recipe';

export interface QuickRecipeRegenerationProps {
  formData: QuickRecipeFormData;
  isLoading: boolean;
  onRetry?: () => void;
}

export function QuickRecipeRegeneration({ 
  formData, 
  isLoading, 
  onRetry 
}: QuickRecipeRegenerationProps) {
  // Don't show regeneration if there's no form data
  if (!formData) return null;
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold mb-4">Not quite what you wanted?</h3>
      <p className="mb-4 text-muted-foreground">
        You can regenerate this recipe with the same ingredients and preferences.
      </p>
      <Button 
        onClick={onRetry} 
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        Regenerate Recipe
      </Button>
    </div>
  );
}
