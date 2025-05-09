import React, { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ServingsSelector } from './form-components/ServingsSelector';
import { CuisineSelector } from './form-components/CuisineSelector';
import { DietarySelector } from './form-components/DietarySelector';
import { useDebounce } from '@/hooks/use-debounce';

export interface QuickRecipeFormData {
  ingredients: string;
  servings: number;
  cuisine: string;
  dietary: string;
}

export interface QuickRecipeTagFormProps {
  onIngredientsChange: (ingredients: string) => void;
  onServingsSelect: (servings: number) => void;
  onCuisineSelect: (cuisine: string) => void;
  onDietarySelect: (dietary: string) => void;
  ingredients: string;
  selectedServings: number;
  selectedCuisine: string;
  selectedDietary: string;
  onSubmit?: (formData: QuickRecipeFormData) => void;
  isLoading?: boolean;
}

const QuickRecipeTagForm = ({
  onIngredientsChange,
  onServingsSelect,
  onCuisineSelect,
  onDietarySelect,
  ingredients,
  selectedServings,
  selectedCuisine,
  selectedDietary,
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
        dietary: selectedDietary
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="ingredients" className="text-sm font-bold text-left">Your Ingredients or Recipe</Label>
        <div className="w-full text-left">
          <input
            type="text"
            id="ingredients"
            placeholder="Tell us what you have or what you’d like to make …"
            value={localIngredients}
            onChange={handleInputChange}
            aria-label="Tell us what you have or what you’d like to make  …"
            className="
              w-full flex-1
              border border-slate-300 rounded-md
              bg-white p-2
              outline-none focus:outline-none
              focus:ring-2 focus:ring-slate-400
              placeholder:text-left placeholder:text-muted-foreground
              disabled:cursor-not-allowed disabled:opacity-50
            "
          />
          <p className="mt-1 block w-full text-sm text-muted-foreground text-left">
            e.g., chicken curry: chicken, curry paste, coconut milk
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Servings Selector */}
        <div className="space-y-2">
          <Label htmlFor="servings" className="text font-bold"># Servings</Label>
          <ServingsSelector 
            selectedServings={selectedServings} 
            onServingsChange={onServingsSelect} 
          />
        </div>

        {/* Cuisine Selector */}
        <div className="space-y-2">
          <Label htmlFor="cuisine" className="text font-bold">Cuisine Preference</Label>
          <CuisineSelector 
            value={selectedCuisine} 
            onChange={onCuisineSelect}
          />
        </div>

        {/* Dietary Selector */}
        <div className="space-y-2">
          <Label htmlFor="dietary" className="text font-bold">Dietary Choices</Label>
          <DietarySelector
            value={selectedDietary}
            onChange={onDietarySelect}
          />
        </div>
      </div>
      
      {onSubmit && (
        <div className="pt-4">
          <button 
            type="button" 
            onClick={handleFormSubmit}
            className="w-full bg-recipe-blue hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Your Recipe...' : 'Create My Recipe'}
          </button>
        </div>
      )}
    </div>
  );
}

export default QuickRecipeTagForm;
