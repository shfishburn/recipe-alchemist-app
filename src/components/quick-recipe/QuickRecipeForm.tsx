
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
  { name: "Mediterranean", value: "mediterranean", flag: "🇬🇷" }
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
  });
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleCuisine = (value: string) => {
    setFormData(prev => {
      // If the cuisine is already selected, remove it
      if (prev.cuisine.includes(value)) {
        return { ...prev, cuisine: prev.cuisine.filter(c => c !== value) };
      } 
      // Otherwise, check if we've reached the maximum number of selections
      else if (prev.cuisine.length >= MAX_CUISINE_SELECTIONS) {
        toast({
          title: "Selection limit reached",
          description: `You can select up to ${MAX_CUISINE_SELECTIONS} cuisines.`,
          variant: "default"
        });
        return prev;
      }
      // Add it to the selection
      else {
        return { ...prev, cuisine: [...prev.cuisine, value] };
      }
    });
  };

  const toggleDietary = (value: string) => {
    setFormData(prev => {
      // If the dietary option is already selected, remove it
      if (prev.dietary.includes(value)) {
        return { ...prev, dietary: prev.dietary.filter(d => d !== value) };
      } 
      // Otherwise, check if we've reached the maximum number of selections
      else if (prev.dietary.length >= MAX_DIETARY_SELECTIONS) {
        toast({
          title: "Selection limit reached",
          description: `You can select up to ${MAX_DIETARY_SELECTIONS} dietary preferences.`,
          variant: "default"
        });
        return prev;
      }
      // Add it to the selection
      else {
        return { ...prev, dietary: [...prev.dietary, value] };
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full mx-auto">
      <div className="space-y-2">
        <Input 
          placeholder="Main ingredient (e.g., chicken, pasta, etc.)"
          value={formData.mainIngredient}
          onChange={(e) => setFormData({ ...formData, mainIngredient: e.target.value })}
          className={isMobile ? "h-10" : "h-12 text-lg"}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-2">Cuisine (select up to {MAX_CUISINE_SELECTIONS}):</label>
          <div className="flex flex-wrap gap-2 justify-center">
            {CUISINES.map((cuisine) => (
              <Badge 
                key={cuisine.value} 
                variant="outline" 
                className={`cursor-pointer hover:bg-accent px-3 py-1.5 text-sm ${
                  formData.cuisine.includes(cuisine.value) ? 'bg-recipe-green text-white hover:bg-recipe-green/90' : ''
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
          <div className="flex flex-wrap gap-2 justify-center">
            {DIETARY.map((diet) => (
              <Badge 
                key={diet.value} 
                variant="outline" 
                className={`cursor-pointer hover:bg-accent px-3 py-1.5 text-sm ${
                  formData.dietary.includes(diet.value) ? 'bg-recipe-orange text-white hover:bg-recipe-orange/90' : ''
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
