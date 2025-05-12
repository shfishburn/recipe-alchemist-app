
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SettingsTabProps {
  maxCalories: number;
  onChange: (field: string, value: number) => void;
}

const SettingsTab = ({ maxCalories, onChange }: SettingsTabProps) => {
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

      <div className="mt-6 text-sm text-muted-foreground italic">
        <p>Note: We no longer limit cooking time to allow for traditional recipes that require slow cooking or extended preparation.</p>
      </div>
    </div>
  );
};

export default SettingsTab;
