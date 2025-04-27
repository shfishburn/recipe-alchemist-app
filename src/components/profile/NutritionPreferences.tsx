
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { NutritionPreferencesType } from '@/pages/Profile';
import { ChartContainer } from '@/components/ui/chart';

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

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
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

  const chartData = [
    { name: 'Protein', value: macros.protein, color: '#4f46e5' }, // Indigo
    { name: 'Carbs', value: macros.carbs, color: '#0ea5e9' },     // Sky blue
    { name: 'Fat', value: macros.fat, color: '#22c55e' },         // Green
  ];

  const handleProteinChange = (value: number[]) => {
    const protein = value[0];
    // Adjust carbs and fat proportionally to maintain total of 100%
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
    // Adjust protein and fat proportionally to maintain total of 100%
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
    // Adjust protein and carbs proportionally to maintain total of 100%
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
                {...register('dailyCalories', { 
                  required: 'Calorie target is required',
                  min: {
                    value: 1000,
                    message: 'Minimum is 1000 calories'
                  },
                  max: {
                    value: 5000,
                    message: 'Maximum is 5000 calories'
                  }
                })}
              />
              {errors.dailyCalories && (
                <p className="text-sm text-red-500">{errors.dailyCalories.message as string}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Macro Distribution</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="protein">Protein ({macros.protein}%)</Label>
                      <span className="text-sm font-medium">{proteinGrams}g</span>
                    </div>
                    <Slider 
                      id="protein" 
                      value={[macros.protein]} 
                      max={70}
                      step={5}
                      onValueChange={handleProteinChange} 
                      className="w-full" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="carbs">Carbs ({macros.carbs}%)</Label>
                      <span className="text-sm font-medium">{carbsGrams}g</span>
                    </div>
                    <Slider 
                      id="carbs" 
                      value={[macros.carbs]} 
                      max={70} 
                      step={5}
                      onValueChange={handleCarbsChange} 
                      className="w-full" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="fat">Fat ({macros.fat}%)</Label>
                      <span className="text-sm font-medium">{fatGrams}g</span>
                    </div>
                    <Slider 
                      id="fat" 
                      value={[macros.fat]} 
                      max={70} 
                      step={5}
                      onValueChange={handleFatChange} 
                      className="w-full" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center items-center">
                <ChartContainer config={{
                  protein: { color: '#4f46e5' },
                  carbs: { color: '#0ea5e9' },
                  fat: { color: '#22c55e' },
                }} className="h-64 w-full">
                  <PieChart>
                    <Pie 
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
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
  );
}
