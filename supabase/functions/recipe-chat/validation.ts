
// This function validates and formats the AI response to extract structured changes
export function validateRecipeChanges(rawResponse: string) {
  console.log("Validating response length:", rawResponse.length);
  
  try {
    // First check if the response contains error information from OpenAI
    if (typeof rawResponse === 'string' && 
        (rawResponse.includes('"error":') && rawResponse.includes('"message":'))) {
      console.error("OpenAI error detected in response:", rawResponse);
      return {
        textResponse: "I encountered an error processing your request. Please try again.",
        changes: { mode: "none" }
      };
    }
    
    // With response_format: { type: "json_object" }, the response should be valid JSON
    const parsedResponse = JSON.parse(rawResponse);
    
    // Standardize response format - ensure consistent field naming
    if (!parsedResponse.textResponse && parsedResponse.text_response) {
      parsedResponse.textResponse = parsedResponse.text_response;
      // Delete the inconsistent field to prevent confusion
      delete parsedResponse.text_response;
    }

    if (!parsedResponse.textResponse) {
      parsedResponse.textResponse = "Analysis complete.";
    }
    
    // Ensure that ingredients have a "mode" property and it's set to "none" if items array is empty or missing
    if (parsedResponse.changes && parsedResponse.changes.ingredients) {
      if (!Array.isArray(parsedResponse.changes.ingredients.items) || 
          parsedResponse.changes.ingredients.items.length === 0) {
        parsedResponse.changes.ingredients.mode = "none";
        parsedResponse.changes.ingredients.items = [];
      }
    } else if (parsedResponse.changes) {
      // Initialize ingredients with safe defaults if missing
      parsedResponse.changes.ingredients = { mode: "none", items: [] };
    } else {
      // Ensure changes object exists
      parsedResponse.changes = { 
        mode: "none",
        ingredients: { mode: "none", items: [] }
      };
    }
    
    // Ensure science_notes is always a valid array
    if (parsedResponse.science_notes) {
      if (!Array.isArray(parsedResponse.science_notes)) {
        parsedResponse.science_notes = [];
      } else {
        // Filter out any non-string values
        parsedResponse.science_notes = parsedResponse.science_notes
          .filter(note => typeof note === 'string' && note.trim() !== '')
          .map(note => note.trim());
      }
    } else {
      parsedResponse.science_notes = [];
    }
    
    // Ensure recipe object is present
    if (!parsedResponse.recipe) {
      console.warn("Response missing recipe object, using default");
      parsedResponse.recipe = {};
    }
    
    // Ensure followUpQuestions is always a valid array
    if (!parsedResponse.followUpQuestions || !Array.isArray(parsedResponse.followUpQuestions)) {
      parsedResponse.followUpQuestions = [];
    }
    
    // Ensure techniques is always a valid array
    if (!parsedResponse.techniques || !Array.isArray(parsedResponse.techniques)) {
      parsedResponse.techniques = [];
    }
    
    // Ensure troubleshooting is always a valid array
    if (!parsedResponse.troubleshooting || !Array.isArray(parsedResponse.troubleshooting)) {
      parsedResponse.troubleshooting = [];
    }
    
    return parsedResponse;
  } catch (error) {
    console.error("Error validating recipe changes:", error);
    // If JSON parsing fails, return a simple object with the raw text
    return {
      textResponse: typeof rawResponse === 'string' 
        ? rawResponse 
        : "Failed to process response. Please try again.",
      changes: { mode: "none" },
      recipe: {},
      science_notes: [],
      techniques: [],
      troubleshooting: [],
      followUpQuestions: []
    };
  }
}
