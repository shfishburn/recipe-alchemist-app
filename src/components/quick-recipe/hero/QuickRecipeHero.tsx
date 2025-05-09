import React from 'react';
import { Bug, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickRecipeHeroProps {
  hasRecipe: boolean;
  toggleDebugMode: () => void;
  debugMode: boolean;
}

export function QuickRecipeHero({
  hasRecipe,
  toggleDebugMode,
  debugMode
}: QuickRecipeHeroProps) {
  return (
    <div className="text-center mb-8 md:mb-10">
      <h1 className="font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl flex items-center justify-center gap-2">
        <ChefHat className="h-8 w-8 md:h-10 md:w-10 text-recipe-green" />
        {hasRecipe ? "Your Recipe Preview" : ""}
      </h1>
      
      {hasRecipe && (
        <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto mt-3 md:mt-4">
          This is a preview of your recipe. You can save it as is, or chat with your AI Cooking Coach to tweak it before saving.
        </p>
      )}

      {/* Debug mode toggle - hidden in UI but can be triggered with keyboard shortcut */}
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="sm"
          className={`opacity-20 hover:opacity-100 ${debugMode ? 'bg-amber-100' : ''}`}
          onClick={toggleDebugMode}
        >
          <Bug size={16} />
        </Button>
      </div>
    </div>
  );
}
