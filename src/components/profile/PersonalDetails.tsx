import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { NutritionPreferencesType } from '@/pages/Profile';

interface PersonalDetailsProps {
  preferences: NutritionPreferencesType;
  onSave: (details: Partial<NutritionPreferencesType>) => void;
}

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)', multiplier: 1.2 },
  { value: 'light', label: 'Light (exercise 1-3 days/week)', multiplier: 1.375 },
  { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)', multiplier: 1.55 },
  { value: 'active', label: 'Active (exercise 6-7 days/week)', multiplier: 1.725 },
  { value: 'very-active', label: 'Very Active (professional/intense exercise)', multiplier: 1.9 },
];

const weightGoalOptions = [
  { value: 'maintenance', label: 'Maintain Current Weight', deficit: 0 },
  { value: 'weight-loss-mild', label: 'Mild Weight Loss (0.5 lbs/week)', deficit: 250 },
  { value: 'weight-loss-moderate', label: 'Moderate Weight Loss (1 lb/week)', deficit: 500 },
  { value: 'weight-loss-aggressive', label: 'Aggressive Weight Loss (2 lbs/week)', deficit: 1000 },
  { value: 'muscle-gain', label: 'Muscle Gain (+10% calories)', deficit: -200 },
];

export function PersonalDetails({ preferences, onSave }: PersonalDetailsProps) {
  const personalDetails = preferences.personalDetails || {};
  const weightGoalType = preferences.weightGoalType || 'maintenance';
  const weightGoalDeficit = preferences.weightGoalDeficit || 0;
  
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      age: personalDetails.age || '',
      weight: personalDetails.weight || '',
      height: personalDetails.height || '',
      gender: personalDetails.gender || '',
      activityLevel: personalDetails.activityLevel || 'moderate',
      weightGoalType: weightGoalType,
      weightGoalDeficit: weightGoalDeficit,
    }
  });
  
  const watchAllFields = watch();
  
  const calculateBMR = (data: any) => {
    if (data.age && data.weight && data.height && data.gender) {
      const age = parseInt(data.age);
      const weight = parseInt(data.weight);
      const height = parseInt(data.height);
      
      let bmr = 0;
      if (data.gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      
      const activityMultiplier = activityLevels.find(level => level.value === data.activityLevel)?.multiplier || 1.55;
      const tdee = Math.round(bmr * activityMultiplier);
      
      // Calculate daily calories based on goal
      const goalOption = weightGoalOptions.find(goal => goal.value === data.weightGoalType);
      const deficit = goalOption?.deficit || 0;
      const dailyCalories = tdee - deficit;
      
      // Calculate projected weight loss per week (if in deficit)
      const projectedWeightLossPerWeek = deficit > 0 ? (deficit * 7) / 3500 : 0;
      
      return {
        bmr: Math.round(bmr),
        tdee,
        dailyCalories,
        projectedWeightLossPerWeek,
        deficit
      };
    }
    
    return { bmr: 0, tdee: 0, dailyCalories: 2000, projectedWeightLossPerWeek: 0, deficit: 0 };
  };
  
  const { bmr, tdee, dailyCalories, projectedWeightLossPerWeek, deficit } = calculateBMR(watchAllFields);
  
  const onSubmit = (data: any) => {
    const calculations = calculateBMR(data);
    
    onSave({
      personalDetails: {
        age: parseInt(data.age),
        weight: parseInt(data.weight),
        height: parseInt(data.height),
        gender: data.gender,
        activityLevel: data.activityLevel,
      },
      bmr: calculations.bmr,
      tdee: calculations.tdee,
      dailyCalories: calculations.dailyCalories,
      weightGoalType: data.weightGoalType,
      weightGoalDeficit: calculations.deficit
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Years"
                {...register('age', {
                  min: { value: 18, message: 'Must be at least 18' },
                  max: { value: 100, message: 'Must be less than 100' },
                })}
              />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age.message?.toString()}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                placeholder="kg"
                {...register('weight', {
                  min: { value: 40, message: 'Must be at least 40kg' },
                  max: { value: 200, message: 'Must be less than 200kg' },
                })}
              />
              {errors.weight && (
                <p className="text-sm text-red-500">{errors.weight.message?.toString()}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                placeholder="cm"
                {...register('height', {
                  min: { value: 120, message: 'Must be at least 120cm' },
                  max: { value: 250, message: 'Must be less than 250cm' },
                })}
              />
              {errors.height && (
                <p className="text-sm text-red-500">{errors.height.message?.toString()}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                control={control}
                name="gender"
                rules={{ required: 'Gender is required for BMR calculation' }}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="gender-male" />
                      <Label htmlFor="gender-male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="gender-female" />
                      <Label htmlFor="gender-female">Female</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message?.toString()}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
            <Controller
              control={control}
              name="activityLevel"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weightGoalType">Weight Management Goal</Label>
            <Controller
              control={control}
              name="weightGoalType"
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const goalOption = weightGoalOptions.find(goal => goal.value === value);
                    if (goalOption) {
                      setValue('weightGoalDeficit', goalOption.deficit);
                    }
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {weightGoalOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          {bmr > 0 && (
            <div className="p-4 bg-blue-50 rounded-md space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Basal Metabolic Rate (BMR)</p>
                  <p className="font-semibold">{bmr} calories</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Daily Energy Expenditure (TDEE)</p>
                  <p className="font-semibold">{tdee} calories</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <p className="font-medium">Recommended Daily Calories: {dailyCalories}</p>
                  {deficit > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <p>Calorie Deficit: {deficit} calories per day</p>
                      <p>Projected Weight Loss: {projectedWeightLossPerWeek.toFixed(1)} lbs per week</p>
                    </div>
                  )}
                  {deficit < 0 && (
                    <div className="text-sm text-muted-foreground">
                      <p>Calorie Surplus: {Math.abs(deficit)} calories per day</p>
                      <p>Ideal for muscle gain and recovery</p>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                These calculations are estimates based on your personal details and activity level.
                Adjust your daily calories based on your progress and how you feel.
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button type="submit">Save Personal Details</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
