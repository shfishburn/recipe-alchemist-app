
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NutritionFacts } from './NutritionFacts';
import { MacronutrientChart } from './charts/MacronutrientChart';
import { NutritionalAttributes } from './NutritionalAttributes';
import type { Recipe } from '@/types/recipe';

interface NutritionTabContentProps {
  recipe: Recipe;
}

export function NutritionTabContent({ recipe }: NutritionTabContentProps) {
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
