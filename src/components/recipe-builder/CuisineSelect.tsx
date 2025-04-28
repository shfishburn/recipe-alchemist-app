
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
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Restructured with unique IDs to avoid duplicates
interface CuisineOption {
  id: string;
  value: string;
  label: string;
}

interface CuisineCategory {
  name: string;
  options: CuisineOption[];
}

const cuisineCategories: CuisineCategory[] = [
  {
    name: "Global",
    options: [
      { id: "african-north", value: "african-north", label: "African (North)" },
      { id: "african-west", value: "african-west", label: "African (West)" },
      { id: "african-east", value: "african-east", label: "African (East)" },
      { id: "african-south", value: "african-south", label: "African (South)" },
      { id: "american-traditional", value: "american-traditional", label: "American (Traditional)" },
      { id: "brazilian", value: "brazilian", label: "Brazilian/South American" },
      { id: "caribbean", value: "caribbean", label: "Caribbean" },
    ],
  },
  {
    name: "Asian",
    options: [
      { id: "chinese", value: "chinese", label: "Chinese" },
      { id: "japanese", value: "japanese", label: "Japanese" },
      { id: "korean", value: "korean", label: "Korean" },
      { id: "indian", value: "indian", label: "Indian" },
      { id: "southeast-asian", value: "southeast-asian", label: "Southeast Asian" },
      { id: "thai", value: "thai", label: "Thai" },
      { id: "vietnamese", value: "vietnamese", label: "Vietnamese" },
    ],
  },
  {
    name: "European",
    options: [
      { id: "french", value: "french", label: "French" },
      { id: "italian", value: "italian", label: "Italian" },
      { id: "spanish", value: "spanish", label: "Spanish" },
      { id: "greek", value: "greek", label: "Greek" },
      { id: "mediterranean", value: "mediterranean", label: "Mediterranean" },
      { id: "british-irish", value: "british-irish", label: "British/Irish" },
      { id: "eastern-european", value: "eastern-european", label: "Eastern European" },
      { id: "german", value: "german", label: "German" },
      { id: "scandinavian-nordic", value: "scandinavian-nordic", label: "Scandinavian/Nordic" },
    ],
  },
  {
    name: "Middle Eastern",
    options: [
      { id: "middle-eastern", value: "middle-eastern", label: "Middle Eastern" },
      { id: "lebanese", value: "lebanese", label: "Lebanese" },
      { id: "turkish", value: "turkish", label: "Turkish" },
      { id: "persian", value: "persian", label: "Persian" },
      { id: "moroccan", value: "moroccan", label: "Moroccan" },
    ],
  },
  {
    name: "Regional American",
    options: [
      { id: "cajun-creole", value: "cajun-creole", label: "Cajun/Creole" },
      { id: "midwest", value: "midwest", label: "Midwest" },
      { id: "new-england", value: "new-england", label: "New England" },
      { id: "pacific-northwest", value: "pacific-northwest", label: "Pacific Northwest" },
      { id: "southern", value: "southern", label: "Southern" },
      { id: "southwestern", value: "southwestern", label: "Southwestern" },
      { id: "tex-mex", value: "tex-mex", label: "Tex-Mex" },
    ],
  },
  {
    name: "Dietary Styles",
    options: [
      { id: "gluten-free", value: "gluten-free", label: "Gluten-Free" },
      { id: "keto", value: "keto", label: "Keto" },
      { id: "low-fodmap", value: "low-fodmap", label: "Low-FODMAP" },
      { id: "mediterranean-diet", value: "mediterranean-diet", label: "Mediterranean Diet" },
      { id: "paleo", value: "paleo", label: "Paleo" },
      { id: "plant-based", value: "plant-based", label: "Plant-Based/Vegan" },
      { id: "vegetarian", value: "vegetarian", label: "Vegetarian" },
      { id: "whole30", value: "whole30", label: "Whole30" },
    ],
  },
];

// For displaying the selected cuisine name properly
const getCuisineLabel = (value: string): string => {
  for (const category of cuisineCategories) {
    const option = category.options.find(opt => opt.value === value);
    if (option) return option.label;
  }
  return "Select cuisine";
};

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
            {cuisineCategories.map((category) => (
              <SelectGroup key={category.name}>
                <SelectLabel 
                  className="sticky top-0 font-medium text-sm px-4 py-2 bg-gray-50 text-gray-700 border-b z-10"
                >
                  {category.name}
                </SelectLabel>
                {category.options.map((cuisine) => (
                  <SelectItem 
                    key={cuisine.id} 
                    value={cuisine.value}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer data-[state=checked]:bg-blue-50/50 data-[state=checked]:text-blue-600"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate mr-2">{cuisine.label}</span>
                      {value === cuisine.value && (
                        <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      )}
                    </div>
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
