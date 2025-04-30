import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { supabase } from '@/integrations/supabase/client';
import { QuickRecipe } from '@/hooks/use-quick-recipe';

// Helper function to format ingredient for database storage
const formatIngredientForDB = (ingredient: any) => {
  if (typeof ingredient === 'string') {
    return {
      qty: 1,
      unit: '',
      item: ingredient
    };
  }
  
  // If it's already in the right format, return it
  if (ingredient.item && typeof ingredient.item === 'string') {
    return {
      qty: ingredient.qty || 1,
      unit: ingredient.unit || '',
      item: ingredient.item
    };
  }
  
  // Otherwise, extract what we can
  return {
    qty: ingredient.qty || 1,
    unit: ingredient.unit || '',
    item: typeof ingredient === 'object' ? JSON.stringify(ingredient) : String(ingredient)
  };
};

interface QuickRecipeSaveProps {
  recipe: QuickRecipe;
  onSaveSuccess?: () => void;
}

export function useQuickRecipeSave() {
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const authDrawer = useAuthDrawer();
  const navigate = useNavigate();

  const saveRecipe = async (recipe: QuickRecipe) => {
    if (!user) {
      authDrawer.open();
      return false;
    }
    
    if (!recipe) return false;
    
    // Show saving state
    setIsSaving(true);
    
    try {
      // Format ingredients for database storage
      const formattedIngredients = recipe.ingredients.map(formatIngredientForDB);
      
      // Save the recipe to the database
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: recipe.title,
          tagline: recipe.description,
          ingredients: formattedIngredients,
          instructions: recipe.steps,
          prep_time_min: recipe.prepTime,
          cook_time_min: recipe.cookTime,
          servings: 4, // Default value
          cuisine: recipe.cuisineType || 'general',
          cooking_tip: recipe.cookingTip || null, // Save the cooking tip
        })
        .select('id')
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Recipe saved",
        description: "Your recipe has been saved to My Kitchen",
      });
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your recipe. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
      return false;
    }
  };

  return {
    saveRecipe,
    isSaving,
    navigate
  };
}

export function QuickRecipeSave({ recipe, onSaveSuccess }: QuickRecipeSaveProps) {
  const { saveRecipe, isSaving } = useQuickRecipeSave();

  const handleSave = async () => {
    const success = await saveRecipe(recipe);
    if (success && onSaveSuccess) {
      onSaveSuccess();
    }
  };

  return {
    handleSave,
    isSaving
  };
}
