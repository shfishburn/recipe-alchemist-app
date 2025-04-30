
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';

interface QuickRecipeRegenerationProps {
  formData: QuickRecipeFormData | null;
  isLoading: boolean;
}

export function QuickRecipeRegeneration({ formData, isLoading }: QuickRecipeRegenerationProps) {
  const navigate = useNavigate();
  
  const handleRegenerate = () => {
    if (formData) {
      // Go back to the home page with state to trigger regeneration
      navigate('/', { state: { regenerate: true, formData } });
    }
  };
  
  const handleTryDifferent = () => {
    // Go back to the home page to start fresh
    navigate('/');
  };

  return (
    <div className="mt-6 flex justify-center space-x-4">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleTryDifferent}
        className="text-muted-foreground hover:text-foreground"
      >
        Try a different recipe
      </Button>
      
      {formData && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleRegenerate}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground flex items-center"
        >
          <RefreshCw className="mr-1 h-4 w-4" />
          Regenerate recipe
        </Button>
      )}
    </div>
  );
}
