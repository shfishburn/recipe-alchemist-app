
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { MacroBreakdown } from '@/components/recipe-detail/nutrition/MacroBreakdown';
import { MicronutrientsDisplay } from '@/components/recipe-detail/nutrition/MicronutrientsDisplay';
import { ExtendedNutritionData } from '@/components/recipe-detail/nutrition/useNutritionData';
import { formatNutrientWithUnit } from '@/components/ui/unit-display';
import { DAILY_REFERENCE_VALUES } from '@/constants/nutrition';

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
  
  // Extract values and ensure they're numbers
  const calories = Math.round(recipeNutrition.calories || 0);
  const protein = Math.round(recipeNutrition.protein || 0);
  const carbs = Math.round(recipeNutrition.carbs || 0);
  const fat = Math.round(recipeNutrition.fat || 0);
  const fiber = Math.round(recipeNutrition.fiber || 0);
  
  // Calculate daily value percentages based on standard reference values
  const proteinDailyValue = Math.round((protein / DAILY_REFERENCE_VALUES.protein) * 100);
  const carbsDailyValue = Math.round((carbs / DAILY_REFERENCE_VALUES.carbs) * 100);
  const fatDailyValue = Math.round((fat / DAILY_REFERENCE_VALUES.fat) * 100);
  const fiberDailyValue = fiber ? Math.round((fiber / DAILY_REFERENCE_VALUES.fiber) * 100) : 0;
  
  // Default macros distribution
  let proteinPercentage = 30;
  let carbsPercentage = 40;
  let fatPercentage = 30;
  
  // Safely access recommended_macros with proper type checking
  if (recipeNutrition.data_quality && 
      recipeNutrition.data_quality.recommended_macros) {
    proteinPercentage = recipeNutrition.data_quality.recommended_macros.protein || proteinPercentage;
    carbsPercentage = recipeNutrition.data_quality.recommended_macros.carbs || carbsPercentage;
    fatPercentage = recipeNutrition.data_quality.recommended_macros.fat || fatPercentage;
  }
  
  // Format protein, carbs and fat based on unit system
  const formattedProtein = formatNutrientWithUnit(protein, 'g', unitSystem);
  const formattedCarbs = formatNutrientWithUnit(carbs, 'g', unitSystem);
  const formattedFat = formatNutrientWithUnit(fat, 'g', unitSystem);
  
  return (
    <Card>
      <CardHeader className={isMobile ? "px-3 py-3" : "px-6 py-4"}>
        <CardTitle>Nutrition Facts</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className={isMobile ? "px-3" : "px-6"}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">
              <span className="text-lg">{calories}</span> calories
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
              <p className="text-xs font-medium" id="protein-label">Protein</p>
              <p className="text-xs text-muted-foreground">{proteinDailyValue}% DV</p>
            </div>
            <Progress 
              value={proteinDailyValue} 
              className="h-2" 
              aria-labelledby="protein-label"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium" id="carbs-label">Carbs</p>
              <p className="text-xs text-muted-foreground">{carbsDailyValue}% DV</p>
            </div>
            <Progress 
              value={carbsDailyValue} 
              className="h-2" 
              aria-labelledby="carbs-label"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium" id="fat-label">Fat</p>
              <p className="text-xs text-muted-foreground">{fatDailyValue}% DV</p>
            </div>
            <Progress 
              value={fatDailyValue} 
              className="h-2" 
              aria-labelledby="fat-label"
            />
          </div>
          
          {fiber && fiberDailyValue ? (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium" id="fiber-label">Fiber</p>
                <p className="text-xs text-muted-foreground">{fiberDailyValue}% DV</p>
              </div>
              <Progress 
                value={fiberDailyValue} 
                className="h-2" 
                aria-labelledby="fiber-label"
              />
            </div>
          ) : null}
          
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
