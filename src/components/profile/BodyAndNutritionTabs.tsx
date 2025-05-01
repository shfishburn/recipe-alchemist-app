
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalDetails } from './PersonalDetails';
import { BodyComposition } from './BodyComposition';
import { MacroNutrients } from './MacroNutrients';
import { useProfile } from '@/contexts/ProfileContext';

export function BodyAndNutritionTabs() {
  const { profile, isLoading, error, updateProfile } = useProfile();
  
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
  
  // Handle save function with context
  const onSave = async (updatedPreferences: typeof preferences) => {
    return await updateProfile({
      nutrition_preferences: updatedPreferences
    });
  };

  return (
    <Tabs defaultValue="personal">
      <TabsList>
        <TabsTrigger value="personal">Personal Details</TabsTrigger>
        <TabsTrigger value="bodyComposition">Body Composition</TabsTrigger>
        <TabsTrigger value="macros">Macro Nutrients</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal" className="mt-6">
        <PersonalDetails 
          preferences={preferences}
          onSave={onSave}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="bodyComposition" className="mt-6">
        <BodyComposition 
          preferences={preferences}
          onSave={onSave}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="macros" className="mt-6">
        <MacroNutrients
          preferences={preferences}
          onSave={onSave}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
}

export default BodyAndNutritionTabs;
