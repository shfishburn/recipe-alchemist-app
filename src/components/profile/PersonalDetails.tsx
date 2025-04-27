
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
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'light', label: 'Light (exercise 1-3 days/week)' },
  { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
  { value: 'active', label: 'Active (exercise 6-7 days/week)' },
  { value: 'very-active', label: 'Very Active (professional/intense exercise)' },
];

export function PersonalDetails({ preferences, onSave }: PersonalDetailsProps) {
  const personalDetails = preferences.personalDetails || {};
  
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      age: personalDetails.age || '',
      weight: personalDetails.weight || '',
      height: personalDetails.height || '',
      gender: personalDetails.gender || '',
      activityLevel: personalDetails.activityLevel || 'moderate',
    }
  });
  
  const watchAllFields = watch();
  
  // Calculate estimated BMR based on form inputs
  const calculateBMR = (data: any) => {
    if (data.age && data.weight && data.height && data.gender) {
      const age = parseInt(data.age);
      const weight = parseInt(data.weight);
      const height = parseInt(data.height);
      
      let bmr = 0;
      if (data.gender === 'male') {
        // Men: BMR = 10W + 6.25H - 5A + 5
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        // Women: BMR = 10W + 6.25H - 5A - 161
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      
      const activityMultipliers: Record<string, number> = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very-active': 1.9
      };
      
      const tdee = Math.round(bmr * activityMultipliers[data.activityLevel]);
      
      return {
        bmr: Math.round(bmr),
        tdee
      };
    }
    
    return { bmr: 0, tdee: 0 };
  };
  
  const { bmr, tdee } = calculateBMR(watchAllFields);
  
  const onSubmit = (data: any) => {
    const { bmr, tdee } = calculateBMR(data);
    
    onSave({
      personalDetails: {
        age: parseInt(data.age),
        weight: parseInt(data.weight),
        height: parseInt(data.height),
        gender: data.gender,
        activityLevel: data.activityLevel,
      },
      bmr,
      tdee
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
          
          {bmr > 0 && (
            <div className="p-4 bg-blue-50 rounded-md space-y-2">
              <p className="font-medium">Estimated Daily Calories:</p>
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
              <p className="text-xs text-muted-foreground mt-2">
                BMR is the number of calories your body needs at complete rest.
                TDEE includes your activity level and is the recommended daily intake for maintenance.
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
