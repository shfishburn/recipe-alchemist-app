import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CookingPot, Carrot, WheatOff, MilkOff, Heart, LeafyGreen, Search } from 'lucide-react';
import { QuickRecipeFormData } from '@/types/quick-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { SubmitButton } from './form-components/SubmitButton';

// Define constants for better maintainability
const MAX_CUISINE_SELECTIONS = 2;
const MAX_DIETARY_SELECTIONS = 2;

// Cuisine options with flag emojis
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

interface QuickRecipeFormProps {
  onSubmit: (data: QuickRecipeFormData) => void;
  isLoading: boolean;
}

export function QuickRecipeForm({ onSubmit, isLoading }: QuickRecipeFormProps) {
  const [formData, setFormData] = useState<QuickRecipeFormData>({
    mainIngredient: '',
    cuisine: [],
    dietary: [],
    servings: 2,
  });
  const [inputError, setInputError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Add pulsing effect on initial load
  useEffect(() => {
    const start = setTimeout(() => {
      setIsPulsing(true);
      const stop = setTimeout(() => setIsPulsing(false), 3000);
      return () => clearTimeout(stop);
    }, 1000);
    return () => clearTimeout(start);
  }, []);

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      requestAnimationFrame(() => {
        if (!textareaRef.current) return;
        textareaRef.current.style.height = 'auto';
        const minHeight = isMobile ? '56px' : '60px';
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${Math.max(parseInt(minHeight), scrollHeight)}px`;
      });
    }
  }, [formData.mainIngredient, isMobile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mainIngredient || formData.mainIngredient.trim() === '') {
      setInputError('Please enter at least one ingredient');
      toast({
        title: "Missing ingredient",
        description: "Please enter at least one main ingredient",
        variant: "destructive",
      });
      return;
    }

    setInputError('');
    
    // Create a sanitized copy of the form data
    const sanitizedData = {
      ...formData,
      // Ensure cuisine is always an array of strings
      cuisine: Array.isArray(formData.cuisine) ? formData.cuisine : 
               formData.cuisine ? [formData.cuisine] : [],
      // Ensure dietary is always an array of strings
      dietary: Array.isArray(formData.dietary) ? formData.dietary : 
               formData.dietary ? [formData.dietary] : []
    };
    
    console.log("Submitting form data:", sanitizedData);
    onSubmit(sanitizedData);
  };

  const toggleCuisine = (value: string) => {
    setFormData(prev => {
      const cuisineArray = Array.isArray(prev.cuisine) ? prev.cuisine : 
                          (prev.cuisine ? [prev.cuisine] : []);
      
      if (cuisineArray.includes(value)) {
        return { ...prev, cuisine: cuisineArray.filter(c => c !== value) };
      } else if (cuisineArray.length >= MAX_CUISINE_SELECTIONS) {
        toast({
          title: "Selection limit reached",
          description: `You can select up to ${MAX_CUISINE_SELECTIONS} cuisines.`,
          variant: "default"
        });
        return prev;
      } else {
        return { ...prev, cuisine: [...cuisineArray, value] };
      }
    });
  };

  const toggleDietary = (value: string) => {
    setFormData(prev => {
      const dietaryArray = Array.isArray(prev.dietary) ? prev.dietary : 
                          (prev.dietary ? [prev.dietary] : []);
      
      if (dietaryArray.includes(value)) {
        return { ...prev, dietary: dietaryArray.filter(d => d !== value) };
      } else if (dietaryArray.length >= MAX_DIETARY_SELECTIONS) {
        toast({
          title: "Selection limit reached",
          description: `You can select up to ${MAX_DIETARY_SELECTIONS} dietary preferences.`,
          variant: "default"
        });
        return prev;
      } else {
        return { ...prev, dietary: [...dietaryArray, value] };
      }
    });
  };

  // Helper functions to check if a value is selected
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

  const updateServings = (newValue: number) => {
    // Keep servings between 1-12
    const clampedValue = Math.max(1, Math.min(12, newValue));
    setFormData(prev => ({ ...prev, servings: clampedValue }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full mx-auto">
      {/* Ingredient Input */}
      <div className="space-y-2 w-full">
        <div
          className={cn(
            'relative flex items-center rounded-xl shadow-md transition-all duration-300 w-full',
            isPulsing ? 'animate-pulse ring-2 ring-recipe-blue ring-opacity-50' : '',
            isFocused ? 'ring-2 ring-recipe-blue ring-opacity-100' : '',
            inputError ? 'ring-2 ring-red-500' : '',
            'bg-gradient-to-r from-white to-blue-50/70 dark:from-gray-900 dark:to-gray-800'
          )}
        >
          <Search className="absolute left-3 h-5 w-5 text-recipe-blue" aria-hidden="true" />
          <Textarea
            id="mainIngredient"
            ref={textareaRef}
            placeholder="e.g., chicken curry: chicken, curry paste, coconut milk"
            value={formData.mainIngredient}
            onChange={(e) => setFormData({ ...formData, mainIngredient: e.target.value })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={1}
            className={cn(
              isMobile ? 'min-h-[56px] text-base' : 'min-h-[60px] text-lg',
              'flex-1 text-left resize-none overflow-hidden transition-all bg-transparent border-2 rounded-xl',
              'focus-within:border-recipe-blue placeholder:text-gray-500/80',
              inputError ? 'border-red-500' : 'border-gray-200 focus:border-recipe-blue',
              'pl-10 pr-4'
            )}
            style={{ touchAction: 'manipulation' }}
          />
        </div>

        {inputError && (
          <p className="text-sm text-red-500 mt-1">{inputError}</p>
        )}
      </div>

      {/* Additional Options */}
      <div className="space-y-6 w-full">
        {/* Servings Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium block">Servings:</label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateServings(formData.servings! - 1)}
              disabled={formData.servings === 1}
              className="h-8 w-8 p-0"
            >
              -
            </Button>
            <span className={isMobile ? "text-base" : "text-lg"}>
              {formData.servings} {formData.servings === 1 ? 'serving' : 'servings'}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateServings(formData.servings! + 1)}
              disabled={formData.servings === 12}
              className="h-8 w-8 p-0"
            >
              +
            </Button>
          </div>
        </div>
        
        {/* Cuisine Selector */}
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

        {/* Dietary Selector */}
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

      {/* Submit Button */}
      <div className="flex justify-center mt-6">
        <SubmitButton 
          isLoading={isLoading}
          disabled={!formData.mainIngredient.trim()}
        />
      </div>
    </form>
  );
}
