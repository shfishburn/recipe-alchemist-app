
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export interface DietarySelectorProps {
  value: string;
  onChange: (dietary: string) => void;
}

export function DietarySelector({ value, onChange }: DietarySelectorProps) {
  return (
    <div className="w-full">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select dietary preference" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">No Restrictions</SelectItem>
          <SelectItem value="vegetarian">Vegetarian</SelectItem>
          <SelectItem value="vegan">Vegan</SelectItem>
          <SelectItem value="gluten-free">Gluten-Free</SelectItem>
          <SelectItem value="dairy-free">Dairy-Free</SelectItem>
          <SelectItem value="keto">Keto</SelectItem>
          <SelectItem value="paleo">Paleo</SelectItem>
          <SelectItem value="low-carb">Low-Carb</SelectItem>
          <SelectItem value="low-fat">Low-Fat</SelectItem>
          <SelectItem value="high-protein">High-Protein</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
