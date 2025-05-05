
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'react-router-dom';
import { Recipe } from '@/types/recipe';
import { toast } from 'sonner';
import { useFavoriteRecipe } from '@/hooks/use-favorite-recipe';

interface RecipeCardActionsProps {
  recipe: Recipe | { id: string; title: string };
}

export function RecipeCardActions({ recipe }: RecipeCardActionsProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, isLoading } = useFavoriteRecipe(recipe.id);

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error('Please log in to save favorites');
      return;
    }
    
    toggleFavorite();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
          url: window.location.origin + `/recipes/${recipe.id}`,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(
          window.location.origin + `/recipes/${recipe.id}`
        );
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className="px-2"
      >
        <Heart 
          className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
        />
        <span className="ml-1 text-xs">Save</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleShare}
        className="px-2"
      >
        <Share2 className="h-4 w-4 text-gray-500" />
        <span className="ml-1 text-xs">Share</span>
      </Button>
      
      <Link to={`/recipes/${recipe.id}#modify`}>
        <Button 
          variant="ghost" 
          size="sm"
          className="px-2"
        >
          <MessageCircle className="h-4 w-4 text-gray-500" />
          <span className="ml-1 text-xs">Modify</span>
        </Button>
      </Link>
    </div>
  );
}
