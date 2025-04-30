
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { convertWeightToKg, convertWeightFromKg } from '@/utils/unit-conversion';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface BodyCompositionFormProps {
  preferences: NutritionPreferencesType;
  onSave: (updatedPrefs: NutritionPreferencesType) => void;
}

export function BodyCompositionForm({ preferences, onSave }: BodyCompositionFormProps) {
  const bodyComp = preferences.bodyComposition || {};
  const unitSystem = preferences.unitSystem || 'metric';
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      bodyFatPercentage: bodyComp.bodyFatPercentage || '',
      leanMass: bodyComp.leanMass || '',
      fatMass: bodyComp.fatMass || '',
    }
  });

  const weight = preferences.personalDetails?.weight || 0;
  const displayWeight = convertWeightFromKg(weight, unitSystem);
  const weightUnit = unitSystem === 'metric' ? 'kg' : 'lbs';
  
  const bodyFatPercentage = watch('bodyFatPercentage');
  
  // Calculate lean mass and fat mass when body fat percentage changes
  React.useEffect(() => {
    if (weight && bodyFatPercentage) {
      const bfp = parseFloat(bodyFatPercentage.toString());
      if (!isNaN(bfp)) {
        const fatMass = Math.round((weight * bfp / 100) * 10) / 10;
        const leanMass = Math.round((weight - fatMass) * 10) / 10;
        
        setValue('fatMass', fatMass);
        setValue('leanMass', leanMass);
      }
    }
  }, [bodyFatPercentage, weight, setValue]);

  const onSubmit = (data: any) => {
    const updatedPreferences = {
      ...preferences,
      bodyComposition: {
        bodyFatPercentage: parseFloat(data.bodyFatPercentage.toString()),
        leanMass: parseFloat(data.leanMass.toString()),
        fatMass: parseFloat(data.fatMass.toString()),
      },
    };
    
    onSave(updatedPreferences);
  };

  // Convert lean mass and fat mass for display
  const displayLeanMass = convertWeightFromKg(Number(watch('leanMass') || 0), unitSystem);
  const displayFatMass = convertWeightFromKg(Number(watch('fatMass') || 0), unitSystem);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Composition Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bodyFatPercentage">Body Fat Percentage</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bodyFatPercentage"
                  type="number"
                  step="0.1"
                  className="flex-1"
                  {...register('bodyFatPercentage', {
                    min: { value: 3, message: 'Minimum 3%' },
                    max: { value: 50, message: 'Maximum 50%' },
                  })}
                />
                <span>%</span>
              </div>
              {errors.bodyFatPercentage && (
                <p className="text-sm text-red-500">{errors.bodyFatPercentage.message?.toString()}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="weight"
                  type="number"
                  value={displayWeight.toFixed(1)}
                  disabled
                  className="flex-1 bg-muted"
                />
                <span>{weightUnit}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Set in the Personal Details tab
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leanMass">Lean Mass (calculated)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="leanMass"
                  type="number"
                  step="0.1"
                  className="flex-1"
                  value={displayLeanMass.toFixed(1)}
                  readOnly
                />
                <span>{weightUnit}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fatMass">Fat Mass (calculated)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="fatMass"
                  type="number"
                  step="0.1"
                  className="flex-1"
                  value={displayFatMass.toFixed(1)}
                  readOnly
                />
                <span>{weightUnit}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save Body Composition</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
