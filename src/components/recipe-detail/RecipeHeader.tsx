
import React from 'react';
import { ShareButton } from './ShareButton';
import { RecipeActions } from './RecipeActions';
import { NutriScoreBadge } from './nutrition/NutriScoreBadge';
import { useNutriScore } from '@/hooks/use-nutri-score';

interface RecipeHeaderProps {
  recipe: {
    id: string;
    title: string;
    image_url?: string;
    tagline?: string;
  };
  currentTab: string;
  onOpenChat: () => void;
}

export function RecipeHeader({ recipe, currentTab, onOpenChat }: RecipeHeaderProps) {
  const { title, image_url, tagline } = recipe;
  const { grade, hasData } = useNutriScore(recipe);

  return (
    <div className="relative mb-6">
      {image_url && (
        <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-80">
          <img
            src={image_url}
            alt={title}
            className="h-full w-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Nutri-Score Badge */}
          {hasData && (
            <div className="absolute right-3 top-3">
              <NutriScoreBadge 
                grade={grade}
                size="lg"
              />
            </div>
          )}
          
          <div className="absolute left-3 top-3">
            <ShareButton 
              recipe={recipe}
              variant="ghost"
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {tagline && (
          <p className="mt-2 text-lg text-muted-foreground">{tagline}</p>
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
