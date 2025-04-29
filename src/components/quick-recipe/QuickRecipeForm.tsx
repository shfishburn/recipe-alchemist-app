
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CookingPot } from 'lucide-react';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useIsMobile } from '@/hooks/use-mobile';

// Simplified cuisine options - focusing on the most popular choices
const cuisineOptions = [
  "Italian", "Mexican", "Asian", "Mediterranean", "American"
];

// Simplified dietary options - focusing on the most common restrictions
const dietaryOptions = [
  "No Restrictions", "Vegetarian", "Vegan", "Gluten-Free", "Low-Carb"
];

interface QuickRecipeFormProps {
  onSubmit: (data: QuickRecipeFormData) => void;
  isLoading: boolean;
}

export function QuickRecipeForm({ onSubmit, isLoading }: QuickRecipeFormProps) {
  const [formData, setFormData] = useState<QuickRecipeFormData>({
    cuisine: 'italian',
    dietary: 'no-restrictions',
    mainIngredient: '',
  });
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
      <div className="space-y-2">
        <Input 
          placeholder="Main ingredient (e.g., chicken, pasta, etc.)"
          value={formData.mainIngredient}
          onChange={(e) => setFormData({ ...formData, mainIngredient: e.target.value })}
          className={isMobile ? "h-10" : "h-12 text-lg"}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select 
          value={formData.cuisine} 
          onValueChange={(value) => setFormData({ ...formData, cuisine: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Cuisine" />
          </SelectTrigger>
          <SelectContent>
            {cuisineOptions.map((cuisine) => (
              <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={formData.dietary} 
          onValueChange={(value) => setFormData({ ...formData, dietary: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Dietary" />
          </SelectTrigger>
          <SelectContent>
            {dietaryOptions.map((diet) => (
              <SelectItem key={diet} value={diet.toLowerCase().replace(/ /g, '-')}>
                {diet}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
