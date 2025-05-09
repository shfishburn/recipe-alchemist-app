
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MacroCaloriesBreakdown } from './personal/MacroCaloriesBreakdown';
import { NutrientStats } from './personal/NutrientStats';
import { formatNutrientWithUnit } from '@/components/ui/unit-display';
import { NutritionSummaryText } from '../charts/NutritionSummaryText';
import { EnhancedNutrition } from '@/components/recipe-detail/nutrition/useNutritionData';
import { useIsMobile } from '@/hooks/use-mobile';
import { DAILY_REFERENCE_VALUES } from '@/constants/nutrition';
import { NutritionConfidenceIndicator } from '../NutritionConfidenceIndicator';

interface PersonalBlockProps {
  recipeNutrition: EnhancedNutrition;
  userPreferences: {
    dailyCalories: number;
    macroSplit: {
      protein: number;
      carbs: number;
      fat: number;
    };
    unitSystem?: 'metric' | 'imperial';
  };
}

export function PersonalBlock({ recipeNutrition, userPreferences }: PersonalBlockProps) {
  const isMobile = useIsMobile();
  const unitSystem = userPreferences?.unitSystem || 'metric';

  if (!recipeNutrition || !userPreferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personalized Nutrition</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No personalized nutrition information available. Please check your nutrition preferences.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Extract values
  const calories = Math.round(recipeNutrition.calories || 0);
  const protein = Math.round(recipeNutrition.protein || 0);
  const carbs = Math.round(recipeNutrition.carbs || 0);
  const fat = Math.round(recipeNutrition.fat || 0);
  const fiber = Math.round(recipeNutrition.fiber || 0);
  
  // Get saturated fat (from either property name)
  const saturatedFat = Math.round(
    recipeNutrition.saturated_fat || recipeNutrition.saturatedFat || 0
  );

  // Calculate percentage of daily values
  const { dailyCalories } = userPreferences;
  const caloriesPercentage = Math.round((calories / dailyCalories) * 100);
  
  // Use either personalized values from profile or default values
  const proteinPercentage = Math.round((protein / DAILY_REFERENCE_VALUES.protein) * 100);
  const carbsPercentage = Math.round((carbs / DAILY_REFERENCE_VALUES.carbs) * 100);
  const fatPercentage = Math.round((fat / DAILY_REFERENCE_VALUES.fat) * 100);
  const fiberPercentage = Math.round((fiber / DAILY_REFERENCE_VALUES.fiber) * 100);
  const saturatedFatPercentage = Math.round((saturatedFat / DAILY_REFERENCE_VALUES.saturated_fat) * 100);

  return (
    <Card>
      <CardHeader className={isMobile ? "px-3 py-3" : "px-6 py-4"}>
        <div className="flex items-center justify-between">
          <CardTitle>Personalized Nutrition</CardTitle>
          <div className="flex items-center gap-2">
            <NutritionConfidenceIndicator nutrition={recipeNutrition} size="sm" />
            <Badge variant="secondary">
              {unitSystem === 'imperial' ? 'US' : 'Metric'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className={isMobile ? "p-3" : "p-6"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="order-2 md:order-1">
            <MacroCaloriesBreakdown
              calories={calories}
              protein={protein}
              carbs={carbs}
              fat={fat}
              dailyCalories={dailyCalories}
              macroSplit={userPreferences.macroSplit}
            />
          </div>
          
          <div className="order-1 md:order-2">
            <NutritionSummaryText
              calories={calories}
              protein={protein}
              carbs={carbs}
              fat={fat}
              fiber={fiber}
              saturatedFat={saturatedFat}
              caloriesPercentage={caloriesPercentage}
              proteinPercentage={proteinPercentage}
              carbsPercentage={carbsPercentage}
              fatPercentage={fatPercentage}
              fiberPercentage={fiberPercentage}
              saturatedFatPercentage={saturatedFatPercentage}
              unitSystem={unitSystem}
            />
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <NutrientStats 
          recipeNutrition={recipeNutrition} 
          dailyCalories={dailyCalories}
          unitSystem={unitSystem}
        />
      </CardContent>
    </Card>
  );
}
