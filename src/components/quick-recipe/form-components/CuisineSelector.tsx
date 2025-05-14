
import React from 'react';
import { GROUPED_CUISINE_OPTIONS } from '@/config/cuisine-config';
import { MultiSelect, SelectGroup } from '@/components/ui/multi-select';

export interface CuisineSelectorProps {
  value: string[];
  onChange: (cuisine: string[]) => void;
}

export function CuisineSelector({ value, onChange }: CuisineSelectorProps) {
  // Convert cuisine groups to react-select format
  const cuisineGroups: SelectGroup[] = GROUPED_CUISINE_OPTIONS.map(group => ({
    label: group.category,
    options: group.options.map(option => ({
      value: option.value,
      label: option.label
    }))
  }));
  
  // Handle cuisine selection with max 2 limit
  const handleCuisineChange = (selected: string[]) => {
    onChange(selected);
  };

  return (
    <div className="w-full">
      <MultiSelect
        options={cuisineGroups}
        selected={value}
        onChange={handleCuisineChange}
        placeholder="Select cuisine (max 2)"
        maxSelections={2}
        isGrouped={true}
      />
    </div>
  );
}
