
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import type { NutritionPreferencesType } from '@/pages/Profile';

interface MacroDetailsProps {
  preferences: NutritionPreferencesType;
  onSave: (details: Partial<NutritionPreferencesType>) => void;
}

export function MacroDetails({ preferences, onSave }: MacroDetailsProps) {
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
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Carbohydrate Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="complexCarbs">Complex Carbs ({carbSplit.complex}%)</Label>
                    <span className="text-sm font-medium">Whole grains, vegetables, legumes</span>
                  </div>
                  <Slider 
                    id="complexCarbs" 
                    value={[carbSplit.complex]} 
                    max={100}
                    step={5}
                    onValueChange={handleComplexCarbsChange} 
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <Label htmlFor="simpleCarbs">Simple Carbs ({carbSplit.simple}%)</Label>
                    <span className="text-sm font-medium">Fruits, honey, sugar</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-300 transition-all" 
                      style={{ width: `${carbSplit.simple}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-2">Fat Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="saturatedFat">Saturated Fat ({fatSplit.saturated}%)</Label>
                      <span className="text-sm font-medium">Animal products, coconut oil</span>
                    </div>
                    <Slider 
                      id="saturatedFat" 
                      value={[fatSplit.saturated]} 
                      max={100}
                      step={5}
                      onValueChange={handleSaturatedFatChange} 
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                      <Label htmlFor="unsaturatedFat">Unsaturated Fat ({fatSplit.unsaturated}%)</Label>
                      <span className="text-sm font-medium">Olive oil, nuts, avocados</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-300 transition-all" 
                        style={{ width: `${fatSplit.unsaturated}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Carbohydrate Distribution</h3>
                <ChartContainer config={{
                  'Complex Carbs': { color: '#4f46e5' },
                  'Simple Carbs': { color: '#818cf8' },
                }} className="h-40 w-full">
                  <PieChart>
                    <Pie 
                      data={carbsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {carbsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Fat Distribution</h3>
                <ChartContainer config={{
                  'Saturated Fat': { color: '#22c55e' },
                  'Unsaturated Fat': { color: '#86efac' },
                }} className="h-40 w-full">
                  <PieChart>
                    <Pie 
                      data={fatsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {fatsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <h4 className="font-medium mb-2">Why this matters:</h4>
            <p className="text-sm text-muted-foreground">
              Complex carbs provide sustained energy and more nutrients, while simple carbs give quick energy. 
              Unsaturated fats are generally healthier than saturated fats. These ratios help optimize your nutrition
              for your specific health goals.
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save Macro Details</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
