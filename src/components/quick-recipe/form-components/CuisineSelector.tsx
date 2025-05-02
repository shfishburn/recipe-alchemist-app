
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export interface CuisineSelectorProps {
  value: string;
  onChange: (cuisine: string) => void;
}

export function CuisineSelector({ value, onChange }: CuisineSelectorProps) {
  return (
    <div className="w-full">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select cuisine" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Cuisine</SelectItem>
          <SelectItem value="italian">Italian</SelectItem>
          <SelectItem value="mexican">Mexican</SelectItem>
          <SelectItem value="asian">Asian</SelectItem>
          <SelectItem value="indian">Indian</SelectItem>
          <SelectItem value="mediterranean">Mediterranean</SelectItem>
          <SelectItem value="american">American</SelectItem>
          <SelectItem value="french">French</SelectItem>
          <SelectItem value="cajun">Cajun</SelectItem>
          <SelectItem value="thai">Thai</SelectItem>
          <SelectItem value="japanese">Japanese</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
