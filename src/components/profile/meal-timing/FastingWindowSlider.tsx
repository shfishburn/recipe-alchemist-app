
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface FastingWindowSliderProps {
  value: number;
  onChange: (value: number[]) => void;
}

export function FastingWindowSlider({ value, onChange }: FastingWindowSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="fastingWindow">Fasting Window</Label>
        <span className="text-sm font-medium">{value} hours</span>
      </div>
      <Slider 
        id="fastingWindow" 
        value={[value]} 
        min={8}
        max={16}
        step={1}
        onValueChange={onChange} 
      />
      <p className="text-xs text-muted-foreground">
        Time spent not eating each day (e.g., 16:8 intermittent fasting = 16 hour fast)
      </p>
    </div>
  );
}
