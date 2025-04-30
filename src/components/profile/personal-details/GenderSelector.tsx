
import React from 'react';
import { Label } from '@/components/ui/label';

interface GenderSelectorProps {
  register: any;
}

export function GenderSelector({ register }: GenderSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="gender">Gender</Label>
      <select
        id="gender"
        className="w-full rounded-md border border-input bg-background px-3 h-10"
        {...register('gender')}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <p className="text-xs text-muted-foreground">
        Used for metabolic calculations
      </p>
    </div>
  );
}
