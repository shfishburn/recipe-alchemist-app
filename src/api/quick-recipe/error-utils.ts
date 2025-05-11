
// Error handling utilities for recipe generation API calls

export const enhanceErrorMessage = (error: any): string => {
  // Add more context to the error message
  let errorMessage = error.message || "Unknown error occurred";
  
  // Handle authentication errors explicitly
  if (error.status === 401 || error.message?.includes('401') || 
      error.message?.includes('auth') || error.message?.includes('sign in')) {
    return "Error generating recipe. Try again or sign in for enhanced features.";
  }
  
  if (error.message?.includes("timeout")) {
    errorMessage = "Recipe generation timed out. Please try again with a simpler recipe.";
  } else if (error.message?.includes("fetch")) {
    errorMessage = "Network error while generating recipe. Please check your internet connection and try again.";
  } else if (error.status === 500 || error.message?.includes("500")) {
    errorMessage = "Server error while generating recipe. Please try again later.";
  } else if (error.status === 400 || error.message?.includes("400")) {
    errorMessage = "Invalid request format. Please check your inputs and try again.";
  }
  
  return errorMessage;
};

// Process error responses - returns an error object instead of throwing
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
  
  // Return an error object that conforms to QuickRecipe shape
  return {
    title: "Error generating recipe",
    description: enhancedMessage,
    ingredients: [],
    steps: ["An error occurred while generating the recipe"],
    servings: 0,
    isError: true, // Flag to indicate this is an error object
    error: enhancedMessage
  };
}
