
import { supabase } from "@/integrations/supabase/client";

/**
 * Function to search the USDA Food Data Central database
 */
export async function searchUsdaFoods(query: string, pageSize = 10, pageNumber = 1) {
  try {
    const { data, error } = await supabase.functions.invoke('usda-food-api', {
      body: {
        query,
        pageSize,
        pageNumber,
        method: 'search'
      }
    });
    
    if (error) {
      console.error('Error searching USDA foods:', error);
      return { foods: [], totalHits: 0 };
    }
    
    return data;
  } catch (error) {
    console.error('Error in searchUsdaFoods:', error);
    return { foods: [], totalHits: 0 };
  }
}

/**
 * Function to import a food from USDA Food Data Central into our database
 */
export async function importUsdaFood(fdcId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('usda-food-api', {
      body: { 
        fdcId,
        method: 'import-food'
      }
    });
    
    if (error) {
      console.error('Error importing USDA food:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in importUsdaFood:', error);
    return null;
  }
}
