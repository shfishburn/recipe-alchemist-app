
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface QuickRecipeRegenerationProps {
  formData: any;
  isLoading: boolean;
  onRetry: () => void;
}

export const QuickRecipeRegeneration: React.FC<QuickRecipeRegenerationProps> = ({ 
  formData, 
  isLoading, 
  onRetry 
}) => {
  if (!formData) return null;

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-3">Not quite right?</h2>
      <p className="text-muted-foreground text-sm mb-4">
        You can generate another recipe with the same ingredients
      </p>
      <Button 
        onClick={onRetry}
        disabled={isLoading}
        className="flex items-center gap-2 bg-recipe-green hover:bg-recipe-green/90"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Generating...' : 'Generate Another Recipe'}
      </Button>
    </div>
  );
};

export default QuickRecipeRegeneration;
