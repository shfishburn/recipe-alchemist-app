
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PrintRecipe } from './PrintRecipe';
import { CookingMode } from './CookingMode';
import { Printer, ChefHat, Share2, Trash2 } from 'lucide-react';
import { useDeleteRecipe } from '@/hooks/use-delete-recipe';
import type { Recipe } from '@/types/recipe';

interface RecipeActionsProps {
  recipe: Recipe;
  sticky?: boolean;
}

export function RecipeActions({ recipe, sticky = false }: RecipeActionsProps) {
  const navigate = useNavigate();
  const { mutate: deleteRecipe } = useDeleteRecipe();
  const [isSticky, setIsSticky] = useState(false);
  
  useEffect(() => {
    if (!sticky) return;
    
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);
  
  const shareRecipe = async () => {
    if (!navigator.share) return;
    
    try {
      await navigator.share({
        title: recipe.title,
        text: recipe.tagline || `Check out this ${recipe.cuisine || ''} recipe for ${recipe.title}`,
        url: window.location.href,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDelete = () => {
    deleteRecipe(recipe.id);
    navigate('/recipes');
  };
  
  const containerClasses = sticky && isSticky 
    ? "fixed bottom-0 left-0 right-0 bg-background border-t p-3 shadow-lg z-30 transition-all duration-300 flex justify-center"
    : "flex flex-wrap gap-2";
  
  const innerClasses = sticky && isSticky 
    ? "container max-w-4xl flex flex-wrap gap-2" 
    : "";
  
  return (
    <div className={containerClasses}>
      <div className={innerClasses}>
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 md:flex-none md:w-auto"
          onClick={() => window.document.getElementById('cooking-mode-trigger')?.click()}
        >
          <ChefHat className="h-4 w-4 mr-2" />
          Cooking Mode
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 md:flex-none md:w-auto"
          onClick={() => window.document.getElementById('print-recipe-trigger')?.click()}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Recipe
        </Button>
        
        {navigator.share && (
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 md:flex-none md:w-auto"
            onClick={shareRecipe}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
        
        <Button 
          variant="destructive" 
          size="sm"
          className="flex-1 md:flex-none md:w-auto"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}
