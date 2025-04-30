
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { NutritionPreferencesType } from '@/types/nutrition';
import { Switch } from '@/components/ui/switch';
import { useUnitSystem } from '@/hooks/use-unit-system';

interface WeightManagementGoalsProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: Partial<NutritionPreferencesType>) => void;
}

export function WeightManagementGoals({ preferences, onSave }: WeightManagementGoalsProps) {
  const { unitSystem } = useUnitSystem();
  const weightUnit = unitSystem === 'metric' ? 'kg' : 'lbs';
  
  // Define weight goal options
  const weightGoalOptions = [
    { value: 'aggressive-loss', label: `Aggressive Weight Loss (1${weightUnit === 'kg' ? 'kg' : 'lb'}/week)`, deficit: -1000 },
    { value: 'moderate-loss', label: `Moderate Weight Loss (0.5${weightUnit === 'kg' ? 'kg' : 'lb'}/week)`, deficit: -500 },
    { value: 'mild-loss', label: `Mild Weight Loss (0.25${weightUnit === 'kg' ? 'kg' : 'lb'}/week)`, deficit: -250 },
    { value: 'maintenance', label: 'Maintenance', deficit: 0 },
    { value: 'mild-gain', label: 'Mild Weight Gain', deficit: 250 },
    { value: 'moderate-gain', label: 'Moderate Weight Gain', deficit: 500 }
  ];
  
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      weightGoalType: preferences.weightGoalType || 'maintenance',
      weightGoalDeficit: preferences.weightGoalDeficit || 0,
      enableMatador: preferences.matadorProtocol?.enabled || false,
      dietPhaseLength: preferences.matadorProtocol?.dietPhaseLength || 14,
      breakPhaseLength: preferences.matadorProtocol?.breakPhaseLength || 7,
    }
  });
  
  const weightGoalType = watch('weightGoalType');
  const weightGoalDeficit = watch('weightGoalDeficit');
  const enableMatador = watch('enableMatador');
  
  const handleSelectChange = (value: string) => {
    setValue('weightGoalType', value);
    const selectedOption = weightGoalOptions.find(option => option.value === value);
    if (selectedOption) {
      setValue('weightGoalDeficit', selectedOption.deficit);
    }
  };
  
  const onFormSubmit = (data: any) => {
    const updatedPreferences = {
      ...preferences,
      weightGoalType: data.weightGoalType,
      weightGoalDeficit: Number(data.weightGoalDeficit),
      matadorProtocol: {
        enabled: data.enableMatador,
        dietPhaseLength: Number(data.dietPhaseLength),
        breakPhaseLength: Number(data.breakPhaseLength),
        currentPhase: preferences.matadorProtocol?.currentPhase || 'diet',
        phaseStartDate: preferences.matadorProtocol?.phaseStartDate || new Date().toISOString(),
        schedule: preferences.matadorProtocol?.schedule || [],
      }
    };
    
    onSave(updatedPreferences);
  };

  // Calculate daily calorie target based on TDEE and deficit
  const tdee = preferences.tdee || 2000;
  const dailyCalories = Math.max(1200, tdee + (weightGoalDeficit || 0));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Management Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weightGoalType">Weight Goal</Label>
              <Controller
                control={control}
                name="weightGoalType"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weight goal" />
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
            
            <div className="space-y-2">
              <Label htmlFor="weightGoalDeficit">Daily Calorie Adjustment</Label>
              <div className="pt-2">
                <Controller
                  control={control}
                  name="weightGoalDeficit"
                  render={({ field }) => (
                    <div className="space-y-4">
                      <Slider
                        value={[parseInt(field.value.toString())]}
                        min={-1000}
                        max={1000}
                        step={50}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">-1000</span>
                        <Input 
                          type="number" 
                          value={field.value} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="w-24" 
                        />
                        <span className="text-sm">+1000</span>
                      </div>
                    </div>
                  )}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Daily target: {dailyCalories} calories
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-4">Advanced Weight Management</h3>
              
              <div className="flex items-center justify-between space-x-2 mb-4">
                <Label htmlFor="enableMatador">Enable MATADOR Protocol</Label>
                <Controller
                  control={control}
                  name="enableMatador"
                  render={({ field }) => (
                    <Switch
                      id="enableMatador"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                The MATADOR protocol alternates between periods of caloric deficit and maintenance to mitigate metabolic adaptation during weight loss.
              </p>
              
              {enableMatador && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dietPhaseLength">Diet Phase (days)</Label>
                    <Controller
                      control={control}
                      name="dietPhaseLength"
                      render={({ field }) => (
                        <Input
                          id="dietPhaseLength"
                          type="number"
                          min={7}
                          max={42}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="breakPhaseLength">Break Phase (days)</Label>
                    <Controller
                      control={control}
                      name="breakPhaseLength"
                      render={({ field }) => (
                        <Input
                          id="breakPhaseLength"
                          type="number"
                          min={3}
                          max={21}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save Weight Management Goals</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
