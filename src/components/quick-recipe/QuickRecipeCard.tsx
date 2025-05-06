
import React from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecipeTimeInfo } from './card/RecipeTimeInfo';
import { RecipeIngredients } from './card/RecipeIngredients';
import { RecipeSteps } from './card/RecipeSteps';
import { RecipeHighlights } from './card/RecipeHighlights';
import { RecipeActionButtons } from './card/RecipeActionButtons';
import { RecipeDebugSection } from './card/RecipeDebugSection';
import { PlaceholderImage } from '@/components/recipe-detail/recipe-image/PlaceholderImage';

interface QuickRecipeCardProps {
  recipe: QuickRecipe;
  onCook: () => void;
  onSave: () => void;
  onChatWithAi?: () => void;
  isSaving?: boolean;
}

export function QuickRecipeCard({ 
  recipe, 
  onCook, 
  onSave, 
  onChatWithAi,
  isSaving = false 
}: QuickRecipeCardProps) {
  return (
    <Card className="w-full border-2 border-recipe-green/20 card-touch-optimized">
      <CardHeader className="pb-2">
        <div className="w-full aspect-video overflow-hidden rounded-lg mb-4">
          <PlaceholderImage
            hasError={false}
            variant="card"
            title={recipe.title}
          />
        </div>
        <CardTitle className="text-2xl">
          {recipe.title}
        </CardTitle>
        <p className="text-muted-foreground">{recipe.description}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Time indicators */}
        <RecipeTimeInfo prepTime={recipe.prepTime} cookTime={recipe.cookTime} />
        
        {/* Ingredients */}
        <RecipeIngredients ingredients={recipe.ingredients} />
        
        {/* Steps */}
        <RecipeSteps steps={recipe.steps} />
        
        {/* Nutrition Highlight & Cooking Tip */}
        <RecipeHighlights 
          nutritionHighlight={recipe.nutritionHighlight} 
          cookingTip={recipe.cookingTip} 
        />
        
        {/* Action buttons */}
        <RecipeActionButtons 
          onCook={onCook}
          onSave={onSave}
          onChatWithAi={onChatWithAi}
          isSaving={isSaving}
        />
        
        {/* Debug JSON Section */}
        <RecipeDebugSection recipe={recipe} />
      </CardContent>
    </Card>
  );
}
