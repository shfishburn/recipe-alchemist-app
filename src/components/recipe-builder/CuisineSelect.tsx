
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const cuisineOptions = [
  "Italian", "Mexican", "Chinese", "Indian", "Japanese", 
  "Thai", "Mediterranean", "French", "Spanish", "Greek", 
  "Middle Eastern", "American", "Korean", "Vietnamese"
];

interface CuisineSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

const CuisineSelect = ({ value, onChange, id = "cuisine" }: CuisineSelectProps) => {
  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select cuisine" />
        </SelectTrigger>
        <SelectContent>
          {cuisineOptions.map((cuisine) => (
            <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
              {cuisine}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CuisineSelect;
