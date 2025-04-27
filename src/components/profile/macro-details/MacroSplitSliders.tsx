
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface MacroSplitSlidersProps {
  carbSplit: {
    complex: number;
    simple: number;
  };
  fatSplit: {
    saturated: number;
    unsaturated: number;
  };
  onComplexCarbsChange: (value: number[]) => void;
  onSaturatedFatChange: (value: number[]) => void;
}

export function MacroSplitSliders({ 
  carbSplit, 
  fatSplit, 
  onComplexCarbsChange,
  onSaturatedFatChange
}: MacroSplitSlidersProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Carbohydrate Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="complexCarbs">Complex Carbs ({carbSplit.complex}%)</Label>
            <span className="text-sm font-medium">Whole grains, vegetables, legumes</span>
          </div>
          <Slider 
            id="complexCarbs" 
            value={[carbSplit.complex]} 
            max={100}
            step={5}
            onValueChange={onComplexCarbsChange} 
          />
        </div>
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <Label htmlFor="simpleCarbs">Simple Carbs ({carbSplit.simple}%)</Label>
            <span className="text-sm font-medium">Fruits, honey, sugar</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-300 transition-all" 
              style={{ width: `${carbSplit.simple}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Fat Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="saturatedFat">Saturated Fat ({fatSplit.saturated}%)</Label>
            <span className="text-sm font-medium">Animal products, coconut oil</span>
          </div>
          <Slider 
            id="saturatedFat" 
            value={[fatSplit.saturated]} 
            max={100}
            step={5}
            onValueChange={onSaturatedFatChange} 
          />
        </div>
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <Label htmlFor="unsaturatedFat">Unsaturated Fat ({fatSplit.unsaturated}%)</Label>
            <span className="text-sm font-medium">Olive oil, nuts, avocados</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-300 transition-all" 
              style={{ width: `${fatSplit.unsaturated}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
