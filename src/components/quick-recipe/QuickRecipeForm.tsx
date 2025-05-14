
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CookingPot } from 'lucide-react';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { SimplifiedCuisineSelector } from './form-components/SimplifiedCuisineSelector';
import { SimplifiedDietarySelector } from './form-components/SimplifiedDietarySelector';
import { SimplifiedServingsSelector } from './form-components/SimplifiedServingsSelector';

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
    
    // Create a sanitized copy of the form data to ensure proper format
    const sanitizedData = {
      ...formData,
      // Ensure cuisine is always an array of strings
      cuisine: Array.isArray(formData.cuisine) ? formData.cuisine : [],
      // Ensure dietary is always an array of strings
      dietary: Array.isArray(formData.dietary) ? formData.dietary : []
    };
    
    // Log the submission data with proper format
    console.log("Submitting form data:", sanitizedData);
    
    onSubmit(sanitizedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full mx-auto">
      <div className="space-y-2 w-full">
        <Input 
          placeholder="Main ingredient (e.g., chicken, pasta, etc.)"
          value={formData.mainIngredient}
          onChange={(e) => setFormData({ ...formData, mainIngredient: e.target.value })}
          className={isMobile ? "h-10 w-full" : "h-12 text-lg w-full"}
          aria-label="Main ingredient"
        />
      </div>

      <div className="space-y-6 w-full">
        {/* Simplified Servings selector */}
        <SimplifiedServingsSelector 
          value={formData.servings}
          onChange={(servings) => setFormData({ ...formData, servings })}
        />

        {/* Simplified Cuisine selector */}
        <SimplifiedCuisineSelector
          selected={formData.cuisine as string[]}
          onChange={(cuisine) => setFormData({ ...formData, cuisine })}
        />

        {/* Simplified Dietary selector */}
        <SimplifiedDietarySelector
          selected={formData.dietary as string[]}
          onChange={(dietary) => setFormData({ ...formData, dietary })}
        />
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
