
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { NutritionPreferencesType } from '@/types/nutrition';
import { WeightGoalSelector } from './personal-details/WeightGoalSelector';
import { CalculationDisplay } from './personal-details/CalculationDisplay';
import { calculateRMR } from '@/utils/body-composition';

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
  
  // Get body fat percentage if available
  const bodyFatPercentage = preferences.bodyComposition?.bodyFatPercentage;

  const calculateBMR = (data: any) => {
    if (data.age && data.weight && data.height && data.gender) {
      const age = parseInt(data.age);
      const weight = parseInt(data.weight);
      const height = parseInt(data.height);
      
      let bmr = 0;
      
      // Use the calculateRMR function if body fat percentage is available
      if (bodyFatPercentage !== undefined) {
        bmr = calculateRMR({
          age,
          gender: data.gender,
          weight,
          height,
          bodyFatPercentage,
        });
      } else {
        // Use the standard Mifflin-St Jeor equation if body fat is not available
        if (data.gender === 'male') {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
      }
      
      // If the user has activity components, use the more detailed calculation method
      const tdee = preferences.activityComponents 
        ? Math.round(bmr * (preferences.activityComponents?.occupationMultiplier || 0) 
                         + bmr * (preferences.activityComponents?.dailyMovementMultiplier || 0)
                         + bmr * (preferences.activityComponents?.exerciseMultiplier || 0)
                         + bmr)
        : Math.round(bmr * (activityLevels.find(level => level.value === data.activityLevel)?.multiplier || 1.55));
      
      const goalOption = weightGoalOptions.find(goal => goal.value === data.weightGoalType);
      const deficit = goalOption?.deficit || 0;
      const dailyCalories = tdee - deficit;
      
      const projectedWeightLossPerWeek = deficit > 0 ? (deficit * 7) / 3500 : 0;
      
      // Account for metabolic adaptation if tracking data is available
      let adaptedTDEE = tdee;
      if (preferences.adaptationTracking?.adaptationPercentage) {
        const adaptationMultiplier = 1 - (preferences.adaptationTracking.adaptationPercentage / 100);
        adaptedTDEE = Math.round(tdee * adaptationMultiplier);
      }
      
      return {
        bmr: Math.round(bmr),
        tdee,
        adaptedTDEE,
        dailyCalories,
        projectedWeightLossPerWeek,
        deficit
      };
    }
    
    return { 
      bmr: 0, 
      tdee: 0, 
      adaptedTDEE: 0, 
      dailyCalories: 2000, 
      projectedWeightLossPerWeek: 0, 
      deficit: 0 
    };
  };
  
  const { bmr, tdee, adaptedTDEE, dailyCalories, projectedWeightLossPerWeek, deficit } = calculateBMR(watchAllFields);

  const onSubmit = (data: any) => {
    const calculations = calculateBMR(data);
    
    // If body composition data exists, calculate lean mass and fat mass
    let bodyCompositionData = preferences.bodyComposition;
    if (data.weight && bodyFatPercentage !== undefined) {
      const weight = parseInt(data.weight);
      const fatMass = Math.round((weight * bodyFatPercentage / 100) * 10) / 10;
      const leanMass = Math.round((weight - fatMass) * 10) / 10;
      
      bodyCompositionData = {
        ...bodyCompositionData,
        fatMass,
        leanMass,
        bodyFatPercentage
      };
    }
    
    // Initialize or update adaptation tracking
    const adaptationTracking = preferences.adaptationTracking || {};
    if (!adaptationTracking.initialWeight && data.weight) {
      adaptationTracking.initialWeight = parseInt(data.weight);
      adaptationTracking.initialTDEE = calculations.tdee;
    }
    
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
      weightGoalDeficit: calculations.deficit,
      bodyComposition: bodyCompositionData,
      adaptationTracking
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
          
          {!preferences.activityComponents && (
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
              {preferences.activityComponents && (
                <p className="text-xs text-blue-600">
                  Using detailed activity components from the Body Composition tab instead.
                </p>
              )}
            </div>
          )}
          
          {preferences.activityComponents && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm font-medium">Using detailed activity components:</p>
              <div className="text-xs text-muted-foreground mt-1">
                <p>• Occupation: {preferences.activityComponents.occupation}</p>
                <p>• Daily Movement: {preferences.activityComponents.dailyMovement}</p>
                <p>• Structured Exercise: {preferences.activityComponents.structuredExercise}</p>
              </div>
              <p className="text-xs mt-2">You can edit these in the Body Composition tab</p>
            </div>
          )}
          
          <WeightGoalSelector 
            control={control}
            weightGoalOptions={weightGoalOptions}
            setValue={setValue}
          />
          
          {bmr > 0 && (
            <CalculationDisplay 
              bmr={bmr}
              tdee={tdee}
              dailyCalories={dailyCalories}
              deficit={deficit}
              projectedWeightLossPerWeek={projectedWeightLossPerWeek}
              adaptedTDEE={adaptedTDEE}
              hasAdaptation={!!preferences.adaptationTracking?.adaptationPercentage}
            />
          )}
          
          <div className="flex justify-end">
            <Button type="submit">Save Personal Details</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
