
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NutritionPreferencesType } from '@/types/nutrition';
import { CalculationDisplay } from './personal-details/CalculationDisplay';
import { WeightGoalSelector } from './personal-details/WeightGoalSelector';
import { lbsToKg, ftInToCm, cmToFtIn } from '@/utils/unit-conversion';
import { calculateMetabolics } from '@/utils/metabolic-calculations';
import { AgeInput } from './personal-details/AgeInput';
import { GenderSelector } from './personal-details/GenderSelector';
import { WeightInput } from './personal-details/WeightInput';
import { HeightInput } from './personal-details/HeightInput';
import { ActivityLevelSelector } from './personal-details/ActivityLevelSelector';

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

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AgeInput register={register} />
            <GenderSelector register={register} />
            <WeightInput register={register} unitSystem={unitSystem} />
            <HeightInput 
              register={register} 
              unitSystem={unitSystem}
              heightFeet={heightFeet}
              heightInches={heightInches}
              setHeightFeet={setHeightFeet}
              setHeightInches={setHeightInches}
            />
            <ActivityLevelSelector register={register} />
          </div>
          
          <div className="pt-2">
            <WeightGoalSelector 
              control={control}
              weightGoalOptions={weightGoalOptions} 
              setValue={setValue}
              unitSystem={unitSystem}
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
