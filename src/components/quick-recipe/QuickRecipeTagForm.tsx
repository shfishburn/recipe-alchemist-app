
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
      // Use a random ingredient from popular cuisines if user didn't enter anything
      const randomIngredient = formData.cuisine === 'italian' ? 'pasta' :
                              formData.cuisine === 'mexican' ? 'beans' :
                              formData.cuisine === 'asian' ? 'rice' : 'chicken';
      onSubmit({...formData, mainIngredient: randomIngredient});
    } else {
      onSubmit(formData);
    }
  };

  const selectCuisine = (value: string) => {
    setFormData({ ...formData, cuisine: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="mainIngredient" className="text-sm font-medium">
            I have...
          </label>
          <Input 
            id="mainIngredient"
            placeholder="e.g., some chicken, leftover rice..."
            value={formData.mainIngredient}
            onChange={(e) => setFormData({ ...formData, mainIngredient: e.target.value })}
            className={`${isMobile ? "h-12" : "h-14 text-lg"} text-center`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cuisine style:</label>
          <div className="flex flex-wrap gap-2 justify-center">
            {CUISINES.map(cuisine => (
              <Badge 
                key={cuisine.value} 
                variant="outline" 
                className={`cursor-pointer hover:bg-accent px-3 py-1.5 text-sm ${
                  formData.cuisine === cuisine.value ? 'bg-recipe-green text-white hover:bg-recipe-green/90' : ''
                }`}
                onClick={() => selectCuisine(cuisine.value)}
              >
                {cuisine.name}
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
        <CookingPot className="mr-2 h-5 w-5" />
        {isLoading ? 'Creating Recipe...' : 'Find Recipe Ideas'}
      </Button>
    </form>
  );
}
