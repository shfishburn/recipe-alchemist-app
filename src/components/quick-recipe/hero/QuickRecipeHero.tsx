import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PenLine } from 'lucide-react';

interface QuickRecipeHeroProps {
  hasRecipe?: boolean;
  toggleDebugMode?: () => void;
  debugMode?: boolean;
}

export function QuickRecipeHero({ 
  hasRecipe, 
  toggleDebugMode,
  debugMode 
}: QuickRecipeHeroProps) {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8 text-center">
      <h1 className="text-2xl md:text-4xl font-bold pb-3 bg-gradient-to-r from-recipe-blue to-recipe-green bg-clip-text text-transparent">
        Recipe Alchemy Quick Recipe
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
        Get instant cooking ideas using what you already have in your kitchen.
      </p>
      
      <div className="flex justify-center gap-4">
        {/* Add button to create a recipe manually */}
        <Button 
          variant="outline" 
          className="gap-2 border-recipe-green text-recipe-green hover:bg-recipe-green/10"
          onClick={() => navigate('/create-recipe')}
        >
          <PenLine className="h-4 w-4" />
          Create Your Own
        </Button>
        
        {/* Keep any existing buttons */}
        {debugMode !== undefined && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleDebugMode}
            className="text-xs text-muted-foreground"
          >
            {debugMode ? 'Hide Debug' : 'Show Debug'}
          </Button>
        )}
      </div>
    </div>
  );
}
