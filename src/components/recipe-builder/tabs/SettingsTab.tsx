
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SettingsTabProps {
  maxCalories: number;
  maxMinutes: number;
  onChange: (field: string, value: number) => void;
}

const SettingsTab = ({ maxCalories, maxMinutes, onChange }: SettingsTabProps) => {
  return (
    <div className="space-y-6 pt-4">
      {/* Max Calories */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="calories">Max Calories per Serving</Label>
          <span className="text-sm text-muted-foreground">{maxCalories} kcal</span>
        </div>
        <Slider
          id="calories"
          min={200}
          max={1200}
          step={50}
          value={[maxCalories]}
          onValueChange={(values) => onChange('maxCalories', values[0])}
          className="py-4"
        />
      </div>

      {/* Max Time */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="time">Max Total Time</Label>
          <span className="text-sm text-muted-foreground">{maxMinutes} minutes</span>
        </div>
        <Slider
          id="time"
          min={10}
          max={120}
          step={5}
          value={[maxMinutes]}
          onValueChange={(values) => onChange('maxMinutes', values[0])}
          className="py-4"
        />
      </div>
    </div>
  );
};

export default SettingsTab;
