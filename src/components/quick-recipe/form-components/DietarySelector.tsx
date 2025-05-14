
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

// Production list of dietary preferences derived from DietarySelect.tsx
const DIETARY_OPTIONS = [
  { value: "no-restrictions", label: "No Restrictions" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "pescatarian", label: "Pescatarian" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "dairy-free", label: "Dairy-Free" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "low-carb", label: "Low-Carb" },
  { value: "low-fat", label: "Low-Fat" },
  { value: "low-sodium", label: "Low-Sodium" },
  { value: "high-protein", label: "High-Protein" }
];

interface DietarySelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function DietarySelector({ value = [], onChange }: DietarySelectorProps) {
  const handleSelect = (selectedValue: string) => {
    // If value already exists in array, remove it
    if (value.includes(selectedValue)) {
      onChange(value.filter(item => item !== selectedValue));
    } else {
      // Otherwise add it
      onChange([...value, selectedValue]);
    }
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor="dietary-selector" className="text-sm font-medium">
        Dietary Needs
      </label>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-label="Select dietary preferences"
            aria-expanded={false}
            className={cn(
              "w-full justify-between bg-white dark:bg-gray-950",
              "text-left font-normal",
              "h-10 px-3 py-2"
            )}
            id="dietary-selector"
          >
            {value.length === 0 ? (
              <span className="text-muted-foreground">Select dietary needs</span>
            ) : value.length === 1 ? (
              DIETARY_OPTIONS.find(diet => diet.value === value[0])?.label || "Select dietary needs"
            ) : (
              `${value.length} options selected`
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search dietary options..." />
            <CommandEmpty>No dietary option found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {DIETARY_OPTIONS.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  {value.includes(option.value) && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Display selected dietary options as badges */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {value.map((v) => {
            const option = DIETARY_OPTIONS.find(diet => diet.value === v);
            return option && (
              <Badge 
                key={v} 
                variant="secondary"
                className="text-xs"
              >
                {option.label}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none hover:text-red-500 focus:text-red-500"
                  onClick={() => {
                    onChange(value.filter(item => item !== v));
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
