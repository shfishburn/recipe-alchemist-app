import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NutritionPreferencesType } from '@/types/nutrition';
import { CalculationDisplay } from './personal-details/CalculationDisplay';
import { WeightGoalSelector } from './personal-details/WeightGoalSelector';
import { lbsToKg, ftInToCm, cmToFtIn } from '@/utils/unit-conversion';

interface PersonalDetailsProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: NutritionPreferencesType) => void;
}

export function PersonalDetails({ preferences, onSave }: PersonalDetailsProps) {
  const [heightFeet, setHeightFeet] = useState<number>(() => {
    if (preferences.personalDetails?.height) {
      const { feet } = cmToFtIn(preferences.personalDetails.height);
      return feet;
    }
    return 5; // default
  });
  
  const [heightInches, setHeightInches] = useState<number>(() => {
    if (preferences.personalDetails?.height) {
      const { inches } = cmToFtIn(preferences.personalDetails.height);
      return inches;
    }
    return 10; // default
  });

  const unitSystem = preferences.unitSystem || 'metric';

  const { register, handleSubmit, watch, setValue, control } = useForm({
    defaultValues: {
      age: preferences.personalDetails?.age || 30,
      weight: unitSystem === 'metric' 
        ? preferences.personalDetails?.weight || 70
        : preferences.personalDetails?.weight 
          ? preferences.personalDetails.weight * 2.20462
          : 154,
      height: preferences.personalDetails?.height || 170,
      gender: preferences.personalDetails?.gender || 'male',
      activityLevel: preferences.personalDetails?.activityLevel || 'moderate',
      weightGoalType: preferences.weightGoalType || 'maintenance',
      weightGoalDeficit: preferences.weightGoalDeficit || 0
    }
  });

  // Define weight goal options
  const weightGoalOptions = [
    { value: 'aggressive-loss', label: 'Aggressive Weight Loss (1kg/week)', deficit: -1000 },
    { value: 'moderate-loss', label: 'Moderate Weight Loss (0.5kg/week)', deficit: -500 },
    { value: 'mild-loss', label: 'Mild Weight Loss (0.25kg/week)', deficit: -250 },
    { value: 'maintenance', label: 'Maintenance', deficit: 0 },
    { value: 'mild-gain', label: 'Mild Weight Gain', deficit: 250 },
    { value: 'moderate-gain', label: 'Moderate Weight Gain', deficit: 500 }
  ];

  const onSubmit = (data: any) => {
    // Convert weight to kg if using imperial
    const weightInKg = unitSystem === 'metric' ? 
      Number(data.weight) : 
      lbsToKg(Number(data.weight));

    // Convert height to cm if using imperial
    const heightInCm = unitSystem === 'metric' ?
      Number(data.height) :
      ftInToCm(heightFeet, heightInches);
    
    const updatedPreferences = {
      ...preferences,
      personalDetails: {
        age: Number(data.age),
        weight: weightInKg,
        height: heightInCm,
        gender: data.gender,
        activityLevel: data.activityLevel
      },
      weightGoalType: data.weightGoalType,
      weightGoalDeficit: Number(data.weightGoalDeficit)
    };
    
    // Calculate BMR (Basal Metabolic Rate)
    const { bmr, tdee, adaptedTDEE } = calculateMetabolics(updatedPreferences);
    updatedPreferences.bmr = Math.round(bmr);
    updatedPreferences.tdee = Math.round(tdee);
    
    onSave(updatedPreferences);
  };

  function calculateMetabolics(prefs: NutritionPreferencesType) {
    const { age, weight, height, gender, activityLevel } = prefs.personalDetails || {};
    
    if (!age || !weight || !height || !gender) {
      return { bmr: 0, tdee: 0 };
    }
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Activity multipliers
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * (activityMultipliers[activityLevel || 'moderate'] || 1.55);
    
    // Calculate adapted TDEE if there's adaptation tracking
    let adaptedTDEE = tdee;
    if (prefs.adaptationTracking?.adaptationPercentage) {
      adaptedTDEE = tdee * (1 - prefs.adaptationTracking.adaptationPercentage / 100);
    }
    
    return { bmr, tdee, adaptedTDEE };
  }
  
  const calculatedBMR = preferences.bmr || 0;
  const calculatedTDEE = preferences.tdee || 0;
  const goalDeficit = preferences.weightGoalDeficit || 0;
  const dailyCalories = Math.max(1200, calculatedTDEE + goalDeficit);
  
  // Calculate projected weekly weight loss (1kg of fat ~= 7700 calories)
  const deficit = goalDeficit < 0 ? Math.abs(goalDeficit) : 0;
  const projectedWeightLossPerWeek = (deficit * 7) / 7700;
  
  // Check if we have adaptation data
  const hasAdaptation = preferences.adaptationTracking?.adaptationPercentage && 
                       preferences.adaptationTracking.adaptationPercentage > 0;
  
  const adaptedTDEE = hasAdaptation && preferences.adaptationTracking?.adaptationPercentage ?
    Math.round(calculatedTDEE * (1 - preferences.adaptationTracking.adaptationPercentage / 100)) :
    undefined;
  
  const watchWeight = watch('weight');
  const watchHeight = watch('height');
  const watchGender = watch('gender');
  const watchAge = watch('age');
  const watchActivityLevel = watch('activityLevel');

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                {...register('age')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                className="w-full rounded-md border border-input bg-background px-3 h-10"
                {...register('gender')}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Used for metabolic calculations
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight {unitSystem === 'metric' ? '(kg)' : '(lbs)'}</Label>
              <Input
                id="weight"
                type="number"
                min="40"
                max={unitSystem === 'metric' ? "200" : "440"}
                step="0.1"
                {...register('weight')}
              />
            </div>
            
            {unitSystem === 'metric' ? (
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  min="140"
                  max="220"
                  {...register('height')}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="height">Height (ft/in)</Label>
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 h-10"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(Number(e.target.value))}
                    >
                      {[4, 5, 6, 7].map(feet => (
                        <option key={feet} value={feet}>{feet} ft</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/2">
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 h-10"
                      value={heightInches} 
                      onChange={(e) => setHeightInches(Number(e.target.value))}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>{i} in</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activity Level</Label>
              <select
                id="activityLevel"
                className="w-full rounded-md border border-input bg-background px-3 h-10"
                {...register('activityLevel')}
              >
                <option value="sedentary">Sedentary (office job, little exercise)</option>
                <option value="light">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="moderate">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="active">Very Active (hard exercise 6-7 days/week)</option>
                <option value="veryActive">Extremely Active (hard daily exercise or physical job)</option>
              </select>
            </div>
          </div>
          
          <div className="pt-2">
            <WeightGoalSelector 
              control={control}
              weightGoalOptions={weightGoalOptions} 
              setValue={setValue}
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Calculate & Save</Button>
          </div>
        </form>

        {(calculatedBMR > 0 && calculatedTDEE > 0) && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Your Calculated Nutrition Values</h3>
            <CalculationDisplay 
              bmr={calculatedBMR}
              tdee={calculatedTDEE}
              dailyCalories={dailyCalories}
              deficit={deficit}
              projectedWeightLossPerWeek={projectedWeightLossPerWeek}
              adaptedTDEE={adaptedTDEE}
              hasAdaptation={hasAdaptation}
              unitSystem={unitSystem}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
