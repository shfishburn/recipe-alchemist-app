
import React from 'react';
import type { Recipe } from '@/types/recipe';

interface ScienceNotesProps {
  recipe: Recipe;
  compact?: boolean;
}

export function ScienceNotes({ recipe, compact = false }: ScienceNotesProps) {
  const scienceNotes = recipe.science_notes || [];
  
  if (scienceNotes.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-4">
        No science notes available for this recipe.
      </div>
    );
  }
  
  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      <h3 className={`${compact ? "text-base" : "text-lg"} font-medium`}>
        Science Notes
      </h3>
      <ul className="space-y-2 list-disc pl-5">
        {scienceNotes.map((note, index) => (
          <li key={index} className={compact ? "text-sm" : "text-base"}>
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
