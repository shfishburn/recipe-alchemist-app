
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalDetails } from './PersonalDetails';
import { BodyComposition } from './BodyComposition';
import { MacroNutrients } from './MacroNutrients';
import { NutritionPreferencesType } from '@/types/nutrition';

interface BodyAndNutritionTabsProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: NutritionPreferencesType) => void;
}

export function BodyAndNutritionTabs({ preferences, onSave }: BodyAndNutritionTabsProps) {
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
        />
      </TabsContent>
      
      <TabsContent value="bodyComposition" className="mt-6">
        <BodyComposition 
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>

      <TabsContent value="macros" className="mt-6">
        <MacroNutrients
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>
    </Tabs>
  );
}
