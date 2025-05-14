import React, { useEffect, useRef, useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Leaf, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dietary options with icons
const DIETARY_OPTIONS = [
  { value: 'none', label: 'No Restrictions', icon: '🍽️' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
  { value: 'vegan', label: 'Vegan', icon: '🌱' },
  { value: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
  { value: 'dairy-free', label: 'Dairy Free', icon: '🥛' },
  { value: 'low-carb', label: 'Low Carb', icon: '🥦' },
  { value: 'keto', label: 'Keto', icon: '🥑' },
  { value: 'paleo', label: 'Paleo', icon: '🍖' },
];

interface DietarySelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
}

export function DietarySelector({ 
  value = [], 
  onChange, 
  maxSelections = 2 
}: DietarySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle selection changes
  const handleSelectionChange = (selectedValue: string) => {
    // If 'none' is selected, clear other selections
    if (selectedValue === 'none') {
      onChange([]);
      return;
    }
    
    // If the value is already selected, remove it
    if (value.includes(selectedValue)) {
      onChange(value.filter(item => item !== selectedValue));
      return;
    }
    
    // If we've reached the maximum selections, don't add more
    if (value.length >= maxSelections) {
      // Replace the last item with the new selection
      const newValue = [...value];
      newValue.pop();
      onChange([...newValue, selectedValue]);
      return;
    }
    
    // Otherwise add the new selection
    onChange([...value, selectedValue]);
  };

  // Get display text for the trigger
  const getDisplayText = () => {
    if (!value || value.length === 0) return 'No Restrictions';
    
    if (value.length === 1) {
      const option = DIETARY_OPTIONS.find(opt => opt.value === value[0]);
      return option ? option.label : 'Select...';
    }
    
    return `${value.length} selected`;
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        buttonRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="space-y-2">
      {/* Material Design label */}
      <label 
        htmlFor="dietary-select" 
        className="text-sm font-medium flex items-center gap-1.5 text-foreground"
      >
        <Filter className="h-4 w-4 text-primary/80" />
        Dietary
      </label>
      
      {/* Custom select with multi-select capabilities */}
      <div className="relative">
        <button
          type="button"
          id="dietary-select"
          ref={buttonRef}
          className={cn(
            "flex w-full justify-between items-center rounded-md border border-input",
            "bg-background px-3 py-2 text-sm shadow-elevation-1 h-10",
            "hover:border-primary/50 hover:shadow-elevation-2 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{getDisplayText()}</span>
          <Leaf className="h-4 w-4 opacity-70" />
        </button>
        
        {/* Dropdown menu */}
        <div 
          ref={dropdownRef}
          className={cn(
            "absolute z-10 mt-1 w-full rounded-md border border-input",
            "bg-background shadow-elevation-2",
            isOpen ? "block" : "hidden"
          )}
        >
          <div className="max-h-60 overflow-auto p-1">
            {DIETARY_OPTIONS.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer",
                    "transition-colors hover:bg-primary/10",
                    isSelected ? "bg-primary/20 text-primary" : "text-foreground"
                  )}
                  onClick={() => {
                    handleSelectionChange(option.value);
                    // Don't hide dropdown after selection for multi-select
                  }}
                >
                  <span className="mr-2">{option.icon}</span>
                  <span>{option.label}</span>
                  {isSelected && (
                    <span className="ml-auto">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Material Design helper text */}
      <p className="text-xs text-muted-foreground">
        Dietary preferences (max {maxSelections})
      </p>
    </div>
  );
}
