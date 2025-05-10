
import React, { useState } from 'react';
import ReactSelect, { Props as ReactSelectProps, MultiValue, GroupBase } from 'react-select';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

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

const MultiValueRemove = (props: any) => {
  return (
    <div 
      {...props.innerProps}
      className="flex items-center justify-center p-1 rounded-sm hover:bg-blue-100 transition-colors"
    >
      <X size={14} className="text-blue-600" />
    </div>
  );
};

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

  // Custom styles matching Tailwind design with improved mobile support
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'white',
      borderColor: error ? 'rgb(239, 68, 68)' : 'rgb(229, 231, 235)',
      boxShadow: error ? '0 0 0 1px rgb(239, 68, 68)' : 'none',
      '&:hover': {
        borderColor: error ? 'rgb(239, 68, 68)' : 'rgb(107, 114, 128)'
      },
      minHeight: '44px', // Better mobile touch target
      // Remove focus outline
      outline: 'none',
      '&:focus-within': {
        outline: 'none',
        boxShadow: '0 0 0 2px rgb(219, 234, 254)'
      }
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'white',
      zIndex: 50,
      marginTop: '4px'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? 'rgb(219, 234, 254)' 
        : state.isFocused 
          ? 'rgb(243, 244, 246)'
          : 'white',
      color: 'rgb(55, 65, 81)',
      padding: '8px 12px', // Larger padding for mobile
      '&:active': {
        backgroundColor: 'rgb(219, 234, 254)'
      }
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: 'rgb(219, 234, 254)',
      borderRadius: '0.375rem',
      // Fix size for mobile
      margin: '2px 4px 2px 0',
      padding: '0 0 0 4px'
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: 'rgb(37, 99, 235)',
      padding: '2px 4px 2px 2px',
      fontSize: '0.875rem', // Consistent text size
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: 'rgb(37, 99, 235)',
      paddingLeft: '4px',
      paddingRight: '4px',
      borderRadius: '0 0.375rem 0.375rem 0',
      '&:hover': {
        backgroundColor: 'rgb(191, 219, 254)',
        color: 'rgb(37, 99, 235)'
      },
      // Fix alignment
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
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
    // Fix container height to prevent jumping
    container: (base: any) => ({
      ...base,
      outline: 'none',
      boxShadow: 'none'
    }),
    // Improve value container padding
    valueContainer: (base: any) => ({
      ...base,
      padding: '2px 8px',
      gap: '2px',
      flexWrap: 'wrap'
    }),
    // Center the dropdown indicators
    indicatorsContainer: (base: any) => ({
      ...base,
      alignItems: 'center'
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: '6px'
    }),
    clearIndicator: (base: any) => ({
      ...base,
      padding: '6px'
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      margin: '6px 0'
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
        className={cn("w-full react-select-container", className)}
        classNamePrefix="multi-select"
        styles={selectStyles}
        noOptionsMessage={() => "No options found"}
        components={{ MultiValueRemove }}
        // Improve mobile UX
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        isClearable={true}
        isSearchable={true}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
