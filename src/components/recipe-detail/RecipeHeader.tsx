
import React from 'react';
import { ShareButton } from './ShareButton';
import { RecipeActions } from './RecipeActions';
import { NutriScoreBadge } from './nutrition/NutriScoreBadge';
import { useNutriScore } from '@/hooks/use-nutri-score';
import { Recipe } from '@/types/recipe';

interface RecipeHeaderProps {
  recipe: Recipe;
  currentTab: string;
  onOpenChat: () => void;
}

export function RecipeHeader({ recipe, currentTab, onOpenChat }: RecipeHeaderProps) {
  const { title, tagline } = recipe;
  const { grade, hasData } = useNutriScore(recipe);

  return (
    <div className="relative mb-6">
      <div className="mt-6">
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {tagline && (
          <p className="mt-2 text-lg text-muted-foreground">{tagline}</p>
        )}
        
        {/* Nutri-Score Badge - Only show when there's valid data */}
        {hasData && grade !== null && (
          <div className="mt-2">
            <NutriScoreBadge 
              grade={grade}
              size="md"
              showLabel
            />
          </div>
        )}
      </div>

      <div className="mt-4">
        <RecipeActions
          recipe={recipe}
          onOpenChat={onOpenChat}
          currentTab={currentTab}
        />
      </div>
    </div>
  );
}
