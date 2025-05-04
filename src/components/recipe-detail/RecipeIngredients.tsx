
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import type { Recipe } from '@/hooks/use-recipe-detail';
import { useUnitSystem } from '@/hooks/use-unit-system';
import { UnitSystemToggle } from '@/components/ui/unit-system-toggle';
import { EnhancedAddToList } from './shopping-list/EnhancedAddToList';

interface RecipeIngredientsProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

export function RecipeIngredients({ recipe, isOpen, onToggle }: RecipeIngredientsProps) {
  const { unitSystem } = useUnitSystem();
  
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="relative">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-xl font-semibold flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-recipe-blue" />
              Ingredients
            </CardTitle>
            <div className="flex items-center gap-2">
              <UnitSystemToggle size="sm" />
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
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 relative">
            <div className="mb-4">
              <EnhancedAddToList recipe={recipe} />
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
                        <span className="font-medium">
                          {unitSystem === 'metric' ? 
                            // Use metric values if available
                            `${ingredient.qty_metric !== undefined ? ingredient.qty_metric : ingredient.qty} ${ingredient.unit_metric || ingredient.unit}` : 
                            // Use imperial values if available
                            `${ingredient.qty_imperial !== undefined ? ingredient.qty_imperial : ingredient.qty} ${ingredient.unit_imperial || ingredient.unit}`
                          }
                        </span>{' '}
                        {ingredient.item}
                        {ingredient.notes && <span className="text-gray-500"> ({ingredient.notes})</span>}
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
