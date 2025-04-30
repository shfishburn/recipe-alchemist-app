
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AgeInputProps {
  register: any;
}

export function AgeInput({ register }: AgeInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="age">Age</Label>
      <Input
        id="age"
        type="number"
        min="18"
        max="100"
        {...register('age')}
      />
    </div>
  );
}
