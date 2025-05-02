
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { NutritionPreferencesType } from '@/types/nutrition';
import { MacroSplitSliders } from './macro-details/MacroSplitSliders';
import MacroPieCharts from './macro-details/MacroPieCharts';
import { InfoPanel } from './macro-details/InfoPanel';
import { useIsMobile } from '@/hooks/use-mobile';

interface MacroDetailsProps {
  preferences: NutritionPreferencesType;
  onSave: (details: Partial<NutritionPreferencesType>) => void;
}

export function MacroDetails({ preferences, onSave }: MacroDetailsProps) {
  const isMobile = useIsMobile();
  const macroDetails = preferences.macroDetails || {
    complexCarbs: 60,
    simpleCarbs: 40,
    saturatedFat: 30,
    unsaturatedFat: 70,
  };
  
  const [carbSplit, setCarbSplit] = React.useState({
    complex: macroDetails.complexCarbs || 60,
    simple: macroDetails.simpleCarbs || 40,
  });
  
  const [fatSplit, setFatSplit] = React.useState({
    saturated: macroDetails.saturatedFat || 30,
    unsaturated: macroDetails.unsaturatedFat || 70,
  });
  
  const { handleSubmit } = useForm({
    defaultValues: {
      complexCarbs: macroDetails.complexCarbs,
      simpleCarbs: macroDetails.simpleCarbs,
      saturatedFat: macroDetails.saturatedFat,
      unsaturatedFat: macroDetails.unsaturatedFat,
    }
  });
  
  const handleComplexCarbsChange = (value: number[]) => {
    const complex = value[0];
    const simple = 100 - complex;
    setCarbSplit({ complex, simple });
  };
  
  const handleSaturatedFatChange = (value: number[]) => {
    const saturated = value[0];
    const unsaturated = 100 - saturated;
    setFatSplit({ saturated, unsaturated });
  };
  
  const carbsData = [
    { name: 'Complex Carbs', value: carbSplit.complex, color: '#4f46e5' },
    { name: 'Simple Carbs', value: carbSplit.simple, color: '#818cf8' },
  ];
  
  const fatsData = [
    { name: 'Saturated Fat', value: fatSplit.saturated, color: '#22c55e' },
    { name: 'Unsaturated Fat', value: fatSplit.unsaturated, color: '#86efac' },
  ];
  
  const onSubmit = () => {
    onSave({
      macroDetails: {
        complexCarbs: carbSplit.complex,
        simpleCarbs: carbSplit.simple,
        saturatedFat: fatSplit.saturated,
        unsaturatedFat: fatSplit.unsaturated,
      }
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Macro Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MacroSplitSliders
              carbSplit={carbSplit}
              fatSplit={fatSplit}
              onComplexCarbsChange={handleComplexCarbsChange}
              onSaturatedFatChange={handleSaturatedFatChange}
            />
            
            {!isMobile && (
              <MacroPieCharts
                carbsData={carbsData}
                fatsData={fatsData}
              />
            )}
            
            {isMobile && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3 text-center">Distribution Charts</h3>
                <MacroPieCharts
                  carbsData={carbsData}
                  fatsData={fatsData}
                />
              </div>
            )}
          </div>
          
          <InfoPanel />
          
          <div className="flex justify-end">
            <Button type="submit">Save Macro Details</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
