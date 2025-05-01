
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DietaryPreferences } from './dietary/DietaryPreferences';
import { MealTiming } from './MealTiming';
import { WeightManagementGoals } from './WeightManagementGoals';
import { useProfileContext } from '@/contexts/ProfileContext';
import { NutritionPreferencesType } from '@/types/nutrition-preferences';
import { ProfileSkeleton } from './ProfileSkeleton';
import { ErrorDisplay } from './ErrorDisplay';

export function DietAndMealTabs() {
  const { profile, isLoading, error, updateProfile, refreshProfile } = useProfileContext();
  
  // Extract nutrition preferences or use defaults
  const preferences = profile?.nutrition_preferences || {
    dailyCalories: 2000,
    macroSplit: {
      protein: 30,
      carbs: 40,
      fat: 30,
    },
    dietaryRestrictions: [],
    allergens: [],
    healthGoal: 'maintenance',
    mealSizePreference: 'medium',
  };
  
  const onSave = async (prefs: Partial<NutritionPreferencesType> | NutritionPreferencesType) => {
    const updatedPreferences = {
      ...preferences,
      ...prefs
    };
    
    return await updateProfile({
      nutrition_preferences: updatedPreferences
    });
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      {error && (
        <ErrorDisplay 
          error={error}
          onRetry={refreshProfile}
          className="mb-6"
        />
      )}
      
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
    </>
  );
}

export default DietAndMealTabs;
