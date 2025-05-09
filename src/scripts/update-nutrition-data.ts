
import { supabase } from '@/integrations/supabase/client';

/**
 * Script to trigger the update-nutrition-data edge function
 * This can be run from the browser console or bundled as a Node.js script
 */
export async function updateAllRecipeNutritionData(dryRun = false): Promise<void> {
  try {
    console.log(`Starting nutrition data update process (${dryRun ? 'dry run' : 'live update'})`);
    
    const { data, error } = await supabase.functions.invoke('update-nutrition-data', {
      body: { batchSize: 50, dryRun },
    });
    
    if (error) {
      console.error('Error calling update-nutrition-data function:', error);
      return;
    }
    
    console.log('Nutrition data update completed:', data);
    return data;
  } catch (error) {
    console.error('Error in updateAllRecipeNutritionData function:', error);
  }
}

// Export a simple trigger function that can be called from the browser console
(window as any).updateAllRecipeNutritionData = updateAllRecipeNutritionData;

// Usage from browser console:
// updateAllRecipeNutritionData(false) - to run a live update
// updateAllRecipeNutritionData(true) - to run a dry run without making changes
