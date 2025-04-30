
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { NutritionPreferencesType } from '@/types/nutrition';
import { DietaryRestrictions } from './DietaryRestrictions';
import { AllergenSelector } from './AllergenSelector';
import { HealthGoalSelector } from './HealthGoalSelector';
import { MealSizeSelector } from './MealSizeSelector';
import { useIsMobile } from '@/hooks/use-mobile';

interface DietaryPreferencesProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: Partial<NutritionPreferencesType> | NutritionPreferencesType) => void;
}

export function DietaryPreferences({ preferences, onSave }: DietaryPreferencesProps) {
  const isMobile = useIsMobile();
  
  // Basic Dietary Preferences
  const { control, handleSubmit } = useForm({
    defaultValues: {
      dietaryRestrictions: preferences.dietaryRestrictions || [],
      allergens: preferences.allergens || [],
      healthGoal: preferences.healthGoal || 'maintenance',
      mealSizePreference: preferences.mealSizePreference || 'medium',
    }
  });

  // Form submission
  const onDietarySubmit = (data: any) => {
    onSave({
      dietaryRestrictions: data.dietaryRestrictions,
      allergens: data.allergens,
      healthGoal: data.healthGoal,
      mealSizePreference: data.mealSizePreference,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dietary Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onDietarySubmit)}>
          <div className={`space-y-6 ${isMobile ? '' : 'grid grid-cols-2 gap-6'}`}>
            <div className="space-y-6">
              <DietaryRestrictions control={control} />
              <AllergenSelector control={control} preferences={preferences} />
            </div>
            
            <div className="space-y-6">
              <HealthGoalSelector control={control} />
              <MealSizeSelector control={control} />
            </div>
            
            <div className={`flex justify-end ${isMobile ? '' : 'col-span-2'}`}>
              <Button type="submit">Save Dietary Preferences</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
