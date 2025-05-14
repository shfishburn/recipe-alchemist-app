
// Error handling utilities for recipe generation API calls

export const enhanceErrorMessage = (error: any): string => {
  // Add more context to the error message
  let errorMessage = error.message || "Unknown error occurred";
  
  // Handle authentication errors explicitly
  if (error.status === 401 || error.message?.includes('401') || 
      error.message?.includes('auth') || error.message?.includes('sign in')) {
    return "Error generating recipe. Try again or sign in for enhanced features.";
  }
  
  // Specific error types with improved messages
  if (error.message?.includes("timeout")) {
    errorMessage = "Recipe generation timed out. Please try again with a simpler recipe.";
  } else if (error.message?.includes("fetch")) {
    errorMessage = "Network error while generating recipe. Please check your internet connection and try again.";
  } else if (error.status === 500 || error.message?.includes("500")) {
    errorMessage = "Server error while generating recipe. Please try again later.";
  } else if (error.status === 400 || error.message?.includes("400")) {
    errorMessage = "Invalid request format. Please check your inputs and try again.";
  } else if (error.message?.includes("JSON") || error.message?.includes("parse")) {
    errorMessage = "The AI generated an invalid recipe format. Our system is trying to recover. Please try again.";
  } else if (error.message?.includes("unterminated")) {
    errorMessage = "The recipe generation had formatting issues. Please try again with different ingredients.";
  }
  
  return errorMessage;
};

// Process error responses - returns a recipe-like object with error information
// instead of throwing an error or returning an explicit error object
export const processErrorResponse = async (error: any): Promise<any> => {
  // Authentication check first (most important for user experience)
  let errorMessage = "Error generating recipe";
  
  if (error.status === 401 || 
      (error.message && (error.message.includes('401') || 
                        error.message.includes('auth') || 
                        error.message.includes('sign in')))) {
    // CHANGED: Don't prevent unauthenticated users from generating recipes
    errorMessage = "Error generating recipe. Try again or sign in for enhanced features.";
  }
  
  // Check if the error is from Supabase Functions with response data
  if (error.context?.response) {
    try {
      // Log full response information
      console.error('Error response status:', error.context.response.status);
      
      // Clone the response to read it multiple times if needed
      const responseClone = error.context.response.clone();
      let errorResponseText: string;
      
      try {
        errorResponseText = await responseClone.text();
        console.error('Full error response:', errorResponseText);
      } catch (textError) {
        console.error('Could not read response text:', textError);
        errorResponseText = 'Could not read error response body';
      }
      
      try {
        // Try to parse the response text as JSON
        const errorResponseBody = JSON.parse(errorResponseText);
        console.error("Error response body:", errorResponseBody);
        
        // Use the error message from the response body if available
        if (errorResponseBody.error) {
          errorMessage = errorResponseBody.error;
        }
        
        // Look for specific error patterns
        if (errorResponseBody.parsing_error && errorResponseBody.raw_recipe_preview) {
          console.log("JSON parsing error details:", errorResponseBody.parsing_error);
          console.log("Raw recipe preview:", errorResponseBody.raw_recipe_preview);
          errorMessage = "The recipe couldn't be properly formatted. We're working on improving this.";
        }
      } catch (parseError) {
        console.error("Could not parse error response:", parseError);
        
        // If we couldn't parse as JSON but have text, use the text
        if (errorResponseText && errorResponseText.length < 500) {
          errorMessage = `Server error: ${errorResponseText}`;
        }
      }
    } catch (e) {
      console.error("Could not process response body:", e);
    }
  }
  
  // Enhance the error message
  const enhancedMessage = enhanceErrorMessage(error) || errorMessage;
  
  // Return a recipe-like object with error information embedded
  // REMOVED: isError flag to prevent automatic rejection by the frontend
  return {
    title: "Recipe Generation Issue",
    description: enhancedMessage,
    ingredients: [
      {
        qty_metric: 0,
        unit_metric: "",
        qty_imperial: 0,
        unit_imperial: "",
        item: "Please try again with different ingredients or options"
      }
    ],
    steps: ["There was an issue creating your recipe: " + enhancedMessage, "Please try again or use different ingredients"],
    instructions: ["There was an issue creating your recipe: " + enhancedMessage, "Please try again or use different ingredients"],
    servings: 2,
    error_message: enhancedMessage // Include error as a property but not as a flag
  };
}
