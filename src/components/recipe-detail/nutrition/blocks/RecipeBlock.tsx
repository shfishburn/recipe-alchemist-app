import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { MetricIcon } from '@/components/ui/icons';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNutritionData } from '@/components/recipe-detail/nutrition/useNutritionData';
import { MacroBreakdown } from '@/components/recipe-detail/nutrition/MacroBreakdown';
import { MicronutrientsDisplay } from '@/components/recipe-detail/nutrition/MicronutrientsDisplay';
import type { Recipe } from '@/types/recipe';
import type { Profile } from '@/hooks/use-auth';

interface RecipeBlockProps {
  recipe: Recipe;
  profile?: Profile | null;
}

export function RecipeBlock({ recipe, profile }: RecipeBlockProps) {
  const isMobile = useIsMobile();
  const { recipeNutrition, userPreferences } = useNutritionData(recipe, profile);
  
  if (!recipeNutrition) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Facts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No nutrition information available for this recipe.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const { calories, protein, carbs, fat } = recipeNutrition;
  const dailyCalories = userPreferences?.dailyCalories || 2000;
  const proteinPercentage = userPreferences?.macroSplit?.protein || 30;
  const carbsPercentage = userPreferences?.macroSplit?.carbs || 40;
  const fatPercentage = userPreferences?.macroSplit?.fat || 30;
  
  const proteinCalories = (dailyCalories * proteinPercentage) / 100;
  const carbsCalories = (dailyCalories * carbsPercentage) / 100;
  const fatCalories = (dailyCalories * fatPercentage) / 100;
  
  const proteinDailyValue = Math.round((protein / (proteinCalories / 4)) * 100);
  const carbsDailyValue = Math.round((carbs / (carbsCalories / 4)) * 100);
  const fatDailyValue = Math.round((fat / (fatCalories / 9)) * 100);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Facts</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">
              <span className="text-lg">{Math.round(calories)}</span> calories
            </p>
            <Badge variant="secondary">
              {userPreferences?.unitSystem === 'imperial' ? 'US' : 'Metric'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xs uppercase text-muted-foreground">Protein</p>
              <p className="text-sm font-medium">{Math.round(protein)}g</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase text-muted-foreground">Carbs</p>
              <p className="text-sm font-medium">{Math.round(carbs)}g</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase text-muted-foreground">Fat</p>
              <p className="text-sm font-medium">{Math.round(fat)}g</p>
            </div>
          </div>
          
          <Separator className="mb-4" />
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium">Protein</p>
              <p className="text-xs text-muted-foreground">{proteinDailyValue}% DV</p>
            </div>
            <Progress value={proteinDailyValue} />
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium">Carbs</p>
              <p className="text-xs text-muted-foreground">{carbsDailyValue}% DV</p>
            </div>
            <Progress value={carbsDailyValue} />
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium">Fat</p>
              <p className="text-xs text-muted-foreground">{fatDailyValue}% DV</p>
            </div>
            <Progress value={fatDailyValue} />
          </div>
          
          <Separator className="my-4" />
          
          <MacroBreakdown 
            protein={proteinPercentage}
            carbs={carbsPercentage}
            fat={fatPercentage}
          />
          
          <Separator className="my-4" />
        </div>
        
        <MicronutrientsDisplay nutrition={recipeNutrition} />
      </CardContent>
    </Card>
  );
}
