
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NutritionFacts } from './NutritionFacts';
import { MacronutrientChart } from './charts/MacronutrientChart';
import { NutritionalAttributes } from './NutritionalAttributes';
import { NutriScoreBadge } from './NutriScoreBadge';
import { useNutriScore } from '@/hooks/use-nutri-score';
import type { Recipe } from '@/types/recipe';

interface NutritionTabContentProps {
  recipe: Recipe;
}

export function NutritionTabContent({ recipe }: NutritionTabContentProps) {
  const { grade, hasData, score, positives, negatives } = useNutriScore(recipe);
  
  // Extract nutrition data for the macronutrient chart
  const macroData = React.useMemo(() => {
    if (!recipe?.nutrition) return [];
    
    const { protein, carbs, fat } = recipe.nutrition;
    const total = protein + carbs + fat;
    
    if (total === 0) return [];
    
    return [
      { name: 'Protein', value: Math.round((protein / total) * 100), color: '#9b87f5' },
      { name: 'Carbs', value: Math.round((carbs / total) * 100), color: '#0EA5E9' },
      { name: 'Fat', value: Math.round((fat / total) * 100), color: '#F97316' }
    ];
  }, [recipe]);
  
  return (
    <div className="space-y-6">
      {/* Nutri-Score Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6">
          <div className="flex flex-col items-center sm:flex-row sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl font-semibold">Recipe Nutri-Score</h2>
              <p className="text-muted-foreground">
                Nutritional quality assessment
              </p>
            </div>
            
            <div className="flex items-center">
              {hasData ? (
                <NutriScoreBadge grade={grade} size="lg" showLabel={true} />
              ) : (
                <div className="text-muted-foreground">
                  No Nutri-Score available
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Nutrition Facts Card */}
      <Card>
        <CardContent className="pt-6">
          <NutritionFacts recipe={recipe} />
        </CardContent>
      </Card>
      
      {/* Macronutrient Distribution */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-semibold">Macronutrient Distribution</h3>
          <div className="h-[300px]">
            <MacronutrientChart data={macroData} />
          </div>
        </CardContent>
      </Card>
      
      {/* Nutritional Attributes */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-semibold">Nutritional Attributes</h3>
          <NutritionalAttributes recipe={recipe} />
        </CardContent>
      </Card>
    </div>
  );
}
