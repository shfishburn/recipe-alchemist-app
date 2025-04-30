
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateActivityMultiplier } from '@/utils/body-composition';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface ActivityComponentsInputProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: NutritionPreferencesType) => void;
}

const occupationOptions = [
  { value: 'sedentary', label: 'Sedentary (Office job, desk work)', multiplier: 0.1 },
  { value: 'light', label: 'Light (Teacher, retail, light housework)', multiplier: 0.175 },
  { value: 'moderate', label: 'Moderate (Server, cleaning, childcare)', multiplier: 0.25 },
  { value: 'heavy', label: 'Heavy (Construction, agriculture)', multiplier: 0.35 },
  { value: 'very-heavy', label: 'Very Heavy (Heavy manual labor)', multiplier: 0.45 },
];

const dailyMovementOptions = [
  { value: 'minimal', label: 'Minimal (< 4,000 steps/day)', multiplier: 0.05 },
  { value: 'light', label: 'Light (4,000-7,000 steps/day)', multiplier: 0.1 },
  { value: 'moderate', label: 'Moderate (7,000-10,000 steps/day)', multiplier: 0.15 },
  { value: 'active', label: 'Active (10,000-15,000 steps/day)', multiplier: 0.2 },
  { value: 'very-active', label: 'Very Active (> 15,000 steps/day)', multiplier: 0.25 },
];

const exerciseOptions = [
  { value: 'none', label: 'None (No structured exercise)', multiplier: 0.0 },
  { value: 'light', label: 'Light (1-2 sessions/week, low intensity)', multiplier: 0.1 },
  { value: 'moderate', label: 'Moderate (2-3 sessions/week, moderate intensity)', multiplier: 0.2 },
  { value: 'active', label: 'Active (3-4 sessions/week, moderate-high intensity)', multiplier: 0.3 },
  { value: 'athlete', label: 'Athletic (5+ sessions/week, high intensity)', multiplier: 0.4 },
];

export function ActivityComponentsInput({ preferences, onSave }: ActivityComponentsInputProps) {
  const activityComponents = preferences.activityComponents || {};
  
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      occupation: activityComponents.occupation || 'sedentary',
      dailyMovement: activityComponents.dailyMovement || 'minimal',
      structuredExercise: activityComponents.structuredExercise || 'none',
    }
  });

  const occupation = watch('occupation');
  const dailyMovement = watch('dailyMovement');
  const structuredExercise = watch('structuredExercise');
  
  const activityMultiplier = React.useMemo(() => {
    return calculateActivityMultiplier({ occupation, dailyMovement, structuredExercise });
  }, [occupation, dailyMovement, structuredExercise]);

  const getMultiplierForOption = (options: any[], value: string): number => {
    const option = options.find(opt => opt.value === value);
    return option?.multiplier || 0;
  };

  const onSubmit = (data: any) => {
    const occupationMultiplier = getMultiplierForOption(occupationOptions, data.occupation);
    const dailyMovementMultiplier = getMultiplierForOption(dailyMovementOptions, data.dailyMovement);
    const exerciseMultiplier = getMultiplierForOption(exerciseOptions, data.structuredExercise);
    
    const updatedPreferences = {
      ...preferences,
      activityComponents: {
        occupation: data.occupation,
        dailyMovement: data.dailyMovement,
        structuredExercise: data.structuredExercise,
        occupationMultiplier,
        dailyMovementMultiplier,
        exerciseMultiplier,
      },
      tdee: preferences.bmr ? Math.round(preferences.bmr * activityMultiplier.totalMultiplier) : undefined,
    };
    
    onSave(updatedPreferences);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Components</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupational Activity</Label>
              <Controller
                control={control}
                name="occupation"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your occupation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {occupationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-muted-foreground">
                Multiplier: +{getMultiplierForOption(occupationOptions, occupation).toFixed(2)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dailyMovement">Daily Movement</Label>
              <Controller
                control={control}
                name="dailyMovement"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your daily movement level" />
                    </SelectTrigger>
                    <SelectContent>
                      {dailyMovementOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-muted-foreground">
                Multiplier: +{getMultiplierForOption(dailyMovementOptions, dailyMovement).toFixed(2)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="structuredExercise">Structured Exercise</Label>
              <Controller
                control={control}
                name="structuredExercise"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your exercise frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciseOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-muted-foreground">
                Multiplier: +{getMultiplierForOption(exerciseOptions, structuredExercise).toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Total Activity Multiplier</h3>
              <span className="text-lg font-bold">{activityMultiplier.totalMultiplier.toFixed(2)}</span>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Base (BMR)</span>
                <span>1.0</span>
              </div>
              <div className="flex justify-between">
                <span>Occupation</span>
                <span>+{activityMultiplier.components.occupation.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Movement</span>
                <span>+{activityMultiplier.components.dailyLife.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Structured Exercise</span>
                <span>+{activityMultiplier.components.exercise.toFixed(2)}</span>
              </div>
            </div>
            
            {preferences.bmr && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex justify-between">
                  <span className="font-medium">Estimated TDEE:</span>
                  <span className="font-bold">{Math.round(preferences.bmr * activityMultiplier.totalMultiplier)} calories</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save Activity Settings</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
