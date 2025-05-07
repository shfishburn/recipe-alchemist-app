import { supabase } from '@/integrations/supabase/client';
import { QuickRecipeFormData, QuickRecipe } from '@/types/quick-recipe';
import { normalizeRecipeResponse } from '@/utils/recipe-normalization';
import { toast } from '@/hooks/use-toast';

// Function to generate a quick recipe
export const generateQuickRecipe = async (formData: QuickRecipeFormData): Promise<QuickRecipe> => {
  try {
    console.log("Generating quick recipe with form data:", formData);
    
    // Basic input validation
    if (!formData.mainIngredient) {
      throw new Error("Please provide a main ingredient");
    }
    
    // Check internet connectivity
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error("You appear to be offline. Please check your internet connection and try again.");
    }
    
    // Format the request body - keep this simple formatting
    const requestBody = {
      mainIngredient: formData.mainIngredient,
      cuisine: formData.cuisine || 'any',
      dietary: formData.dietary || '',
      servings: formData.servings || 2,
      maxCalories: formData.maxCalories || null,
      embeddingModel: 'text-embedding-ada-002' // Default embedding model
    };
    
    console.log("Sending request to edge function with body:", JSON.stringify(requestBody));
    
    // Simple direct invocation of the function - no complex retry or timeout mechanisms
    const { data, error } = await supabase.functions.invoke('generate-quick-recipe', {
      body: requestBody
    });
    
    // Handle errors from function invocation
    if (error) {
      console.error('Error in Supabase function invocation:', error);
      throw new Error(error.message || 'Error generating recipe');
    }
    
    // Check for empty or invalid response
    if (!data) {
      console.error('No data returned from recipe generation');
      throw new Error('No recipe data returned. Please try again.');
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
    
    // Process and enhance error message
    const errorMessage = enhanceErrorMessage(error);
    
    // Return a placeholder recipe with error information - ensuring it conforms to QuickRecipe type
    return {
      title: "Recipe Generation Error",
      description: errorMessage,
      ingredients: [],
      steps: ["Please try again with a different ingredient or check your internet connection."],
      servings: 0,
      // Remove the error property as it's not in the QuickRecipe type
    };
  }
};

// Helper function to check if an error is network-related
const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  return (
    error.name === "TypeError" && error.message === "Load failed" ||
    error.message?.includes("Failed to fetch") ||
    error.message?.includes("NetworkError") ||
    error.message?.includes("Failed to send a request") ||
    error.message?.includes("Network request failed") ||
    (typeof navigator !== 'undefined' && !navigator.onLine)
  );
};

// Helper function to enhance error messages with more context
const enhanceErrorMessage = (error: any): string => {
  let errorMessage = error.message || "Unknown error occurred";
  
  if (error.name === "AbortError" || error.message?.includes("timeout") || error.message?.includes("timed out")) {
    errorMessage = "Recipe generation timed out. The AI model is taking too long to respond. Please try again with a simpler recipe.";
  } else if (error.name === "TypeError" && error.message === "Load failed") {
    errorMessage = "Could not connect to our recipe service. This appears to be a network issue. Please check your internet connection, disable any VPN or firewall, and try again.";
  } else if (error.message?.includes("fetch") || error.message?.includes("Failed to send a request")) {
    errorMessage = "Network error connecting to our recipe service. This could be due to network connectivity issues or a temporary service disruption. Please check your internet connection and try again.";
  } else if (error.status === 500 || error.message?.includes("500")) {
    errorMessage = "Server error while generating recipe. Our recipe AI is currently experiencing issues. Please try again later.";
  } else if (error.status === 400 || error.message?.includes("400")) {
    errorMessage = "Invalid request format. Please check your inputs and try again.";
  } else if (error.message?.includes("SyntaxError") || error.message?.includes("JSON")) {
    errorMessage = "Error processing the recipe. The AI generated an invalid response format. Please try again.";
  } else if (error.message?.includes("OpenAI API key")) {
    errorMessage = "There's an issue with our AI service configuration. Our team has been notified.";
  } else if (error.message?.includes("Empty request body")) {
    errorMessage = "The request couldn't be processed because it was empty. Please try again.";
  } else if (error.message?.includes("Failed to send a request") || error.message?.includes("Edge Function")) {
    errorMessage = "Could not connect to our recipe service. This might be a temporary issue or could be related to your network. Please try disabling your VPN, ad blocker, or firewall, and try again after a few minutes.";
  } else if (error.message?.includes("CORS")) {
    errorMessage = "Cross-origin request issue. This is a technical problem that might be caused by security settings in your browser or network. Please try a different browser or network connection.";
  }
  
  return errorMessage;
};
