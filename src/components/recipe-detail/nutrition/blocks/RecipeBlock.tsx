
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { MacroBreakdown } from '@/components/recipe-detail/nutrition/MacroBreakdown';
import { MicronutrientsDisplay } from '@/components/recipe-detail/nutrition/MicronutrientsDisplay';
import { ExtendedNutritionData } from '@/components/recipe-detail/nutrition/useNutritionData';
import { formatNutrientWithUnit, formatNutritionValue } from '@/components/ui/unit-display';

interface RecipeBlockProps {
  recipeNutrition: ExtendedNutritionData;
  unitSystem: 'metric' | 'imperial';
}

export function RecipeBlock({ recipeNutrition, unitSystem }: RecipeBlockProps) {
  const isMobile = useIsMobile();
  
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
  const dailyCalories = 2000; // Default daily calories
  const proteinPercentage = 30;
  const carbsPercentage = 40;
  const fatPercentage = 30;
  
  const proteinCalories = (dailyCalories * proteinPercentage) / 100;
  const carbsCalories = (dailyCalories * carbsPercentage) / 100;
  const fatCalories = (dailyCalories * fatPercentage) / 100;
  
  const proteinDailyValue = Math.round((protein / (proteinCalories / 4)) * 100);
  const carbsDailyValue = Math.round((carbs / (carbsCalories / 4)) * 100);
  const fatDailyValue = Math.round((fat / (fatCalories / 9)) * 100);
  
  // Format protein, carbs and fat based on unit system
  const formattedProtein = formatNutrientWithUnit(protein, 'g', unitSystem);
  const formattedCarbs = formatNutrientWithUnit(carbs, 'g', unitSystem);
  const formattedFat = formatNutrientWithUnit(fat, 'g', unitSystem);
  
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
              {unitSystem === 'imperial' ? 'US' : 'Metric'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xs uppercase text-muted-foreground">Protein</p>
              <p className="text-sm font-medium">{formattedProtein}</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase text-muted-foreground">Carbs</p>
              <p className="text-sm font-medium">{formattedCarbs}</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase text-muted-foreground">Fat</p>
              <p className="text-sm font-medium">{formattedFat}</p>
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
        
        <MicronutrientsDisplay 
          nutrition={recipeNutrition} 
          unitSystem={unitSystem} 
        />
      </CardContent>
    </Card>
  );
}
