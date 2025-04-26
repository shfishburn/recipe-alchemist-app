
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface RecipeInstructionsProps {
  recipe: Recipe;
}

export function RecipeInstructions({ recipe }: RecipeInstructionsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        {recipe.instructions && recipe.instructions.length > 0 ? (
          <ol className="space-y-4 list-decimal pl-5">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="pl-1">
                <p>{step}</p>
                {index < recipe.instructions.length - 1 && (
                  <Separator className="my-4" />
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground">No instructions available</p>
        )}
      </CardContent>
    </Card>
  );
}
