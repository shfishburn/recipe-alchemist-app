
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { NutritionPreferencesType } from '@/types/nutrition';
import { DietaryRestrictions } from './dietary/DietaryRestrictions';
import { AllergenSelector } from './dietary/AllergenSelector';
import { HealthGoalSelector } from './dietary/HealthGoalSelector';
import { MealSizeSelector } from './dietary/MealSizeSelector';
import { useIsMobile } from '@/hooks/use-mobile';

interface DietaryPreferencesProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: Partial<NutritionPreferencesType>) => void;
}

export function DietaryPreferences({ preferences, onSave }: DietaryPreferencesProps) {
  const isMobile = useIsMobile();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      dietaryRestrictions: preferences.dietaryRestrictions || [],
      allergens: preferences.allergens || [],
      healthGoal: preferences.healthGoal || 'maintenance',
      mealSizePreference: preferences.mealSizePreference || 'medium',
    }
  });

  const onSubmit = (data: any) => {
    onSave({
      dietaryRestrictions: data.dietaryRestrictions,
      allergens: data.allergens,
      healthGoal: data.healthGoal,
      mealSizePreference: data.mealSizePreference,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
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
