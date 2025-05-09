
import { supabase } from '@/integrations/supabase/client';
import { BatchUpdateResult } from '@/scripts/update-nutrition-data';

/**
 * Script to update science notes and analysis data for recipes
 * This can be run from the browser console or from the admin UI
 */
export async function updateRecipeScienceData(dryRun = false): Promise<BatchUpdateResult> {
  try {
    console.log(`Starting science data update process (${dryRun ? 'dry run' : 'live update'})`);
    
    // This would ideally call a dedicated edge function for science updates
    // For now, we'll use the same function as nutrition updates
    const { data, error } = await supabase.functions.invoke('update-nutrition-data', {
      body: { 
        batchSize: 50, 
        dryRun,
        updateType: 'science' // Signal that we want to update science data
      },
    });
    
    if (error) {
      console.error('Error calling update function:', error);
      return {
        status: 'error',
        totalRecipes: 0,
        updatedRecipes: 0,
        errorCount: 1,
        dryRun,
        updateType: 'science'
      };
    }
    
    console.log('Science data update completed:', data);
    return data as BatchUpdateResult;
  } catch (error) {
    console.error('Error in updateRecipeScienceData function:', error);
    return {
      status: 'error',
      totalRecipes: 0,
      updatedRecipes: 0,
      errorCount: 1,
      dryRun,
      updateType: 'science'
    };
  }
}

// Export a simple trigger function that can be called from the browser console
(window as any).updateRecipeScienceData = updateRecipeScienceData;
