import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';
import { useToast } from '@/hooks/use-toast';

export function useQuickRecipeSave() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const saveRecipe = async (recipe: QuickRecipe) => {
    try {
      setIsSaving(true);
      
      // Check if user is authenticated
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save recipes",
          variant: "destructive",
        });
        return false;
      }
      
      // Transform quick recipe ingredients to match the database structure
      // Preserve shop_size_qty and shop_size_unit in the saved recipe
      const ingredients = recipe.ingredients.map(ing => {
        // Handle different input formats
        if (typeof ing === 'string') {
          return { qty: 1, unit: '', item: ing };
        }
        
        // Construct properly formatted ingredient object
        // Keep shop_size information when available
        return {
          qty: ing.qty,
          unit: ing.unit,
          item: typeof ing.item === 'string' ? ing.item : (ing.item?.item || ''),
          notes: ing.notes,
          // Preserve shopping-specific information
          shop_size_qty: ing.shop_size_qty,
          shop_size_unit: ing.shop_size_unit
        };
      });
      
      // Convert science notes to the correct format
      const science_notes = recipe.science_notes || [];
      
      // Create recipe in database
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          title: recipe.title,
          description: recipe.description,
          ingredients,
          instructions: recipe.steps,
          prep_time_min: recipe.prep_time_min,
          cook_time_min: recipe.cook_time_min,
          servings: recipe.servings || 4,
          user_id: userData.user.id,
          science_notes,
          cuisine: Array.isArray(recipe.cuisine) && recipe.cuisine.length > 0 ? recipe.cuisine[0] : null,
          dietary: Array.isArray(recipe.dietary) && recipe.dietary.length > 0 ? recipe.dietary[0] : null,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving recipe:', error);
        toast({
          title: "Error",
          description: "Failed to save recipe",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Success!",
        description: "Recipe saved successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error in saveRecipe:', error);
      toast({
        title: "Error",
        description: "Something went wrong while saving the recipe",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  return { saveRecipe, isSaving, navigate };
}
