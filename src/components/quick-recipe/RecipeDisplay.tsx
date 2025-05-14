
import React from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { Card, CardContent } from "@/components/ui/card";

interface RecipeDisplayProps {
  recipe: QuickRecipe;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2">{recipe.title}</h3>
        
        {recipe.description && (
          <p className="text-sm text-muted-foreground mb-4">{recipe.description}</p>
        )}
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Ingredients</h4>
            <ul className="list-disc pl-5 text-sm">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.qty || ''} {ingredient.unit || ''} {typeof ingredient.item === 'string' 
                    ? ingredient.item 
                    : ingredient.item.name || 'Ingredient'}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Instructions</h4>
            <ol className="list-decimal pl-5 text-sm">
              {(recipe.steps || recipe.instructions || []).map((step, index) => (
                <li key={index} className="mb-1">{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
