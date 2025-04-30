
import React from 'react';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BodyCompositionForm } from './body-composition/BodyCompositionForm';
import { ActivityComponentsInput } from './body-composition/ActivityComponentsInput';
import { MetabolicAdaptationForm } from './body-composition/MetabolicAdaptationForm';
import { WeightProjections } from './body-composition/WeightProjections';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface BodyCompositionProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: NutritionPreferencesType) => void;
}

export function BodyComposition({ preferences, onSave }: BodyCompositionProps) {
  return (
    <Tabs defaultValue="bodyComposition">
      <TabsList>
        <TabsTrigger value="bodyComposition">Body Composition</TabsTrigger>
        <TabsTrigger value="activity">Activity Level</TabsTrigger>
        <TabsTrigger value="adaptation">Metabolic Adaptation</TabsTrigger>
        <TabsTrigger value="projections">Projections</TabsTrigger>
      </TabsList>
      
      <TabsContent value="bodyComposition">
        <BodyCompositionForm 
          preferences={preferences} 
          onSave={onSave} 
        />
      </TabsContent>
      
      <TabsContent value="activity">
        <ActivityComponentsInput 
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>
      
      <TabsContent value="adaptation">
        <MetabolicAdaptationForm
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>
      
      <TabsContent value="projections">
        <WeightProjections
          preferences={preferences}
        />
      </TabsContent>
    </Tabs>
  );
}
