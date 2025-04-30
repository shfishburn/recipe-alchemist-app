
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MacroSliders } from './nutrition/MacroSliders';
import { MacroChart } from './nutrition/MacroChart';
import { MacroSplitSliders } from './macro-details/MacroSplitSliders';
import { MacroPieCharts } from './macro-details/MacroPieCharts';
import { InfoPanel } from './macro-details/InfoPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface MacroNutrientsProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: NutritionPreferencesType) => void;
}

export function MacroNutrients({ preferences, onSave }: MacroNutrientsProps) {
  const isMobile = useIsMobile();

  // Basic macros
  const [macros, setMacros] = useState({
    protein: preferences.macroSplit?.protein || 30,
    carbs: preferences.macroSplit?.carbs || 40,
    fat: preferences.macroSplit?.fat || 30,
  });
  
  // Advanced macros
  const macroDetails = preferences.macroDetails || {
    complexCarbs: 60,
    simpleCarbs: 40,
    saturatedFat: 30,
    unsaturatedFat: 70,
  };
  
  const [carbSplit, setCarbSplit] = useState({
    complex: macroDetails.complexCarbs || 60,
    simple: macroDetails.simpleCarbs || 40,
  });
  
  const [fatSplit, setFatSplit] = useState({
    saturated: macroDetails.saturatedFat || 30,
    unsaturated: macroDetails.unsaturatedFat || 70,
  });

  const [dailyCalories, setDailyCalories] = useState(preferences.dailyCalories || 2000);

  // Calculate macros in grams
  const proteinGrams = Math.round((dailyCalories * (macros.protein / 100)) / 4);
  const carbsGrams = Math.round((dailyCalories * (macros.carbs / 100)) / 4);
  const fatGrams = Math.round((dailyCalories * (macros.fat / 100)) / 9);

  // Macro handlers
  const handleProteinChange = (value: number[]) => {
    const protein = value[0];
    const remainingPercent = 100 - protein;
    const currentSum = macros.carbs + macros.fat;
    const carbsRatio = macros.carbs / currentSum;
    const fatRatio = macros.fat / currentSum;
    
    const carbs = Math.round(remainingPercent * carbsRatio);
    const fat = 100 - protein - carbs;
    
    setMacros({ protein, carbs, fat });
  };

  const handleCarbsChange = (value: number[]) => {
    const carbs = value[0];
    const remainingPercent = 100 - carbs;
    const currentSum = macros.protein + macros.fat;
    const proteinRatio = macros.protein / currentSum;
    const fatRatio = macros.fat / currentSum;
    
    const protein = Math.round(remainingPercent * proteinRatio);
    const fat = 100 - carbs - protein;
    
    setMacros({ protein, carbs, fat });
  };

  const handleFatChange = (value: number[]) => {
    const fat = value[0];
    const remainingPercent = 100 - fat;
    const currentSum = macros.protein + macros.carbs;
    const proteinRatio = macros.protein / currentSum;
    const carbsRatio = macros.carbs / currentSum;
    
    const protein = Math.round(remainingPercent * proteinRatio);
    const carbs = 100 - fat - protein;
    
    setMacros({ protein, carbs, fat });
  };

  // Advanced macro handlers
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

  // Chart data
  const macroChartData = [
    { name: 'Protein', value: macros.protein, color: '#4f46e5' },
    { name: 'Carbs', value: macros.carbs, color: '#0ea5e9' },
    { name: 'Fat', value: macros.fat, color: '#22c55e' },
  ];

  const carbsData = [
    { name: 'Complex Carbs', value: carbSplit.complex, color: '#4f46e5' },
    { name: 'Simple Carbs', value: carbSplit.simple, color: '#818cf8' },
  ];
  
  const fatsData = [
    { name: 'Saturated Fat', value: fatSplit.saturated, color: '#22c55e' },
    { name: 'Unsaturated Fat', value: fatSplit.unsaturated, color: '#86efac' },
  ];

  const onBasicMacroSubmit = () => {
    onSave({
      ...preferences,
      dailyCalories: Number(dailyCalories),
      macroSplit: {
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
      },
    });
  };

  const onAdvancedMacroSubmit = () => {
    onSave({
      ...preferences,
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
        <CardTitle>Macro Nutrient Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic Macros</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Macros</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <form onSubmit={(e) => { e.preventDefault(); onBasicMacroSubmit(); }} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dailyCalories">Daily Calorie Target</Label>
                <Input
                  id="dailyCalories"
                  type="number"
                  min="1000"
                  max="5000"
                  step="50"
                  className="w-full"
                  value={dailyCalories}
                  onChange={(e) => setDailyCalories(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MacroSliders 
                  macros={macros}
                  onProteinChange={handleProteinChange}
                  onCarbsChange={handleCarbsChange}
                  onFatChange={handleFatChange}
                  proteinGrams={proteinGrams}
                  carbsGrams={carbsGrams}
                  fatGrams={fatGrams}
                />
                
                <MacroChart chartData={macroChartData} />
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Total: {dailyCalories} calories per day</p>
                <p>Protein: {proteinGrams}g ({macros.protein}%)</p>
                <p>Carbs: {carbsGrams}g ({macros.carbs}%)</p>
                <p>Fat: {fatGrams}g ({macros.fat}%)</p>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Nutrition Goals</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="advanced">
            <form onSubmit={(e) => { e.preventDefault(); onAdvancedMacroSubmit(); }} className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
