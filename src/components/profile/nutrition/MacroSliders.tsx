
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface MacroSlidersProps {
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  onProteinChange: (value: number[]) => void;
  onCarbsChange: (value: number[]) => void;
  onFatChange: (value: number[]) => void;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export function MacroSliders({
  macros,
  onProteinChange,
  onCarbsChange,
  onFatChange,
  proteinGrams,
  carbsGrams,
  fatGrams,
}: MacroSlidersProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="protein">Protein ({macros.protein}%)</Label>
          <span className="text-sm font-medium">{proteinGrams}g</span>
        </div>
        <Slider 
          id="protein" 
          value={[macros.protein]} 
          max={70}
          step={5}
          onValueChange={onProteinChange} 
          className="w-full" 
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="carbs">Carbs ({macros.carbs}%)</Label>
          <span className="text-sm font-medium">{carbsGrams}g</span>
        </div>
        <Slider 
          id="carbs" 
          value={[macros.carbs]} 
          max={70} 
          step={5}
          onValueChange={onCarbsChange} 
          className="w-full" 
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="fat">Fat ({macros.fat}%)</Label>
          <span className="text-sm font-medium">{fatGrams}g</span>
        </div>
        <Slider 
          id="fat" 
          value={[macros.fat]} 
          max={70} 
          step={5}
          onValueChange={onFatChange} 
          className="w-full" 
        />
      </div>
    </div>
  );
}
