
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface MacroSplitInputProps {
  preferences: NutritionPreferencesType;
  onChange: (values: Partial<NutritionPreferencesType>) => void;
}

export function MacroSplitInput({ preferences, onChange }: MacroSplitInputProps) {
  const { macroSplit } = preferences;
  
  const handleProteinChange = (value: number[]) => {
    const newProtein = value[0];
    // When adjusting protein, proportionally adjust carbs and fat to maintain 100% total
    const remainingPercentage = 100 - newProtein;
    const currentRemainder = macroSplit.carbs + macroSplit.fat;
    
    let newCarbs = macroSplit.carbs;
    let newFat = macroSplit.fat;
    
    if (currentRemainder > 0) {
      newCarbs = Math.round((macroSplit.carbs / currentRemainder) * remainingPercentage);
      newFat = remainingPercentage - newCarbs;
    } else {
      // If both were 0, split evenly
      newCarbs = Math.round(remainingPercentage / 2);
      newFat = remainingPercentage - newCarbs;
    }
    
    onChange({
      macroSplit: {
        protein: newProtein,
        carbs: newCarbs,
        fat: newFat
      }
    });
  };
  
  const handleCarbsChange = (value: number[]) => {
    const newCarbs = value[0];
    // When adjusting carbs, maintain protein and adjust fat to ensure total is 100%
    const newFat = 100 - newCarbs - macroSplit.protein;
    
    if (newFat >= 0) {
      onChange({
        macroSplit: {
          protein: macroSplit.protein,
          carbs: newCarbs,
          fat: newFat
        }
      });
    }
  };
  
  const handleFatChange = (value: number[]) => {
    const newFat = value[0];
    // When adjusting fat, maintain protein and adjust carbs to ensure total is 100%
    const newCarbs = 100 - newFat - macroSplit.protein;
    
    if (newCarbs >= 0) {
      onChange({
        macroSplit: {
          protein: macroSplit.protein,
          carbs: newCarbs,
          fat: newFat
        }
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="protein-slider">Protein</Label>
          <span className="text-sm font-medium">{macroSplit.protein}%</span>
        </div>
        <Slider 
          id="protein-slider"
          defaultValue={[macroSplit.protein]} 
          max={100} 
          step={1}
          onValueChange={handleProteinChange}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="carbs-slider">Carbs</Label>
          <span className="text-sm font-medium">{macroSplit.carbs}%</span>
        </div>
        <Slider 
          id="carbs-slider"
          defaultValue={[macroSplit.carbs]} 
          max={100 - macroSplit.protein} 
          step={1}
          onValueChange={handleCarbsChange}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="fat-slider">Fat</Label>
          <span className="text-sm font-medium">{macroSplit.fat}%</span>
        </div>
        <Slider 
          id="fat-slider"
          defaultValue={[macroSplit.fat]} 
          max={100 - macroSplit.protein} 
          step={1}
          onValueChange={handleFatChange}
        />
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium mb-2">Macro Split Summary</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm font-semibold">{macroSplit.protein}%</div>
            <div className="text-xs text-gray-500">Protein</div>
          </div>
          <div>
            <div className="text-sm font-semibold">{macroSplit.carbs}%</div>
            <div className="text-xs text-gray-500">Carbs</div>
          </div>
          <div>
            <div className="text-sm font-semibold">{macroSplit.fat}%</div>
            <div className="text-xs text-gray-500">Fat</div>
          </div>
        </div>
      </div>
    </div>
  );
}
