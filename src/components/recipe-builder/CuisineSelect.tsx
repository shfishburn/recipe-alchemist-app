
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { GROUPED_CUISINE_OPTIONS } from '@/config/cuisine-config';

interface CuisineSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

const getCuisineLabel = (value: string): string => {
  for (const category of GROUPED_CUISINE_OPTIONS) {
    const option = category.options.find(opt => opt.value === value);
    if (option) return option.label;
  }
  return "Select cuisine";
};

const CuisineSelect = ({ value, onChange, id = "cuisine" }: CuisineSelectProps) => {
  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue>
            {value ? getCuisineLabel(value) : "Select cuisine"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent 
          align="start" 
          sideOffset={4} 
          className="w-[calc(100%+2rem)] max-w-[26rem] bg-white"
          position="popper"
        >
          <ScrollArea className="h-[320px] w-full">
            {GROUPED_CUISINE_OPTIONS.map((group) => (
              <SelectGroup key={group.category}>
                <SelectLabel 
                  className="sticky top-0 font-medium text-sm px-4 py-2 bg-gray-50 text-gray-700 border-b z-10"
                >
                  {group.category}
                </SelectLabel>
                {group.options.map((cuisine) => (
                  <SelectItem 
                    key={cuisine.value} 
                    value={cuisine.value}
                    className={cn(
                      "px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer",
                      "data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-600",
                      "focus:bg-blue-50 focus:text-blue-600"
                    )}
                  >
                    <span className="truncate">{cuisine.label}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CuisineSelect;
