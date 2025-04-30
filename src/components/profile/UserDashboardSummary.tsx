
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NutritionPreferencesType } from '@/types/nutrition';
import { useUnitSystem } from '@/hooks/use-unit-system';
import { Progress } from '@/components/ui/progress';
import { convertWeightFromKg } from '@/utils/unit-conversion';

interface UserDashboardSummaryProps {
  profileData: any;
  nutritionPreferences: NutritionPreferencesType;
}

export function UserDashboardSummary({ profileData, nutritionPreferences }: UserDashboardSummaryProps) {
  const { unitSystem } = useUnitSystem();
  const personalDetails = nutritionPreferences.personalDetails || {};
  const weightGoalType = nutritionPreferences.weightGoalType || 'maintenance';
  const bmr = nutritionPreferences.bmr || 0;
  const tdee = nutritionPreferences.tdee || 0;
  const dailyCalories = nutritionPreferences.dailyCalories || 2000;
  const macros = nutritionPreferences.macroSplit || { protein: 30, carbs: 40, fat: 30 };
  
  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (weightGoalType === 'maintenance') return 100;
    
    // For other goals, we can show percentage based on current weight vs target
    // This is a placeholder, you might want to calculate this based on real data
    return 65; 
  };

  // Format weight according to unit system
  const formatWeight = (weightKg: number | undefined) => {
    if (!weightKg) return 'N/A';
    
    const weight = convertWeightFromKg(weightKg, unitSystem);
    const unit = unitSystem === 'metric' ? 'kg' : 'lbs';
    
    return `${weight.toFixed(1)} ${unit}`;
  };

  const currentWeight = personalDetails?.weight;
  const bodyFatPercentage = nutritionPreferences.bodyComposition?.bodyFatPercentage;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard Summary</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-md">
            <p className="text-sm text-muted-foreground">Current Weight</p>
            <p className="text-lg font-semibold">{formatWeight(currentWeight)}</p>
          </div>
          
          <div className="p-3 bg-primary/10 rounded-md">
            <p className="text-sm text-muted-foreground">Daily Calories</p>
            <p className="text-lg font-semibold">{dailyCalories}</p>
          </div>
          
          <div className="p-3 bg-primary/10 rounded-md">
            <p className="text-sm text-muted-foreground">BMR</p>
            <p className="text-lg font-semibold">{bmr || 'Not calculated'}</p>
          </div>
          
          <div className="p-3 bg-primary/10 rounded-md">
            <p className="text-sm text-muted-foreground">TDEE</p>
            <p className="text-lg font-semibold">{tdee || 'Not calculated'}</p>
          </div>
        </div>
        
        {weightGoalType !== 'maintenance' && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Goal Progress</span>
              <span className="text-sm text-muted-foreground">{getProgressPercentage()}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 border rounded-md">
            <p className="text-sm text-muted-foreground">Protein</p>
            <div className="flex items-baseline">
              <p className="text-lg font-semibold">{macros.protein}%</p>
              <p className="text-xs ml-2 text-muted-foreground">
                {Math.round((dailyCalories * (macros.protein / 100)) / 4)}g
              </p>
            </div>
          </div>
          
          <div className="p-3 border rounded-md">
            <p className="text-sm text-muted-foreground">Carbs</p>
            <div className="flex items-baseline">
              <p className="text-lg font-semibold">{macros.carbs}%</p>
              <p className="text-xs ml-2 text-muted-foreground">
                {Math.round((dailyCalories * (macros.carbs / 100)) / 4)}g
              </p>
            </div>
          </div>
          
          <div className="p-3 border rounded-md">
            <p className="text-sm text-muted-foreground">Fat</p>
            <div className="flex items-baseline">
              <p className="text-lg font-semibold">{macros.fat}%</p>
              <p className="text-xs ml-2 text-muted-foreground">
                {Math.round((dailyCalories * (macros.fat / 100)) / 9)}g
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
