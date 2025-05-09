
import { supabase } from '@/integrations/supabase/client';

/**
 * Script to update science notes and analysis data for recipes
 * This can be run from the browser console or from the admin UI
 */
export async function updateRecipeScienceData(dryRun = false): Promise<any> {
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
      return { status: 'error', error: error.message };
    }
    
    console.log('Science data update completed:', data);
    return data;
  } catch (error) {
    console.error('Error in updateRecipeScienceData function:', error);
    return { status: 'error', error: String(error) };
  }
}

// Export a simple trigger function that can be called from the browser console
(window as any).updateRecipeScienceData = updateRecipeScienceData;
