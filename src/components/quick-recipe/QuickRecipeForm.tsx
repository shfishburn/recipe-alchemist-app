import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CookingPot, Carrot, WheatOff, MilkOff, Heart, LeafyGreen } from 'lucide-react';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Cuisine options with flag emojis instead of icons
const CUISINES = [
  { name: "American", value: "american", flag: "🇺🇸" },
  { name: "Italian", value: "italian", flag: "🇮🇹" },
  { name: "Mexican", value: "mexican", flag: "🇲🇽" },
  { name: "Asian", value: "asian", flag: "🇨🇳" },
  { name: "Mediterranean", value: "mediterranean", flag: "🇬🇷" },
  { name: "French", value: "french", flag: "🇫🇷" },
  { name: "Indian", value: "indian", flag: "🇮🇳" }
];

// Dietary options with icons
const DIETARY = [
  { name: "Low-Carb", value: "low-carb", icon: Carrot },
  { name: "Gluten-Free", value: "gluten-free", icon: WheatOff },
  { name: "Dairy-Free", value: "dairy-free", icon: MilkOff },
  { name: "Healthy", value: "healthy", icon: Heart },
  { name: "Vegetarian", value: "vegetarian", icon: LeafyGreen }
];

// Maximum number of selections allowed
const MAX_CUISINE_SELECTIONS = 2;
const MAX_DIETARY_SELECTIONS = 2;

interface QuickRecipeFormProps {
  onSubmit: (data: QuickRecipeFormData) => void;
  isLoading: boolean;
}

export function QuickRecipeForm({ onSubmit, isLoading }: QuickRecipeFormProps) {
  const [formData, setFormData] = useState<QuickRecipeFormData>({
    cuisine: [],
    dietary: [],
    mainIngredient: '',
    servings: 2, // Default value for servings
  });
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mainIngredient before submitting
    if (!formData.mainIngredient || formData.mainIngredient.trim() === '') {
      toast({
        title: "Missing ingredient",
        description: "Please enter at least one main ingredient",
        variant: "destructive",
      });
      return;
    }
    
    // Debugging: log the submission data
    console.log("Submitting form data:", {
      cuisine: formData.cuisine,
      dietary: formData.dietary,
      mainIngredient: formData.mainIngredient,
      servings: formData.servings
    });
    
    onSubmit(formData);
  };

  const toggleCuisine = (value: string) => {
    setFormData(prev => {
      const cuisineArray = Array.isArray(prev.cuisine) ? prev.cuisine : prev.cuisine ? [prev.cuisine] : [];
      
      // If the cuisine is already selected, remove it
      if (cuisineArray.includes(value)) {
        return { ...prev, cuisine: cuisineArray.filter(c => c !== value) };
      } 
      // Otherwise, check if we've reached the maximum number of selections
      else if (cuisineArray.length >= MAX_CUISINE_SELECTIONS) {
        toast({
          title: "Selection limit reached",
          description: `You can select up to ${MAX_CUISINE_SELECTIONS} cuisines.`,
          variant: "default"
        });
        return prev;
      }
      // Add it to the selection
      else {
        return { ...prev, cuisine: [...cuisineArray, value] };
      }
    });
  };

  const toggleDietary = (value: string) => {
    setFormData(prev => {
      const dietaryArray = Array.isArray(prev.dietary) ? prev.dietary : prev.dietary ? [prev.dietary] : [];
      
      // If the dietary option is already selected, remove it
      if (dietaryArray.includes(value)) {
        return { ...prev, dietary: dietaryArray.filter(d => d !== value) };
      } 
      // Otherwise, check if we've reached the maximum number of selections
      else if (dietaryArray.length >= MAX_DIETARY_SELECTIONS) {
        toast({
          title: "Selection limit reached",
          description: `You can select up to ${MAX_DIETARY_SELECTIONS} dietary preferences.`,
          variant: "default"
        });
        return prev;
      }
      // Add it to the selection
      else {
        return { ...prev, dietary: [...dietaryArray, value] };
      }
    });
  };

  // Helper function to check if a value is selected
  const isCuisineSelected = (value: string): boolean => {
    if (Array.isArray(formData.cuisine)) {
      return formData.cuisine.includes(value);
    }
    return formData.cuisine === value;
  };

  const isDietarySelected = (value: string): boolean => {
    if (Array.isArray(formData.dietary)) {
      return formData.dietary.includes(value);
    }
    return formData.dietary === value;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full mx-auto">
      <div className="space-y-2 w-full">
        <Input 
          placeholder="Main ingredient (e.g., chicken, pasta, etc.)"
          value={formData.mainIngredient}
          onChange={(e) => setFormData({ ...formData, mainIngredient: e.target.value })}
          className={isMobile ? "h-10 w-full" : "h-12 text-lg w-full"}
          aria-label="Main ingredient"
        />
      </div>

      <div className="space-y-4 w-full">
        <div>
          <label className="text-sm font-medium block mb-2">Cuisine (select up to {MAX_CUISINE_SELECTIONS}):</label>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full">
            {CUISINES.map((cuisine) => (
              <Badge 
                key={cuisine.value} 
                variant="outline" 
                className={`cursor-pointer hover:bg-accent px-3 py-1.5 text-sm ${
                  isCuisineSelected(cuisine.value) ? 'bg-recipe-green text-white hover:bg-recipe-green/90' : ''
                }`}
                onClick={() => toggleCuisine(cuisine.value)}
              >
                <span className="mr-1">{cuisine.flag}</span>
                {cuisine.name}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Dietary Restrictions (select up to {MAX_DIETARY_SELECTIONS}):</label>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full">
            {DIETARY.map((diet) => (
              <Badge 
                key={diet.value} 
                variant="outline" 
                className={`cursor-pointer hover:bg-accent px-3 py-1.5 text-sm ${
                  isDietarySelected(diet.value) ? 'bg-recipe-orange text-white hover:bg-recipe-orange/90' : ''
                }`}
                onClick={() => toggleDietary(diet.value)}
              >
                <diet.icon className="w-3.5 h-3.5 mr-1" />
                {diet.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-recipe-blue hover:bg-recipe-blue/90"
        size={isMobile ? "default" : "lg"}
        disabled={isLoading}
      >
        <CookingPot className="mr-2 h-5 w-5" />
        {isLoading ? 'Creating...' : 'Create Quick Recipe'}
      </Button>
    </form>
  );
}
