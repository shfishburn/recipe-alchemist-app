
import React from 'react';
import { NutritionFacts } from './NutritionFacts';
import { MacronutrientChart } from './charts/MacronutrientChart';
import { ComparisonChart } from './charts/ComparisonChart';
import { NutritionalAnalysis } from './NutritionalAnalysis';
import { useNutriScore } from '@/hooks/use-nutri-score';
import { Recipe } from '@/types/recipe';

interface NutritionTabContentProps {
  recipe: Recipe;
  servingSize?: number;
}

export function NutritionTabContent({ recipe, servingSize }: NutritionTabContentProps) {
  const { nutrition } = recipe;
  const nutriScore = useNutriScore(recipe);

  if (!nutrition) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        No nutrition information available
      </div>
    );
  }

  // Prepare macronutrient data for chart
  const macroData = [
    { name: 'Protein', value: nutrition.protein || 0, fill: '#4CAF50' },
    { name: 'Carbs', value: nutrition.carbs || 0, fill: '#2196F3' },
    { name: 'Fat', value: nutrition.fat || 0, fill: '#FFC107' },
  ];

  // Prepare comparison data for chart (example with RDI values)
  const compareData = [
    { 
      name: 'Calories',
      Recipe: nutrition.calories || 0, 
      Target: 2000,
      percentage: Math.round(((nutrition.calories || 0) / 2000) * 100),
      fill: '#FF5722'
    },
    { 
      name: 'Protein',
      Recipe: nutrition.protein || 0, 
      Target: 50,
      percentage: Math.round(((nutrition.protein || 0) / 50) * 100),
      fill: '#4CAF50'
    },
    { 
      name: 'Carbs',
      Recipe: nutrition.carbs || 0, 
      Target: 275,
      percentage: Math.round(((nutrition.carbs || 0) / 275) * 100),
      fill: '#2196F3'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <NutritionFacts nutrition={nutrition} servingSize={servingSize} />
        
        {nutriScore.hasData && (
          <NutritionalAnalysis 
            score={nutriScore.score}
            grade={nutriScore.grade}
            positives={nutriScore.positives}
            negatives={nutriScore.negatives}
            servingSize={nutriScore.servingSize}
            healthScore={nutriScore.healthScore}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-medium">Macronutrient Distribution</h3>
          <MacronutrientChart data={macroData} />
        </div>
        
        <div>
          <h3 className="mb-4 text-lg font-medium">Comparison to Daily Values</h3>
          <ComparisonChart compareData={compareData} />
        </div>
      </div>
    </div>
  );
}
