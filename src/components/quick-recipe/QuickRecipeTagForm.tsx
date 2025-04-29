
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CookingPot } from 'lucide-react';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

// Popular cuisines with their display names and values
const CUISINES = [
  { name: "Italian", value: "italian" },
  { name: "Mexican", value: "mexican" },
  { name: "Asian", value: "asian" },
  { name: "American", value: "american" }
];

// Common dietary preferences
const DIETARY = [
  { name: "Any", value: "no-restrictions" },
  { name: "Vegetarian", value: "vegetarian" },
  { name: "Vegan", value: "vegan" },
  { name: "Gluten-Free", value: "gluten-free" }
];

// Popular ingredient suggestions to inspire users
const POPULAR_INGREDIENTS = [
  "Chicken", "Pasta", "Rice", "Beef", "Eggs", "Potatoes"
];

interface QuickRecipeTagFormProps {
  onSubmit: (data: QuickRecipeFormData) => void;
  isLoading: boolean;
}

export function QuickRecipeTagForm({ onSubmit, isLoading }: QuickRecipeTagFormProps) {
  const [formData, setFormData] = useState<QuickRecipeFormData>({
    cuisine: 'italian',
    dietary: 'no-restrictions',
    mainIngredient: '',
  });
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mainIngredient.trim()) {
      // Use a suggestion if user didn't enter an ingredient
      const randomIngredient = POPULAR_INGREDIENTS[Math.floor(Math.random() * POPULAR_INGREDIENTS.length)];
      onSubmit({...formData, mainIngredient: randomIngredient});
    } else {
      onSubmit(formData);
    }
  };

  const selectCuisine = (value: string) => {
    setFormData({ ...formData, cuisine: value });
  };

  const selectDietary = (value: string) => {
    setFormData({ ...formData, dietary: value });
  };

  const selectIngredient = (ingredient: string) => {
    setFormData({ ...formData, mainIngredient: ingredient });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="mainIngredient" className="text-sm font-medium">
            What would you like to cook with today?
          </label>
          <Input 
            id="mainIngredient"
            placeholder="Enter main ingredient (e.g., chicken)"
            value={formData.mainIngredient}
            onChange={(e) => setFormData({ ...formData, mainIngredient: e.target.value })}
            className={`${isMobile ? "h-12" : "h-14 text-lg"} text-center`}
          />
        </div>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Popular ingredients:</label>
            <div className="flex flex-wrap gap-2 justify-center">
              {POPULAR_INGREDIENTS.map(ingredient => (
                <Badge 
                  key={ingredient} 
                  variant="outline" 
                  className={`cursor-pointer hover:bg-accent px-3 py-1.5 text-sm ${
                    formData.mainIngredient === ingredient ? 'bg-recipe-blue text-white hover:bg-recipe-blue/90' : ''
                  }`}
                  onClick={() => selectIngredient(ingredient)}
                >
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cuisine style:</label>
          <div className="flex flex-wrap gap-2 justify-center">
            {CUISINES.map(cuisine => (
              <Badge 
                key={cuisine.value} 
                variant="outline" 
                className={`cursor-pointer hover:bg-accent px-3 py-1.5 text-sm ${
                  formData.cuisine === cuisine.value ? 'bg-recipe-blue text-white hover:bg-recipe-blue/90' : ''
                }`}
                onClick={() => selectCuisine(cuisine.value)}
              >
                {cuisine.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Dietary preference:</label>
          <div className="flex flex-wrap gap-2 justify-center">
            {DIETARY.map(diet => (
              <Badge 
                key={diet.value} 
                variant="outline"
                className={`cursor-pointer hover:bg-accent px-3 py-1.5 text-sm ${
                  formData.dietary === diet.value ? 'bg-recipe-blue text-white hover:bg-recipe-blue/90' : ''
                }`}
                onClick={() => selectDietary(diet.value)}
              >
                {diet.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-recipe-blue hover:bg-recipe-blue/90 transition-all"
        size={isMobile ? "lg" : "lg"}
        disabled={isLoading}
      >
        <CookingPot className="mr-2 h-5 w-5" />
        {isLoading ? 'Creating Recipe...' : 'Create Quick Recipe'}
      </Button>
    </form>
  );
}
