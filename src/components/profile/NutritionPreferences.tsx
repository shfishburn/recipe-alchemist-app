
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MacroSliders } from './nutrition/MacroSliders';
import { MacroChart } from './nutrition/MacroChart';
import { PersonalDetails } from './PersonalDetails';
import { MacroDetails } from './MacroDetails';
import { MealTiming } from './MealTiming';
import { BodyComposition } from './BodyComposition';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface NutritionPreferencesProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: NutritionPreferencesType) => void;
}

export function NutritionPreferences({ preferences, onSave }: NutritionPreferencesProps) {
  const [macros, setMacros] = React.useState({
    protein: preferences.macroSplit.protein,
    carbs: preferences.macroSplit.carbs,
    fat: preferences.macroSplit.fat,
  });

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      dailyCalories: preferences.dailyCalories,
      ...macros,
    }
  });

  const dailyCalories = watch('dailyCalories');

  // Calculate macros in grams
  const proteinGrams = Math.round((dailyCalories * (macros.protein / 100)) / 4);
  const carbsGrams = Math.round((dailyCalories * (macros.carbs / 100)) / 4);
  const fatGrams = Math.round((dailyCalories * (macros.fat / 100)) / 9);

  const handleProteinChange = (value: number[]) => {
    const protein = value[0];
    const remainingPercent = 100 - protein;
    const currentSum = macros.carbs + macros.fat;
    const carbsRatio = macros.carbs / currentSum;
    const fatRatio = macros.fat / currentSum;
    
    const carbs = Math.round(remainingPercent * carbsRatio);
    const fat = 100 - protein - carbs;
    
    setMacros({ protein, carbs, fat });
    setValue('protein', protein);
    setValue('carbs', carbs);
    setValue('fat', fat);
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
    setValue('protein', protein);
    setValue('carbs', carbs);
    setValue('fat', fat);
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
    setValue('protein', protein);
    setValue('carbs', carbs);
    setValue('fat', fat);
  };

  const chartData = [
    { name: 'Protein', value: macros.protein, color: '#4f46e5' },
    { name: 'Carbs', value: macros.carbs, color: '#0ea5e9' },
    { name: 'Fat', value: macros.fat, color: '#22c55e' },
  ];

  const onSubmit = (data: any) => {
    const updatedPreferences = {
      ...preferences,
      dailyCalories: Number(data.dailyCalories),
      macroSplit: {
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
      },
    };
    
    onSave(updatedPreferences);
  };

  return (
    <Tabs defaultValue="personal">
      <TabsList className="mb-6">
        <TabsTrigger value="personal">Personal Details</TabsTrigger>
        <TabsTrigger value="bodyComposition">Body Composition</TabsTrigger>
        <TabsTrigger value="basic">Basic Macros</TabsTrigger>
        <TabsTrigger value="advanced">Advanced Macros</TabsTrigger>
        <TabsTrigger value="timing">Meal Timing</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal">
        <PersonalDetails 
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>

      <TabsContent value="bodyComposition">
        <BodyComposition
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>
      
      <TabsContent value="basic">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="dailyCalories">Daily Calorie Target</Label>
                  <Input
                    id="dailyCalories"
                    type="number"
                    min="1000"
                    max="5000"
                    step="50"
                    className="w-full"
                    {...register('dailyCalories')}
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
                  
                  <MacroChart chartData={chartData} />
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
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="advanced">
        <MacroDetails 
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>
      
      <TabsContent value="timing">
        <MealTiming 
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>
    </Tabs>
  );
}
