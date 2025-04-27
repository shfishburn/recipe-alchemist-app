
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { RecipeBlock } from './blocks/RecipeBlock';
import { PersonalBlock } from './blocks/PersonalBlock';
import { NutritionSummaryText } from './charts/NutritionSummaryText';

interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionBlockProps {
  recipeNutrition: RecipeNutrition;
  userPreferences?: {
    dailyCalories: number;
    macroSplit: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}

export function NutritionBlock({ recipeNutrition, userPreferences }: NutritionBlockProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="recipe">
        <TabsList className="mb-2">
          <TabsTrigger value="recipe">Recipe Nutrition</TabsTrigger>
          {userPreferences && (
            <TabsTrigger value="personal">Personal Impact</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="recipe" className="pt-2">
          <RecipeBlock recipeNutrition={recipeNutrition} />
        </TabsContent>
        
        {userPreferences && (
          <TabsContent value="personal" className="pt-2">
            <PersonalBlock 
              recipeNutrition={recipeNutrition}
              userPreferences={userPreferences}
            />
          </TabsContent>
        )}
      </Tabs>
      
      <NutritionSummaryText
        calories={recipeNutrition.calories}
        protein={recipeNutrition.protein}
        carbs={recipeNutrition.carbs}
        fat={recipeNutrition.fat}
        caloriesPercentage={userPreferences ? Math.round((recipeNutrition.calories / userPreferences.dailyCalories) * 100) : 0}
        proteinPercentage={userPreferences ? Math.round((recipeNutrition.protein / ((userPreferences.dailyCalories * userPreferences.macroSplit.protein / 100) / 4)) * 100) : 0}
        carbsPercentage={userPreferences ? Math.round((recipeNutrition.carbs / ((userPreferences.dailyCalories * userPreferences.macroSplit.carbs / 100) / 4)) * 100) : 0}
        fatPercentage={userPreferences ? Math.round((recipeNutrition.fat / ((userPreferences.dailyCalories * userPreferences.macroSplit.fat / 100) / 9)) * 100) : 0}
      />
    </div>
  );
}
