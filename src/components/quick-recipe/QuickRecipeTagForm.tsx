
import React, { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ServingsSelector } from './form-components/ServingsSelector';
import { CuisineSelector } from './form-components/CuisineSelector';
import { DietarySelector } from './form-components/DietarySelector';
import { useDebounce } from '@/hooks/use-debounce';

export interface QuickRecipeFormData {
  ingredients: string;
  servings: number;
  cuisine: string;
  dietary: string;
  prepTime: number;
}

export interface QuickRecipeTagFormProps {
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
  onSubmit?: (formData: QuickRecipeFormData) => void;
  isLoading?: boolean;
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
  prepTime,
  onSubmit,
  isLoading = false
}: QuickRecipeTagFormProps) => {
  const [localIngredients, setLocalIngredients] = useState(ingredients);
  const debouncedIngredients = useDebounce(localIngredients, 300);

  // Update ingredients after debounced input changes
  React.useEffect(() => {
    onIngredientsChange(debouncedIngredients);
  }, [debouncedIngredients, onIngredientsChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalIngredients(e.target.value);
  }, []);

  const handleFormSubmit = () => {
    if (onSubmit) {
      onSubmit({
        ingredients: localIngredients,
        servings: selectedServings,
        cuisine: selectedCuisine,
        dietary: selectedDietary,
        prepTime
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="ingredients" className="text-sm font-medium">Ingredients</Label>
        <Input 
          id="ingredients" 
          placeholder="e.g., chicken, rice, vegetables"
          value={localIngredients}
          onChange={handleInputChange}
          aria-label="Enter your ingredients"
          className="h-10"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Servings Selector */}
        <div className="space-y-2">
          <Label htmlFor="servings" className="text-sm font-medium">Servings</Label>
          <ServingsSelector 
            selectedServings={selectedServings} 
            onServingsChange={onServingsSelect} 
          />
        </div>

        {/* Cuisine Selector - Consistent ordering */}
        <div className="space-y-2">
          <Label htmlFor="cuisine" className="text-sm font-medium">Cuisine</Label>
          <CuisineSelector 
            value={selectedCuisine} 
            onChange={onCuisineSelect}
          />
        </div>

        {/* Dietary Selector - Consistent ordering */}
        <div className="space-y-2">
          <Label htmlFor="dietary" className="text-sm font-medium">Dietary</Label>
          <DietarySelector
            value={selectedDietary}
            onChange={onDietarySelect}
          />
        </div>
      </div>

      {/* Prep Time Slider */}
      <div className="space-y-2 pt-2">
        <Label htmlFor="prep-time" className="text-sm font-medium">Prep Time (minutes)</Label>
        <Slider
          id="prep-time"
          defaultValue={[prepTime]}
          max={120}
          step={5}
          onValueChange={(value) => onPrepTimeChange(value[0])}
          aria-label="Select prep time in minutes"
        />
        <p className="text-sm text-muted-foreground">
          {prepTime} minutes
        </p>
      </div>
      
      {onSubmit && (
        <div className="pt-4">
          <button 
            type="button" 
            onClick={handleFormSubmit}
            className="w-full bg-recipe-blue hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Recipe...' : 'Create Recipe'}
          </button>
        </div>
      )}
    </div>
  );
}

export default QuickRecipeTagForm;
