import React from 'react';
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { GROUPED_CUISINE_OPTIONS } from '@/config/cuisine-config';

interface CuisineSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function CuisineSelector({ value = ['any'], onChange }: CuisineSelectorProps) {
  const handleSelect = (selectedValue: string) => {
    if (selectedValue === 'any') {
      // If "any" is selected, clear all other selections
      onChange(['any']);
    } else {
      // If this is the first selection and it's not "any", just use it alone
      if (value.includes('any')) {
        onChange([selectedValue]);
      } else {
        // If the value is already selected, remove it (except "any")
        if (value.includes(selectedValue)) {
          const newValue = value.filter(item => item !== selectedValue);
          // If we removed the last value, default to "any"
          onChange(newValue.length > 0 ? newValue : ['any']);
        } else {
          // Otherwise add it to the array
          onChange([...value, selectedValue]);
        }
      }
    }
  };

  // Format display text based on selections
  const displayText = () => {
    if (value.includes('any')) return "Any Cuisine";
    if (value.length === 0) return "Select cuisine";
    
    if (value.length === 1) {
      // Find the cuisine label by searching through all groups
      for (const group of GROUPED_CUISINE_OPTIONS) {
        const cuisine = group.options.find(c => c.value === value[0]);
        if (cuisine) return cuisine.label;
      }
      return "Select cuisine";
    }
    
    return `${value.length} cuisines selected`;
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor="cuisine-selector" className="text-sm font-medium">
        Cuisine Type
      </label>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-label="Select cuisine types"
            aria-expanded={false}
            className={cn(
              "w-full justify-between bg-white dark:bg-gray-950",
              "text-left font-normal",
              "h-10 px-3 py-2"
            )}
            id="cuisine-selector"
          >
            {displayText()}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search cuisine..." />
            <CommandEmpty>No cuisine found.</CommandEmpty>
            {GROUPED_CUISINE_OPTIONS.map((group) => (
              <CommandGroup key={group.category} heading={group.category} className="py-1.5">
                {group.options.map((cuisine) => (
                  <CommandItem
                    key={cuisine.value}
                    value={cuisine.value}
                    onSelect={() => handleSelect(cuisine.value)}
                    className="flex items-center justify-between"
                  >
                    <span>{cuisine.label}</span>
                    {value.includes(cuisine.value) && (
                      <CheckIcon className="h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Display selected cuisines as badges */}
      {(value.length > 0 && !value.includes('any')) && (
        <div className="flex flex-wrap gap-1 mt-2">
          {value.map((v) => {
            // Find cuisine label by searching through all groups
            let cuisineLabel = v;
            for (const group of GROUPED_CUISINE_OPTIONS) {
              const cuisine = group.options.find(c => c.value === v);
              if (cuisine) {
                cuisineLabel = cuisine.label;
                break;
              }
            }
            
            return (
              <Badge 
                key={v} 
                variant="secondary"
                className="text-xs"
              >
                {cuisineLabel}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none hover:text-red-500 focus:text-red-500"
                  onClick={() => {
                    const newValue = value.filter(item => item !== v);
                    onChange(newValue.length > 0 ? newValue : ['any']);
                  }}
                >
                  ×
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
