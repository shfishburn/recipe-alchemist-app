import React, { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select } from '@/components/ui/select';
import { 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { ServingsSelector } from './form-components/ServingsSelector';
import { CuisineSelector } from './form-components/CuisineSelector';
import { DietarySelector } from './form-components/DietarySelector';
import { useDebounce } from '@/hooks/use-debounce';

interface QuickRecipeTagFormProps {
  onIngredientsChange: (ingredients: string) => void;
  onServingsSelect: (servings: number) => void;
  onCuisineSelect: (cuisine: string) => void;
  onDietarySelect: (dietary: string) => void;
  onPrepTimeChange: (prepTime: number) => void;
  ingredients: string;
  selectedServings: number;
  selectedCuisine: string;
  selectedDietary: string;
  prepTime: number;
}

const QuickRecipeTagForm = ({ 
  onIngredientsChange,
  onServingsSelect,
  onCuisineSelect,
  onDietarySelect,
  onPrepTimeChange,
  ingredients,
  selectedServings,
  selectedCuisine,
  selectedDietary,
  prepTime
}) => {
  const [localIngredients, setLocalIngredients] = useState(ingredients);
  const debouncedIngredients = useDebounce(localIngredients, 500);

  // Update ingredients after debounce
  React.useEffect(() => {
    onIngredientsChange(debouncedIngredients);
  }, [debouncedIngredients, onIngredientsChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalIngredients(e.target.value);
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="ingredients">Ingredients</Label>
        <Input 
          id="ingredients" 
          placeholder="e.g., chicken, rice, vegetables"
          value={localIngredients}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="flex flex-wrap gap-4">
        {/* Servings Selector - Fixed prop name */}
        <div className="flex-1 min-w-[180px]">
          <Label htmlFor="servings">Servings</Label>
          <div className="mt-2">
            <ServingsSelector 
              selectedServings={selectedServings} 
              onServingsChange={onServingsSelect} 
            />
          </div>
        </div>

        {/* Cuisine Selector */}
        <div className="flex-1 min-w-[180px]">
          <Label htmlFor="cuisine">Cuisine</Label>
          <div className="mt-2">
            <CuisineSelector 
              selectedCuisine={selectedCuisine} 
              onCuisineSelect={onCuisineSelect}
            />
          </div>
        </div>

        {/* Dietary Selector */}
        <div className="flex-1 min-w-[180px]">
          <Label htmlFor="dietary">Dietary</Label>
          <div className="mt-2">
            <DietarySelector
              selectedDietary={selectedDietary}
              onDietarySelect={onDietarySelect}
            />
          </div>
        </div>
      </div>

      {/* Prep Time Slider */}
      <div className="space-y-2">
        <Label htmlFor="prep-time">Prep Time (minutes)</Label>
        <Slider
          id="prep-time"
          defaultValue={[prepTime]}
          max={120}
          step={5}
          onValueChange={(value) => onPrepTimeChange(value[0])}
        />
        <p className="text-sm text-muted-foreground">
          {prepTime} minutes
        </p>
      </div>
    </div>
  );
};

export default QuickRecipeTagForm;
