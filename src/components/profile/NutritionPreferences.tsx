
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalDetails } from './PersonalDetails';
import { DietaryPreferences } from './DietaryPreferences';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface NutritionPreferencesProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: NutritionPreferencesType) => void;
}

export function NutritionPreferences({ preferences, onSave }: NutritionPreferencesProps) {
  return (
    <Tabs defaultValue="personal">
      <TabsList className="mb-6">
        <TabsTrigger value="personal">Personal Details</TabsTrigger>
        <TabsTrigger value="dietary">Dietary Preferences</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal">
        <PersonalDetails 
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>
      
      <TabsContent value="dietary">
        <DietaryPreferences 
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>
    </Tabs>
  );
}
