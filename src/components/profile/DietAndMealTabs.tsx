
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DietaryPreferences } from './dietary/DietaryPreferences';
import { MealTiming } from './MealTiming';
import { WeightManagementGoals } from './WeightManagementGoals';
import { NutritionPreferencesType } from '@/types/nutrition';

interface DietAndMealTabsProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: Partial<NutritionPreferencesType> | NutritionPreferencesType) => void;
}

export function DietAndMealTabs({ preferences, onSave }: DietAndMealTabsProps) {
  return (
    <Tabs defaultValue="dietary">
      <TabsList>
        <TabsTrigger value="dietary">Dietary Restrictions</TabsTrigger>
        <TabsTrigger value="mealTiming">Meal Timing</TabsTrigger>
        <TabsTrigger value="weightGoals">Weight Goals</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dietary" className="mt-6">
        <DietaryPreferences 
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>
      
      <TabsContent value="mealTiming" className="mt-6">
        <MealTiming 
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>

      <TabsContent value="weightGoals" className="mt-6">
        <WeightManagementGoals 
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>
    </Tabs>
  );
}
