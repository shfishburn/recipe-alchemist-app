
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface WeightGoalInputProps {
  preferences: NutritionPreferencesType;
  onChange: (values: Partial<NutritionPreferencesType>) => void;
}

export function WeightGoalInput({ preferences, onChange }: WeightGoalInputProps) {
  const defaultGoalType = preferences.weightGoalType || 'maintenance';
  const defaultDeficit = preferences.weightGoalDeficit || 0;
  
  const handleGoalTypeChange = (value: string) => {
    let deficit = 0;
    
    // Set default deficit values based on goal type
    switch (value) {
      case 'aggressive-loss':
        deficit = -1000;
        break;
      case 'moderate-loss':
        deficit = -500;
        break;
      case 'mild-loss':
        deficit = -250;
        break;
      case 'maintenance':
        deficit = 0;
        break;
      case 'mild-gain':
        deficit = 250;
        break;
      case 'moderate-gain':
        deficit = 500;
        break;
      default:
        deficit = 0;
    }
    
    onChange({
      weightGoalType: value,
      weightGoalDeficit: deficit
    });
  };
  
  const handleDeficitChange = (value: number[]) => {
    // Determine the goal type based on the deficit value
    let goalType = 'maintenance';
    const deficit = value[0];
    
    if (deficit <= -750) {
      goalType = 'aggressive-loss';
    } else if (deficit <= -350) {
      goalType = 'moderate-loss';
    } else if (deficit < 0) {
      goalType = 'mild-loss';
    } else if (deficit === 0) {
      goalType = 'maintenance';
    } else if (deficit <= 300) {
      goalType = 'mild-gain';
    } else {
      goalType = 'moderate-gain';
    }
    
    onChange({
      weightGoalType: goalType,
      weightGoalDeficit: deficit
    });
  };
  
  // Calculate weekly weight change in kg based on deficit
  // 7700 calories ≈ 1kg of body weight
  const weeklyWeightChange = (preferences.weightGoalDeficit || 0) * 7 / 7700;
  const isWeightLoss = weeklyWeightChange < 0;
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="weight-goal">Weight Goal</Label>
        <RadioGroup 
          id="weight-goal"
          defaultValue={defaultGoalType} 
          onValueChange={handleGoalTypeChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-2"
        >
          <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
            <RadioGroupItem value="aggressive-loss" id="aggressive-loss" />
            <Label htmlFor="aggressive-loss">Aggressive Loss</Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
            <RadioGroupItem value="moderate-loss" id="moderate-loss" />
            <Label htmlFor="moderate-loss">Moderate Loss</Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
            <RadioGroupItem value="mild-loss" id="mild-loss" />
            <Label htmlFor="mild-loss">Mild Loss</Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
            <RadioGroupItem value="maintenance" id="maintenance" />
            <Label htmlFor="maintenance">Maintenance</Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
            <RadioGroupItem value="mild-gain" id="mild-gain" />
            <Label htmlFor="mild-gain">Mild Gain</Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
            <RadioGroupItem value="moderate-gain" id="moderate-gain" />
            <Label htmlFor="moderate-gain">Moderate Gain</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="deficit-slider">Daily Calorie Adjustment</Label>
          <span className="text-sm font-medium">
            {(preferences.weightGoalDeficit || 0) > 0 ? '+' : ''}
            {preferences.weightGoalDeficit || 0} kcal
          </span>
        </div>
        <Slider 
          id="deficit-slider"
          defaultValue={[defaultDeficit]} 
          min={-1000}
          max={1000}
          step={50}
          onValueChange={handleDeficitChange}
        />
      </div>
      
      <div className="p-3 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium mb-2">Projected Result</h4>
        <p className="text-sm">
          {weeklyWeightChange === 0 ? (
            "Maintain current weight"
          ) : (
            <>
              {isWeightLoss ? "Lose" : "Gain"} approximately{" "}
              <span className="font-medium">
                {Math.abs(weeklyWeightChange).toFixed(2)} kg
              </span>{" "}
              per week
            </>
          )}
        </p>
      </div>
    </div>
  );
}
