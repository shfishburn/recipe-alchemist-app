
import React from 'react';

interface SimpleIngredientDisplayProps {
  ingredients: any[]; // Accept both string[] and object[] types
}

export function SimpleIngredientDisplay({ ingredients }: SimpleIngredientDisplayProps) {
  if (!ingredients || ingredients.length === 0) {
    return <div className="text-muted-foreground italic">No ingredients listed</div>;
  }

  return (
    <ul className="ingredients-list list-disc pl-5 space-y-1.5">
      {ingredients.map((ingredient, index) => {
        const text = typeof ingredient === 'string' 
          ? ingredient 
          : (ingredient?.item || '');
          
        return <li key={index} className="pb-0.5">{text}</li>;
      })}
    </ul>
  );
}
