
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalDetails } from './PersonalDetails';
import { BodyComposition } from './BodyComposition';
import { MacroNutrients } from './MacroNutrients';
import { useProfileSettings } from '@/hooks/use-profile-context';
import { NutritionPreferencesType as NutritionType } from '@/types/nutrition';

export function BodyAndNutritionTabs() {
  const { nutritionPreferences, isLoading, saveNutritionPreferences } = useProfileSettings();
  
  // Handle save function with context
  const onSave = async (updatedPreferences: Partial<NutritionType>) => {
    return await saveNutritionPreferences({
      ...nutritionPreferences,
      ...updatedPreferences
    } as NutritionType);
  };

  return (
    <Tabs defaultValue="personal">
      <TabsList className="w-full md:w-auto">
        <TabsTrigger value="personal" className="flex-1 md:flex-initial">Personal Details</TabsTrigger>
        <TabsTrigger value="bodyComposition" className="flex-1 md:flex-initial">Body Composition</TabsTrigger>
        <TabsTrigger value="macros" className="flex-1 md:flex-initial">Macro Nutrients</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal" className="mt-6">
        <PersonalDetails 
          preferences={nutritionPreferences as NutritionType}
          onSave={onSave}
        />
      </TabsContent>
      
      <TabsContent value="bodyComposition" className="mt-6">
        <BodyComposition 
          preferences={nutritionPreferences as NutritionType}
          onSave={onSave}
        />
      </TabsContent>

      <TabsContent value="macros" className="mt-6">
        <MacroNutrients
          preferences={nutritionPreferences as NutritionType}
          onSave={onSave}
        />
      </TabsContent>
    </Tabs>
  );
}

export default BodyAndNutritionTabs;
