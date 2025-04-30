
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CookingPot, ArrowRight, Carrot, WheatOff, MilkOff, Heart, LeafyGreen, Search, Users } from 'lucide-react';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Maximum number of selections allowed
const MAX_CUISINE_SELECTIONS = 2;
const MAX_DIETARY_SELECTIONS = 2;

// Popular cuisines with their display names, values, and flag emojis
const CUISINES = [
  { name: "American", value: "american", flag: "🇺🇸" },
  { name: "Italian", value: "italian", flag: "🇮🇹" },
  { name: "Mexican", value: "mexican", flag: "🇲🇽" },
  { name: "Asian", value: "asian", flag: "🇨🇳" },
  { name: "Mediterranean", value: "mediterranean", flag: "🇬🇷" }
];

// Dietary restrictions
const DIETARY = [
  { name: "Low-Carb", value: "low-carb", icon: Carrot },
  { name: "Gluten-Free", value: "gluten-free", icon: WheatOff },
  { name: "Dairy-Free", value: "dairy-free", icon: MilkOff },
  { name: "Healthy", value: "healthy", icon: Heart },
  { name: "Vegetarian", value: "vegetarian", icon: LeafyGreen }
];

// Servings options
const SERVINGS_OPTIONS = [1, 2, 4, 6, 8];

interface QuickRecipeTagFormProps {
  onSubmit: (data: QuickRecipeFormData) => void;
  isLoading: boolean;
}

export function QuickRecipeTagForm({ onSubmit, isLoading }: QuickRecipeTagFormProps) {
  const [formData, setFormData] = useState<QuickRecipeFormData>({
    cuisine: [],
    dietary: [],
    mainIngredient: '',
    servings: 2, // Default to 2 servings
  });
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  // Create a pulsing effect for the textarea to draw attention
  const [isPulsing, setIsPulsing] = useState(true);

  // Stop the pulsing after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
                           primaryCuisine === 'mediterranean' ? 'olive oil' : 'chicken';
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

  const setServings = (servings: number) => {
    setFormData(prev => ({
      ...prev,
      servings
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full mx-auto">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="text-center text-xs text-muted-foreground mb-1">
            Ready in 30 mins • Easy cleanup • Ingredient-based
          </div>
          <label htmlFor="mainIngredient" className="text-sm font-medium block pb-1 text-left">
            What ingredients do you have today?
          </label>
          <div className={`relative ${isPulsing ? 'animate-pulse ring-2 ring-recipe-blue ring-opacity-50' : ''} rounded-md shadow-sm bg-gradient-to-r from-white to-blue-50 dark:from-gray-900 dark:to-gray-800`}>
            <Textarea 
              id="mainIngredient"
              ref={textareaRef}
              placeholder="e.g., chicken thighs, pasta, bell peppers, onions..."
              value={formData.mainIngredient}
              onChange={(e) => setFormData({ ...formData, mainIngredient: e.target.value })}
              className={`${isMobile ? "min-h-[54px] text-base" : "min-h-[60px] text-lg"} pl-10 text-left resize-none overflow-hidden transition-all bg-transparent border-2 focus-within:border-recipe-blue placeholder:text-gray-500`}
              rows={1}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-recipe-blue" />
          </div>
          <p className="text-xs text-left text-recipe-blue font-medium">Tell us what you want to cook with!</p>
        </div>
        
        {/* Servings Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-recipe-blue" />
            <label className="text-sm font-medium">How many servings?</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {SERVINGS_OPTIONS.map(servingOption => (
              <Badge 
                key={servingOption}
                variant="outline"
                className={`cursor-pointer px-3 py-1.5 text-sm ${
                  formData.servings === servingOption 
                    ? 'bg-recipe-blue text-white hover:bg-recipe-blue/90' 
                    : 'hover:bg-accent'
                }`}
                onClick={() => setServings(servingOption)}
              >
                {servingOption} {servingOption === 1 ? 'person' : 'people'}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2 w-full">
          <label className="text-sm font-medium">What flavors match your mood tonight? (select up to {MAX_CUISINE_SELECTIONS})</label>
          <div className="flex flex-wrap gap-3 justify-start w-full">
            {CUISINES.map(cuisine => (
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

          <label className="text-sm font-medium block mt-4">Any dietary preferences? (select up to {MAX_DIETARY_SELECTIONS})</label>
          <div className="flex flex-wrap gap-3 justify-start w-full">
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

