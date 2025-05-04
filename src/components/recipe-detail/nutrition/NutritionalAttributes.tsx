
import React from 'react';
import { Check, X, Activity, Leaf, Heart, Droplet } from 'lucide-react';
import { useNutriScore } from '@/hooks/use-nutri-score';
import type { Recipe } from '@/types/recipe';

interface NutritionalAttributesProps {
  recipe: Recipe;
}

export function NutritionalAttributes({ recipe }: NutritionalAttributesProps) {
  const { positives, negatives, healthScore } = useNutriScore(recipe);
  
  // Define attribute categories
  const attributes = [
    {
      name: 'Protein Source',
      value: recipe?.nutrition?.protein > 15,
      icon: <Activity className="h-4 w-4" />,
      description: 'Contains over 15g protein per serving',
    },
    {
      name: 'High Fiber',
      value: recipe?.nutrition?.fiber > 5,
      icon: <Leaf className="h-4 w-4" />,
      description: 'Contains over 5g fiber per serving',
    },
    {
      name: 'Heart Healthy',
      value: (recipe?.nutrition?.fat || 0) < 10 && (recipe?.nutrition?.sodium || 0) < 500,
      icon: <Heart className="h-4 w-4" />,
      description: 'Low in sodium and total fat',
    },
    {
      name: 'Low Sugar',
      value: (recipe?.nutrition?.sugar || 0) < 5,
      icon: <Droplet className="h-4 w-4" />,
      description: 'Contains less than 5g sugar per serving',
    },
  ];

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {attributes.map((attribute, index) => (
          <div 
            key={index}
            className="flex items-center space-x-2 rounded-lg border p-3"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              attribute.value ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
            }`}>
              {attribute.value ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </div>
            <div>
              <div className="font-medium">{attribute.name}</div>
              <div className="text-sm text-muted-foreground">{attribute.description}</div>
            </div>
          </div>
        ))}
      </div>
      
      {healthScore && (
        <div className="mt-4 rounded-lg border p-4">
          <div className="font-medium">Overall Health Score</div>
          <div className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            healthScore === 'high' ? 'bg-green-100 text-green-800' :
            healthScore === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {healthScore === 'high' ? 'High' : healthScore === 'medium' ? 'Medium' : 'Low'}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {healthScore === 'high' 
              ? 'This recipe is considered nutritionally balanced with positive health benefits.'
              : healthScore === 'medium'
              ? 'This recipe has some nutritional benefits but could be improved in certain areas.'
              : 'This recipe should be consumed in moderation as part of a balanced diet.'}
          </div>
        </div>
      )}
    </div>
  );
}
