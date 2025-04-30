
import React from 'react';
import { Label } from '@/components/ui/label';

interface ActivityLevelSelectorProps {
  register: any;
}

export function ActivityLevelSelector({ register }: ActivityLevelSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="activityLevel">Activity Level</Label>
      <select
        id="activityLevel"
        className="w-full rounded-md border border-input bg-background px-3 h-10"
        {...register('activityLevel')}
      >
        <option value="sedentary">Sedentary (office job, little exercise)</option>
        <option value="light">Lightly Active (light exercise 1-3 days/week)</option>
        <option value="moderate">Moderately Active (moderate exercise 3-5 days/week)</option>
        <option value="active">Very Active (hard exercise 6-7 days/week)</option>
        <option value="veryActive">Extremely Active (hard daily exercise or physical job)</option>
      </select>
    </div>
  );
}
