
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { AddToShoppingList } from './AddToShoppingList';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface RecipeIngredientsProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

export function RecipeIngredients({ recipe, isOpen, onToggle }: RecipeIngredientsProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="relative">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-xl font-semibold flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-recipe-blue" />
              Ingredients
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle ingredients</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 relative">
            <div className="mb-4">
              <AddToShoppingList recipe={recipe} />
            </div>
            <ul className="space-y-3">
              {recipe.ingredients && Array.isArray(recipe.ingredients) ? 
                recipe.ingredients.map((ingredient, index) => (
                  <li 
                    key={index}
                    className="text-sm sm:text-base"
                  >
                    {typeof ingredient === 'string' ? (
                      <span>{ingredient}</span>
                    ) : (
                      <>
                        <span className="font-medium">{ingredient.qty} {ingredient.unit}</span>{' '}
                        {ingredient.item}
                      </>
                    )}
                  </li>
                )) : 
                <li className="text-muted-foreground">No ingredients listed</li>
              }
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
