
// Error handling utilities for recipe generation API calls

export const enhanceErrorMessage = (error: any): string => {
  // Add more context to the error message
  let errorMessage = error?.message || "Unknown error occurred";
  
  if (error?.name === "FunctionsError" || error?.name === "FunctionsHttpError") {
    console.error("Supabase Functions error details:", {
      name: error.name,
      message: error.message,
      context: error.context || "No context",
      status: error.status || "No status",
    });
  }
  
  if (typeof errorMessage === "string") {
    if (errorMessage.includes("timeout")) {
      errorMessage = "Recipe generation timed out. The AI model is taking too long to respond. Please try again with a simpler recipe.";
    } else if (errorMessage.includes("fetch")) {
      errorMessage = "Network error while generating recipe. Please check your internet connection and try again.";
    } else if (error?.status === 500 || errorMessage.includes("500")) {
      errorMessage = "Server error while generating recipe. Our recipe AI is currently experiencing issues. Please try again later.";
    } else if (error?.status === 400 || errorMessage.includes("400")) {
      errorMessage = "Invalid request format. Please check your inputs and try again.";
    } else if (errorMessage.includes("SyntaxError") || errorMessage.includes("JSON")) {
      errorMessage = "Error processing the recipe. The AI generated an invalid response format. Please try again.";
    } else if (errorMessage.includes("OpenAI API key")) {
      errorMessage = "There's an issue with our AI service configuration. Our team has been notified.";
    } else if (errorMessage.includes("Empty request body")) {
      errorMessage = "The request couldn't be processed because it was empty. Please try again.";
    }
  }
  
  return errorMessage;
};

// Process error responses
export const processErrorResponse = async (error: any): Promise<never> => {
  // Check if the error is from Supabase Functions with response data
  if (error?.context?.response) {
    try {
      // Log full response information
      console.error('Error response status:', error.context.response.status);
      
      const responseClone = error.context.response.clone();
      const errorResponseText = await responseClone.text();
      console.error('Full error response:', errorResponseText);
      
      try {
        // Try to parse the response text as JSON
        const errorResponseBody = JSON.parse(errorResponseText) as Record<string, any>;
        console.error("Error response body:", errorResponseBody);
        
        // Use the error message from the response body if available
        if (errorResponseBody.error) {
          throw new Error(errorResponseBody.error);
        }
      } catch (parseError) {
        console.error("Could not parse error response:", parseError);
      }
    } catch (e) {
      console.error("Could not read response body:", e);
    }
  }
  
  // Enhance the error message and throw
  const enhancedMessage = enhanceErrorMessage(error);
  throw new Error(enhancedMessage);
};
