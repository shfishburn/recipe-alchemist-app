import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CookingPot, ArrowRight, LeafyGreen, WheatOff, MilkOff } from 'lucide-react';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

// Popular cuisines with their display names and values in the specified order
const CUISINES = [
  { name: "American", value: "american" },
  { name: "Italian", value: "italian" },
  { name: "Mexican", value: "mexican" },
  { name: "Asian", value: "asian" },
  { name: "Mediterranean", value: "mediterranean" },
  { name: "Healthy", value: "healthy" },
  { name: "Vegetarian", value: "vegetarian" }
];

// Dietary restrictions
const DIETARY = [
  { name: "Low-Carb", value: "low-carb", icon: LeafyGreen },
  { name: "Gluten-Free", value: "gluten-free", icon: WheatOff },
  { name: "Dairy-Free", value: "dairy-free", icon: MilkOff }
];

interface QuickRecipeTagFormProps {
  onSubmit: (data: QuickRecipeFormData) => void;
  isLoading: boolean;
}

export function QuickRecipeTagForm({ onSubmit, isLoading }: QuickRecipeTagFormProps) {
  const [formData, setFormData] = useState<QuickRecipeFormData>({
    cuisine: [],
    dietary: [],
    mainIngredient: '',
  });
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set the height to match content (min 48px for mobile, 56px for desktop)
      const minHeight = isMobile ? '48px' : '56px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(parseInt(minHeight), scrollHeight)}px`;
    }
  }, [formData.mainIngredient, isMobile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mainIngredient.trim()) {
      // Use a random ingredient based on selected cuisines or default to chicken
      let randomIngredient = 'chicken';
      if (formData.cuisine.length > 0) {
        // Select a relevant ingredient based on the first selected cuisine
        const primaryCuisine = formData.cuisine[0];
        randomIngredient = primaryCuisine === 'italian' ? 'pasta' :
                           primaryCuisine === 'mexican' ? 'beans' :
                           primaryCuisine === 'asian' ? 'rice' :
                           primaryCuisine === 'mediterranean' ? 'olive oil' :
                           primaryCuisine === 'healthy' ? 'quinoa' :
                           primaryCuisine === 'vegetarian' ? 'tofu' : 'chicken';
      }
      onSubmit({...formData, mainIngredient: randomIngredient});
    } else {
      onSubmit(formData);
    }
  };

  const toggleCuisine = (value: string) => {
    setFormData(prev => {
      // If the cuisine is already selected, remove it
      if (prev.cuisine.includes(value)) {
        return { ...prev, cuisine: prev.cuisine.filter(c => c !== value) };
      } 
      // Otherwise, add it to the selection
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
      // Otherwise, add it to the selection
      else {
        return { ...prev, dietary: [...prev.dietary, value] };
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="text-center text-xs text-muted-foreground mb-1">
            Ready in 30 mins • Easy cleanup • Ingredient-based
          </div>
          <label htmlFor="mainIngredient" className="text-sm font-medium">
            Ingredients or meal ideas:
          </label>
          <Textarea 
            id="mainIngredient"
            ref={textareaRef}
            placeholder="e.g., chicken thighs, pasta, tacos, stir-fry..."
            value={formData.mainIngredient}
            onChange={(e) => setFormData({ ...formData, mainIngredient: e.target.value })}
            className={`${isMobile ? "min-h-[48px]" : "min-h-[56px]"} text-center resize-none overflow-hidden transition-all`}
            rows={1}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">What flavors match your mood tonight?</label>
          <div className="flex flex-wrap gap-2 justify-center">
            {CUISINES.map(cuisine => (
              <Badge 
                key={cuisine.value} 
                variant="outline" 
                className={`cursor-pointer hover:bg-accent px-3 py-1.5 text-sm ${
                  formData.cuisine.includes(cuisine.value) ? 'bg-recipe-green text-white hover:bg-recipe-green/90' : ''
                }`}
                onClick={() => toggleCuisine(cuisine.value)}
              >
                {cuisine.name}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 justify-center mt-3">
            {DIETARY.map(diet => (
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
        className="w-full bg-recipe-blue hover:bg-recipe-blue/90 transition-all text-white shadow-md font-medium"
        size={isMobile ? "lg" : "lg"}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <CookingPot className="mr-2 h-5 w-5 animate-pulse" />
            Creating Recipe...
          </>
        ) : (
          <>
            Show My Recipe
            <ArrowRight className="ml-1 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}
