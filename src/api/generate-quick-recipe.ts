
import { supabase } from '@/integrations/supabase/client';
import { QuickRecipeFormData, QuickRecipe } from '@/types/quick-recipe';
import { normalizeRecipeResponse } from '@/utils/recipe-normalization';
import { createTimeoutPromise, checkConnectivity } from './quick-recipe/timeout-utils';
import { formatRequestBody } from './quick-recipe/format-utils';
import { generateRecipeWithRetry } from './quick-recipe/api-utils';
import { processErrorResponse, isNetworkError } from './quick-recipe/error-utils';
import { toast } from '@/hooks/use-toast';

// Function to generate a quick recipe
export const generateQuickRecipe = async (formData: QuickRecipeFormData): Promise<QuickRecipe> => {
  try {
    console.log("Generating quick recipe with form data:", formData);
    
    if (!formData.mainIngredient) {
      throw new Error("Please provide a main ingredient");
    }
    
    // Check internet connectivity
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error("You appear to be offline. Please check your internet connection and try again.");
    }
    
    // Format the request body
    const requestBody = formatRequestBody(formData);
    
    console.log("Sending request to edge function with body:", JSON.stringify(requestBody));
    
    // Check connectivity to Supabase domain
    const isConnected = await checkConnectivity('https://zjyfumqfrtppleftpzjd.supabase.co');
    if (!isConnected) {
      console.warn("Cannot reach Supabase domain - connectivity issue detected");
      // Show toast warning but continue with the request
      toast({
        title: "Connectivity warning",
        description: "We're having trouble connecting to our recipe service. This might affect recipe generation.",
        variant: "warning"
      });
    }
    
    // Set a timeout for the request (120 seconds - increased from 90)
    const timeoutPromise = createTimeoutPromise(120000);
    
    // Use our retry mechanism with timeout
    const data = await Promise.race([
      generateRecipeWithRetry(requestBody),
      timeoutPromise
    ]);
    
    // Check for error in data
    if (!data) {
      console.error('No data returned from recipe generation');
      throw new Error('No recipe data returned. Please try again.');
    }
    
    if (data.error) {
      console.error('Error in recipe data:', data.error);
      throw new Error(data.error);
    }
    
    // Normalize the recipe data to ensure it matches our expected structure
    const normalizedRecipe = normalizeRecipeResponse(data);
    
    console.log('Normalized recipe:', normalizedRecipe);
    
    return normalizedRecipe;
  } catch (error: any) {
    console.error('Error in generateQuickRecipe:', error);
    
    // Special handling for network errors
    if (isNetworkError(error)) {
      // Log additional diagnostics for network errors
      console.error("Network error details:", {
        online: navigator?.onLine,
        url: window.location.href,
        userAgent: navigator?.userAgent,
        platform: navigator?.platform,
        error: error.toString(),
        timestamp: new Date().toISOString()
      });
      
      // Show a toast with network troubleshooting advice
      toast({
        title: "Connection issue detected",
        description: "Please check your internet connection, try disabling any VPN, ad blocker, or firewall, then try again.",
        variant: "destructive",
        duration: 10000
      });
    }
    
    return processErrorResponse(error);
  }
};
