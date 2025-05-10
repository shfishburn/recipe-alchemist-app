
// Error handling utilities for recipe generation API calls

export const enhanceErrorMessage = (error: any): string => {
  // Add more context to the error message
  let errorMessage = error.message || "Unknown error occurred";
  
  if (error.name === "FunctionsError" || error.name === "FunctionsHttpError") {
    console.error("Supabase Functions error details:", {
      name: error.name,
      message: error.message,
      context: error.context || "No context",
      status: error.status || "No status",
    });
  }
  
  // Handle authentication errors explicitly
  if (error.status === 401 || error.message?.includes('401') || 
      error.message?.includes('auth') || error.message?.includes('sign in')) {
    return "Error generating recipe. Try again or sign in for enhanced features.";
  }
  
  if (error.message?.includes("timeout")) {
    errorMessage = "Recipe generation timed out. The AI model is taking too long to respond. Please try again with a simpler recipe.";
  } else if (error.message?.includes("fetch")) {
    errorMessage = "Network error while generating recipe. Please check your internet connection and try again.";
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
  }
  
  return errorMessage;
};

// Process error responses
export const processErrorResponse = async (error: any): Promise<never> => {
  // Authentication check first (most important for user experience)
  if (error.status === 401 || 
      (error.message && (error.message.includes('401') || 
                        error.message.includes('auth') || 
                        error.message.includes('sign in')))) {
    // CHANGED: Don't prevent unauthenticated users from generating recipes
    throw new Error("Error generating recipe. Try again or sign in for enhanced features.");
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
          throw new Error(errorResponseBody.error);
        }
      } catch (parseError) {
        console.error("Could not parse error response:", parseError);
        
        // If we couldn't parse as JSON but have text, use the text
        if (errorResponseText && errorResponseText.length < 500) {
          throw new Error(`Server error: ${errorResponseText}`);
        }
      }
    } catch (e) {
      console.error("Could not process response body:", e);
      
      // If the error has a status code, include it in the message
      if (error.context.response.status) {
        throw new Error(`Server error with status code: ${error.context.response.status}`);
      }
    }
  }
  
  // Enhance the error message and throw
  const enhancedMessage = enhanceErrorMessage(error);
  throw new Error(enhancedMessage);
};
