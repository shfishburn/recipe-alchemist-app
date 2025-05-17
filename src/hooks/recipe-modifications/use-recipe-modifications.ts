
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { QuickRecipe } from '@/types/quick-recipe';
import { useToast } from '@/hooks/use-toast';

export interface VersionInfo {
  version_number: number;
  modification_reason?: string;
  modified_at?: string;
  modified_by?: string;
  previous_version_id?: string;
}

export function useRecipeModifications(initialRecipe?: QuickRecipe) {
  const [recipe, setRecipe] = useState<QuickRecipe & { version_info?: VersionInfo }>(
    initialRecipe || {} as QuickRecipe
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  /**
   * Save a new version of the recipe
   */
  const saveRecipeVersion = useCallback(async (
    modifiedRecipe: QuickRecipe,
    reason?: string
  ) => {
    try {
      setIsSaving(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to save a recipe");
      }
      
      // Determine version number
      const currentVersion = modifiedRecipe.version_number || 1;
      const newVersionNumber = currentVersion + 1;
      
      // Create version info
      const versionInfo: VersionInfo = {
        version_number: newVersionNumber,
        modification_reason: reason || 'Recipe updated',
        modified_at: new Date().toISOString(),
        modified_by: user.id,
        previous_version_id: modifiedRecipe.id
      };
      
      // Create a new recipe with a new ID
      const newRecipe = {
        ...modifiedRecipe,
        id: undefined, // Let the database generate a new ID
        user_id: user.id,
        created_at: new Date().toISOString(),
        version_number: newVersionNumber,
        previous_version_id: modifiedRecipe.id,
        version_info: versionInfo
      };
      
      // Insert new recipe into database
      const { data, error } = await supabase
        .from('recipes')
        .insert([newRecipe])
        .select('*')
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // After new version is saved, store the version info in the recipes_versions table
      await supabase.from('recipe_versions').insert([{
        recipe_id: data.id,
        parent_version_id: modifiedRecipe.id,
        version_number: newVersionNumber,
        user_id: user.id,
        modification_request: reason || 'Recipe updated',
        recipe_data: modifiedRecipe
      }]);
      
      setRecipe(data);
      setSaveSuccess(true);
      
      // Reset save success after a short delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      // Show success toast
      toast({
        title: "Recipe updated successfully",
        description: `A new version (v${newVersionNumber}) has been created`,
      });
      
      // Navigate to the new recipe version
      navigate(`/recipes/${data.id}`);
      
      return data;
    } catch (error: any) {
      // Show error toast
      toast({
        title: "Failed to save recipe",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      console.error("Error saving recipe version:", error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [navigate, toast]);
  
  /**
   * Delete a recipe
   */
  const deleteRecipe = useCallback(async (recipeId: string) => {
    try {
      setIsDeleting(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to delete a recipe");
      }
      
      // Soft delete the recipe by setting deleted_at
      const { error } = await supabase
        .from('recipes')
        .update({
          deleted_at: new Date().toISOString()
        })
        .eq('id', recipeId)
        .eq('user_id', user.id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Show success toast
      toast({
        title: "Recipe deleted",
        description: "The recipe has been moved to trash",
      });
      
      // Navigate back to recipes page
      navigate('/recipes');
      
      return true;
    } catch (error: any) {
      // Show error toast
      toast({
        title: "Failed to delete recipe",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      console.error("Error deleting recipe:", error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [navigate, toast]);

  return {
    recipe,
    setRecipe,
    isSaving,
    isDeleting,
    saveSuccess,
    saveRecipeVersion,
    deleteRecipe,
    resetSaveSuccess: () => setSaveSuccess(false)
  };
}
