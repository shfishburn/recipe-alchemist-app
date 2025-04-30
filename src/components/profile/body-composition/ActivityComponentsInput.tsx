
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Remove the incorrect import as this function doesn't exist in the file
import type { NutritionPreferencesType } from '@/types/nutrition';

interface ActivityComponentsInputProps {
  preferences: NutritionPreferencesType;
  onUpdate: (updatedPreferences: Partial<NutritionPreferencesType>) => void;
}

export function ActivityComponentsInput({ preferences, onUpdate }: ActivityComponentsInputProps) {
  // Instead of using the non-existent function, we'll calculate it inline
  const calculateActivityMultiplier = (preferences: NutritionPreferencesType): number => {
    // This is a simplified calculation - adjust based on your actual formula
    const baseMultiplier = preferences.activityLevel === 'sedentary' ? 1.2 :
                          preferences.activityLevel === 'lightly_active' ? 1.375 :
                          preferences.activityLevel === 'moderately_active' ? 1.55 :
                          preferences.activityLevel === 'very_active' ? 1.725 : 1.9;
    
    // Apply additional factors based on non-exercise activity and exercise intensity
    const nonExerciseFactor = preferences.nonExerciseActivity ? 
          preferences.nonExerciseActivity / 10 * 0.1 : 0;
    const exerciseIntensityFactor = preferences.exerciseIntensity ?
          preferences.exerciseIntensity / 10 * 0.1 : 0;
          
    return baseMultiplier + nonExerciseFactor + exerciseIntensityFactor;
  };

  const handleActivityLevelChange = (value: string) => {
    onUpdate({ activityLevel: value as any });
  };

  const handleNonExerciseActivityChange = (value: number[]) => {
    onUpdate({ nonExerciseActivity: value[0] });
  };

  const handleExerciseIntensityChange = (value: number[]) => {
    onUpdate({ exerciseIntensity: value[0] });
  };

  // Calculate the activity multiplier based on all factors
  const activityMultiplier = calculateActivityMultiplier(preferences);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="activity-level">Activity Level</Label>
        <Select 
          value={preferences.activityLevel || 'moderately_active'} 
          onValueChange={handleActivityLevelChange}
        >
          <SelectTrigger id="activity-level">
            <SelectValue placeholder="Select activity level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
            <SelectItem value="lightly_active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
            <SelectItem value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
            <SelectItem value="very_active">Very Active (hard exercise 6-7 days/week)</SelectItem>
            <SelectItem value="extremely_active">Extremely Active (professional athlete level)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="non-exercise-activity">
          Non-Exercise Activity (walking, standing, daily movement)
        </Label>
        <Slider 
          id="non-exercise-activity"
          min={0} 
          max={10} 
          step={1}
          value={[preferences.nonExerciseActivity || 5]} 
          onValueChange={handleNonExerciseActivityChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="exercise-intensity">Exercise Intensity</Label>
        <Slider 
          id="exercise-intensity"
          min={0} 
          max={10} 
          step={1}
          value={[preferences.exerciseIntensity || 5]} 
          onValueChange={handleExerciseIntensityChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="text-sm font-medium">Your Activity Multiplier</div>
          <div className="text-2xl font-bold mt-1">{activityMultiplier.toFixed(2)}x</div>
          <p className="text-xs text-muted-foreground mt-1">
            This multiplier is applied to your basal metabolic rate to determine your total daily energy expenditure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
