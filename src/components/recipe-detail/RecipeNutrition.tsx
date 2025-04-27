
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface RecipeNutritionProps {
  recipe: Recipe;
}

export function RecipeNutrition({ recipe }: RecipeNutritionProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  if (!recipe.nutrition) return null;
  
  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold flex items-center">
              <Info className="h-5 w-5 mr-2 text-recipe-blue" />
              Nutrition
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle nutrition</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <p className="text-sm text-muted-foreground">Per serving</p>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {recipe.nutrition.kcal !== undefined && (
                <li className="flex justify-between items-center py-1 border-b border-muted">
                  <span>Calories</span>
                  <span className="font-medium text-recipe-blue">{recipe.nutrition.kcal} kcal</span>
                </li>
              )}
              {recipe.nutrition.protein_g !== undefined && (
                <li className="flex justify-between items-center py-1 border-b border-muted">
                  <span>Protein</span>
                  <span className="font-medium">{recipe.nutrition.protein_g}g</span>
                </li>
              )}
              {recipe.nutrition.carbs_g !== undefined && (
                <li className="flex justify-between items-center py-1 border-b border-muted">
                  <span>Carbs</span>
                  <span className="font-medium">{recipe.nutrition.carbs_g}g</span>
                </li>
              )}
              {recipe.nutrition.fat_g !== undefined && (
                <li className="flex justify-between items-center py-1 border-b border-muted">
                  <span>Fat</span>
                  <span className="font-medium">{recipe.nutrition.fat_g}g</span>
                </li>
              )}
              {recipe.nutrition.fiber_g !== undefined && (
                <li className="flex justify-between items-center py-1 border-b border-muted">
                  <span>Fiber</span>
                  <span className="font-medium">{recipe.nutrition.fiber_g}g</span>
                </li>
              )}
              {recipe.nutrition.sugar_g !== undefined && (
                <li className="flex justify-between items-center py-1 border-b border-muted">
                  <span>Sugar</span>
                  <span className="font-medium">{recipe.nutrition.sugar_g}g</span>
                </li>
              )}
              {recipe.nutrition.sodium_mg !== undefined && (
                <li className="flex justify-between items-center py-1">
                  <span>Sodium</span>
                  <span className="font-medium">{recipe.nutrition.sodium_mg}mg</span>
                </li>
              )}
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
