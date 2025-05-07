
// Error handling utilities for recipe generation API calls

export const enhanceErrorMessage = (error: any): string => {
  // Add more context to the error message
  let errorMessage = error.message || "Unknown error occurred";
  
  if (error.name === "FunctionsError" || error.name === "FunctionsHttpError" || error.name === "FunctionsFetchError") {
    console.error("Supabase Functions error details:", {
      name: error.name,
      message: error.message,
      context: error.context || "No context",
      status: error.status || "No status",
    });
  }
  
  if (error.message?.includes("timeout")) {
    errorMessage = "Recipe generation timed out. The AI model is taking too long to respond. Please try again with a simpler recipe.";
  } else if (error.message?.includes("fetch") || error.message?.includes("Load failed")) {
    errorMessage = "Network error connecting to our recipe service. Please check your internet connection and try again.";
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
    errorMessage = "Could not connect to our recipe service. This might be a temporary issue. Please try again in a moment.";
  } else if (error.message?.includes("CORS")) {
    errorMessage = "Cross-origin request issue. This is a technical problem on our end. Please try again in a few minutes.";
  }
  
  return errorMessage;
};

// Process error responses
export const processErrorResponse = async (error: any): Promise<never> => {
  // Check if the error is from Supabase Functions with response data
  if (error.context?.response) {
    try {
      // Log full response information
      console.error('Error response status:', error.context.response.status);
      
      const responseClone = error.context.response.clone();
      const errorResponseText = await responseClone.text();
      console.error('Full error response:', errorResponseText);
      
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
      }
    } catch (e) {
      console.error("Could not read response body:", e);
    }
  }
  
  // Check for network or CORS issues
  if (error.name === "TypeError" && error.message === "Load failed") {
    console.error("Network or CORS issue detected with edge function");
  }
  
  // Enhance the error message and throw
  const enhancedMessage = enhanceErrorMessage(error);
  throw new Error(enhancedMessage);
};
