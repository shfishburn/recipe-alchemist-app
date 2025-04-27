
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { NutritionPreferencesType } from '@/pages/Profile';

interface DietaryPreferencesProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: Partial<NutritionPreferencesType>) => void;
}

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'keto', label: 'Keto' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'low-carb', label: 'Low Carb' },
];

const allergenOptions = [
  { value: 'peanuts', label: 'Peanuts' },
  { value: 'tree-nuts', label: 'Tree Nuts' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'wheat', label: 'Wheat' },
  { value: 'soy', label: 'Soy' },
  { value: 'fish', label: 'Fish' },
  { value: 'shellfish', label: 'Shellfish' },
];

const healthGoalOptions = [
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'muscle-gain', label: 'Muscle Gain' },
  { value: 'general-health', label: 'General Health' },
];

export function DietaryPreferences({ preferences, onSave }: DietaryPreferencesProps) {
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
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Dietary Restrictions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Controller
                  control={control}
                  name="dietaryRestrictions"
                  render={({ field }) => (
                    <>
                      {dietaryOptions.map((option) => (
                        <div className="flex items-center space-x-2" key={option.id}>
                          <Checkbox
                            id={option.id}
                            checked={field.value.includes(option.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, option.id]);
                              } else {
                                field.onChange(field.value.filter((value: string) => value !== option.id));
                              }
                            }}
                          />
                          <Label htmlFor={option.id} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </>
                  )}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Allergens</h3>
              <Controller
                control={control}
                name="allergens"
                render={({ field }) => (
                  <Select 
                    value={field.value.join(',')}
                    onValueChange={(value) => {
                      if (value === '') {
                        field.onChange([]);
                      } else {
                        field.onChange(value.split(','));
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select allergens" />
                    </SelectTrigger>
                    <SelectContent>
                      {allergenOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Selected allergens: {preferences.allergens?.join(', ') || 'None'}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Health Goal</h3>
              <Controller
                control={control}
                name="healthGoal"
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {healthGoalOptions.map((option) => (
                      <div className="flex items-center space-x-2" key={option.value}>
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Meal Size Preference</h3>
              <Controller
                control={control}
                name="mealSizePreference"
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="meal-size-small" />
                      <Label htmlFor="meal-size-small">Small</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="meal-size-medium" />
                      <Label htmlFor="meal-size-medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="meal-size-large" />
                      <Label htmlFor="meal-size-large">Large</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Dietary Preferences</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
