
import React, { useState } from 'react';
import ReactSelect, { Props as ReactSelectProps, MultiValue, GroupBase } from 'react-select';
import { cn } from '@/lib/utils';

// Define option shape
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

// Props for our multi-select component
export interface MultiSelectProps {
  options: SelectOption[] | SelectGroup[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
  className?: string;
  isGrouped?: boolean;
}

export function MultiSelect({ 
  options, 
  selected, 
  onChange, 
  placeholder, 
  maxSelections, 
  className,
  isGrouped = false
}: MultiSelectProps) {
  const [error, setError] = useState<string | undefined>();
  
  const getValue = () => {
    if (!selected || selected.length === 0) return [];
    
    const allOptions = isGrouped 
      ? (options as SelectGroup[]).flatMap(group => group.options)
      : options as SelectOption[];
      
    return selected.map(value => {
      const option = allOptions.find(opt => opt.value === value);
      return option || { value, label: value };
    });
  };

  const handleChange = (newValue: MultiValue<SelectOption>) => {
    const selectedValues = newValue.map(item => item.value);
    
    if (maxSelections && selectedValues.length > maxSelections) {
      setError(`Please choose no more than ${maxSelections} options.`);
      return;
    }
    
    setError(undefined);
    onChange(selectedValues);
  };

  // Custom styles matching Tailwind design
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'white',
      borderColor: error ? 'rgb(239, 68, 68)' : 'rgb(229, 231, 235)',
      boxShadow: error ? '0 0 0 1px rgb(239, 68, 68)' : 'none',
      '&:hover': {
        borderColor: error ? 'rgb(239, 68, 68)' : 'rgb(107, 114, 128)'
      },
      // Fix for the blue outline issue
      '&:focus-visible, &:focus': {
        boxShadow: 'none',
        outline: 'none'
      }
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'white',
      zIndex: 50
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? 'rgb(219, 234, 254)' 
        : state.isFocused 
          ? 'rgb(243, 244, 246)'
          : 'white',
      color: 'rgb(55, 65, 81)',
      '&:active': {
        backgroundColor: 'rgb(219, 234, 254)'
      }
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: 'rgb(219, 234, 254)',
      borderRadius: '0.375rem'
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: 'rgb(37, 99, 235)'
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: 'rgb(37, 99, 235)',
      '&:hover': {
        backgroundColor: 'rgb(191, 219, 254)',
        color: 'rgb(37, 99, 235)'
      }
    }),
    groupHeading: (base: any) => ({
      ...base,
      fontWeight: 600,
      fontSize: '0.75rem',
      color: 'rgb(107, 114, 128)',
      textTransform: 'uppercase',
      padding: '8px 12px',
      backgroundColor: 'rgb(249, 250, 251)'
    }),
    // Remove default focus styling
    container: (base: any) => ({
      ...base,
      outline: 'none',
      boxShadow: 'none'
    }),
    // Fix for the blue outline/rectangle
    valueContainer: (base: any) => ({
      ...base,
      outline: 'none'
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      outline: 'none'
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      outline: 'none'
    }),
    clearIndicator: (base: any) => ({
      ...base,
      outline: 'none'
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      outline: 'none'
    })
  };

  return (
    <div className="space-y-1 w-full">
      <ReactSelect
        options={options}
        value={getValue()}
        onChange={handleChange}
        placeholder={placeholder || "Select options..."}
        isMulti
        className={cn("w-full", className)}
        classNamePrefix="multi-select"
        styles={selectStyles}
        noOptionsMessage={() => "No options found"}
        // Override default browser focus styling
        unstyled={false}
        isClearable={true}
        isSearchable={true}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
