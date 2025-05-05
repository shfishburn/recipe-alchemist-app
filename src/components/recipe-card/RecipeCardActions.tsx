
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';
import type { Recipe } from '@/types/recipe';

interface RecipeCardActionsProps {
  recipe: Recipe;
  variant?: 'default' | 'minimal';
}

export function RecipeCardActions({ recipe, variant = 'default' }: RecipeCardActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" className="px-2">
        <Heart className="h-4 w-4 mr-1" />
        {variant === 'default' ? 'Save' : ''}
      </Button>
      <Button variant="ghost" size="sm" className="px-2">
        <Share2 className="h-4 w-4 mr-1" />
        {variant === 'default' ? 'Share' : ''}
      </Button>
    </div>
  );
}
