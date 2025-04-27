
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddToShoppingList } from './AddToShoppingList';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface RecipeIngredientsProps {
  recipe: Recipe;
}

export function RecipeIngredients({ recipe }: RecipeIngredientsProps) {
  const [checkedItems, setCheckedItems] = useState<{[key: number]: boolean}>({});
  const [isOpen, setIsOpen] = useState(true);
  
  const toggleItem = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
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
          <CardContent className="pt-0">
            <div className="mb-3 flex justify-end">
              <AddToShoppingList recipe={recipe} />
            </div>
            <ul className="space-y-1">
              {recipe.ingredients && Array.isArray(recipe.ingredients) ? 
                recipe.ingredients.map((ingredient, index) => (
                  <li 
                    key={index} 
                    className="flex items-center gap-2 group hover:bg-muted/50 rounded-md transition-colors"
                  >
                    <label 
                      htmlFor={`ingredient-${index}`}
                      className={`flex items-center gap-2 w-full min-h-[44px] px-2 py-2 cursor-pointer ${
                        checkedItems[index] ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      <Checkbox 
                        id={`ingredient-${index}`}
                        checked={checkedItems[index] || false}
                        onCheckedChange={() => toggleItem(index)}
                      />
                      <span>
                        <span className="font-medium">{ingredient.qty} {ingredient.unit}</span> {ingredient.item}
                      </span>
                    </label>
                  </li>
                )) : 
                <li className="text-muted-foreground">No ingredients listed</li>
              }
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
