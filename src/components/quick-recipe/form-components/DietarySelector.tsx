
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Carrot, WheatOff, MilkOff, Heart, LeafyGreen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Dietary restrictions
export const DIETARY = [
  { name: "Low-Carb", value: "low-carb", icon: Carrot },
  { name: "Gluten-Free", value: "gluten-free", icon: WheatOff },
  { name: "Dairy-Free", value: "dairy-free", icon: MilkOff },
  { name: "Healthy", value: "healthy", icon: Heart },
  { name: "Vegetarian", value: "vegetarian", icon: LeafyGreen }
];

export const MAX_DIETARY_SELECTIONS = 2;

interface DietarySelectorProps {
  selectedDietary: string[];
  onDietaryToggle: (value: string) => void;
}

export function DietarySelector({ selectedDietary, onDietaryToggle }: DietarySelectorProps) {
  const { toast } = useToast();

  const handleToggle = (value: string) => {
    // If the dietary option is already selected, allow removal
    if (selectedDietary.includes(value)) {
      onDietaryToggle(value);
      return;
    }
    
    // Check if we've reached the maximum selections
    if (selectedDietary.length >= MAX_DIETARY_SELECTIONS) {
      toast({
        title: "Selection limit reached",
        description: `You can select up to ${MAX_DIETARY_SELECTIONS} dietary preferences.`,
        variant: "default"
      });
      return;
    }
    
    // Toggle the dietary option
    onDietaryToggle(value);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <LeafyGreen className="h-5 w-5 text-recipe-orange" />
        <label className="text-base font-medium text-recipe-orange">
          Any dietary preferences? <span className="text-gray-600 text-sm">(select up to {MAX_DIETARY_SELECTIONS})</span>
        </label>
      </div>
      <div className="flex flex-wrap gap-3 justify-start w-full">
        {DIETARY.map(diet => (
          <Badge 
            key={diet.value} 
            variant="outline" 
            className={`cursor-pointer hover:bg-accent px-3 py-1.5 text-sm ${
              selectedDietary.includes(diet.value) ? 'bg-recipe-orange text-white hover:bg-recipe-orange/90' : ''
            }`}
            onClick={() => handleToggle(diet.value)}
          >
            <diet.icon className="w-3.5 h-3.5 mr-1" />
            {diet.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
