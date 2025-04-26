
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const dietaryOptions = [
  "No Restrictions", "Vegetarian", "Vegan", "Pescatarian",
  "Gluten-Free", "Dairy-Free", "Keto", "Paleo",
  "Low-Carb", "Low-Fat", "Low-Sodium", "High-Protein"
];

interface DietarySelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

const DietarySelect = ({ value, onChange, id = "dietary" }: DietarySelectProps) => {
  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select dietary preference" />
        </SelectTrigger>
        <SelectContent>
          {dietaryOptions.map((diet) => (
            <SelectItem key={diet} value={diet.toLowerCase().replace(/ /g, '-')}>
              {diet}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DietarySelect;
