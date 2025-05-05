
import React from 'react';
import { RecipeOverview } from '@/components/recipe-detail/RecipeOverview';
import { RecipeIngredients } from '@/components/recipe-detail/RecipeIngredients';
import { RecipeInstructions } from '@/components/recipe-detail/RecipeInstructions';
import { EnhancedAddToList } from '@/components/recipe-detail/shopping-list/EnhancedAddToList';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { useRecipeSections } from '@/hooks/use-recipe-sections';
import { useIsMobile } from '@/hooks/use-mobile';

interface RecipeTabContentProps {
  recipe: Recipe;
}

export function RecipeTabContent({ recipe }: RecipeTabContentProps) {
  const { sections, toggleSection } = useRecipeSections();
  const isMobile = useIsMobile();

  return (
    <div>
      {/* Recipe overview section */}
      <RecipeOverview recipe={recipe} />
      
      {/* Main recipe content */}
      <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-3 mt-4">
        {/* Ingredients column */}
        <div className="md:col-span-1">
          <RecipeIngredients 
            recipe={recipe}
            isOpen={sections.ingredients}
            onToggle={() => toggleSection('ingredients')}
          />
          
          {/* Shopping list button */}
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 transition-colors"
              onClick={() => document.getElementById('shopping-list-trigger')?.click()}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="font-medium">Add to Shopping List</span>
            </Button>
            <div className="hidden">
              <EnhancedAddToList recipe={recipe} />
            </div>
          </div>
        </div>
        
        {/* Instructions column */}
        <div className="md:col-span-2">
          <RecipeInstructions 
            recipe={recipe}
            isOpen={sections.instructions}
            onToggle={() => toggleSection('instructions')}
          />
        </div>
      </div>

      {/* Start cooking button - mobile only */}
      {isMobile && (
        <div className="mt-8 py-4 flex justify-center">
          <a 
            href="#cooking"
            className="bg-recipe-green hover:bg-recipe-green/90 text-white px-6 py-3 rounded-full shadow-md text-lg font-medium touch-target-lg touch-feedback-optimized inline-flex items-center"
          >
            Start Cooking
          </a>
        </div>
      )}
    </div>
  );
}
