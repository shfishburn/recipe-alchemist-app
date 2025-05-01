
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalDetails } from './PersonalDetails';
import { BodyComposition } from './BodyComposition';
import { MacroNutrients } from './MacroNutrients';
import { useProfileSettings } from '@/hooks/use-profile-context';

export function BodyAndNutritionTabs() {
  const { nutritionPreferences, isLoading, saveNutritionPreferences } = useProfileSettings();
  
  // Handle save function with context
  const onSave = async (updatedPreferences: typeof nutritionPreferences) => {
    return await saveNutritionPreferences(updatedPreferences);
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
          preferences={nutritionPreferences}
          onSave={onSave}
        />
      </TabsContent>
      
      <TabsContent value="bodyComposition" className="mt-6">
        <BodyComposition 
          preferences={nutritionPreferences}
          onSave={onSave}
        />
      </TabsContent>

      <TabsContent value="macros" className="mt-6">
        <MacroNutrients
          preferences={nutritionPreferences}
          onSave={onSave}
        />
      </TabsContent>
    </Tabs>
  );
}

export default BodyAndNutritionTabs;
