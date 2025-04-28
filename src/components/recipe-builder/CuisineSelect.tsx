
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

interface CuisineOption {
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
      { value: "african-north", label: "African (North)" },
      { value: "african-west", label: "African (West)" },
      { value: "african-east", label: "African (East)" },
      { value: "african-south", label: "African (South)" },
      { value: "american-traditional", label: "American (Traditional/Comfort)" },
      { value: "brazilian", label: "Brazilian/South American" },
      { value: "caribbean", label: "Caribbean" },
      { value: "chinese", label: "Chinese" },
      { value: "french", label: "French" },
      { value: "greek", label: "Greek" },
      { value: "indian", label: "Indian" },
      { value: "italian", label: "Italian" },
      { value: "japanese", label: "Japanese" },
      { value: "korean", label: "Korean" },
      { value: "mediterranean", label: "Mediterranean" },
      { value: "mexican", label: "Mexican" },
      { value: "middle-eastern", label: "Middle Eastern" },
      { value: "pacific-northwest", label: "Pacific Northwest" },
      { value: "southeast-asian", label: "Southeast Asian" },
      { value: "spanish", label: "Spanish" },
      { value: "southern-soul", label: "Southern/Soul Food" },
    ],
  },
  {
    name: "Regional American",
    options: [
      { value: "cajun-creole", label: "Cajun/Creole" },
      { value: "midwest", label: "Midwest" },
      { value: "new-england", label: "New England" },
      { value: "pacific-northwest", label: "Pacific Northwest" },
      { value: "southern", label: "Southern" },
      { value: "southwestern", label: "Southwestern" },
      { value: "tex-mex", label: "Tex-Mex" },
    ],
  },
  {
    name: "European",
    options: [
      { value: "british-irish", label: "British/Irish" },
      { value: "eastern-european", label: "Eastern European" },
      { value: "french", label: "French" },
      { value: "german", label: "German" },
      { value: "greek", label: "Greek" },
      { value: "italian", label: "Italian" },
      { value: "mediterranean", label: "Mediterranean" },
      { value: "scandinavian-nordic", label: "Scandinavian/Nordic" },
      { value: "spanish", label: "Spanish" },
    ],
  },
  {
    name: "Asian",
    options: [
      { value: "chinese", label: "Chinese" },
      { value: "indian", label: "Indian" },
      { value: "japanese", label: "Japanese" },
      { value: "korean", label: "Korean" },
      { value: "southeast-asian", label: "Southeast Asian" },
    ],
  },
  {
    name: "Dietary Styles",
    options: [
      { value: "gluten-free", label: "Gluten-Free" },
      { value: "keto", label: "Keto" },
      { value: "low-fodmap", label: "Low-FODMAP" },
      { value: "mediterranean", label: "Mediterranean" },
      { value: "paleo", label: "Paleo" },
      { value: "plant-based", label: "Plant-Based/Vegan" },
      { value: "vegetarian", label: "Vegetarian" },
      { value: "whole30", label: "Whole30" },
    ],
  },
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
        <SelectContent className="max-h-[400px] bg-white rounded-lg border shadow-lg">
          {cuisineCategories.map((category) => (
            <SelectGroup key={category.name}>
              <SelectLabel 
                className="font-medium text-sm px-4 py-2 bg-gray-50 text-gray-700 border-b sticky top-0"
              >
                {category.name}
              </SelectLabel>
              {category.options.map((cuisine) => (
                <SelectItem 
                  key={cuisine.value} 
                  value={cuisine.value}
                  className="px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 cursor-pointer data-[highlighted]:bg-gray-50 data-[highlighted]:text-gray-900 truncate"
                >
                  {cuisine.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CuisineSelect;

