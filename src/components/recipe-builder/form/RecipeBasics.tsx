
import React from 'react';
import { Label } from '@/components/ui/label';
import { Globe, Utensils, Leaf } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CuisineSelect from '../CuisineSelect';
import DietarySelect from '../DietarySelect';

interface RecipeBasicsProps {
  cuisine: string;
  dietary: string;
  servings: number;
  onCuisineChange: (value: string) => void;
  onDietaryChange: (value: string) => void;
  onServingsChange: (value: number) => void;
}

const RecipeBasics = ({
  cuisine,
  dietary,
  servings,
  onCuisineChange,
  onDietaryChange,
  onServingsChange,
}: RecipeBasicsProps) => {
  const servingOptions = [1, 2, 3, 4, 5, 6, 8, 10, 12];

  return (
    <div className="py-4 space-y-6">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Basics</h3>
      
      {/* Cuisine Selector */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-recipe-blue" />
          <Label htmlFor="cuisine" className="text-base font-medium text-recipe-blue">Cuisine Type</Label>
          <span className="text-xs bg-recipe-blue/10 text-recipe-blue px-2 py-0.5 rounded-full">Required</span>
        </div>
        <CuisineSelect
          value={cuisine}
          onChange={onCuisineChange}
        />
        <p className="text-xs text-muted-foreground">Sets the cultural style and flavors of your recipe</p>
      </div>

      {/* Servings Input */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Utensils className="h-4 w-4 text-amber-600" />
          <Label htmlFor="servings" className="text-base">Servings</Label>
        </div>
        <Select
          value={servings.toString()}
          onValueChange={(value) => onServingsChange(parseInt(value, 10))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select number of servings" />
          </SelectTrigger>
          <SelectContent>
            {servingOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option} {option === 1 ? 'serving' : 'servings'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Number of portions this recipe will serve</p>
      </div>

      {/* Dietary Preference */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-green-600" />
          <Label htmlFor="dietary" className="text-base">Dietary Preference</Label>
        </div>
        <DietarySelect
          value={dietary}
          onChange={onDietaryChange}
        />
        <p className="text-xs text-muted-foreground">AI will adapt the recipe to accommodate your dietary needs</p>
      </div>
    </div>
  );
};

export default RecipeBasics;
